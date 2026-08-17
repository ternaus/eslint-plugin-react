/**
 * @fileoverview Disallow React components from returning undefined.
 */

import astUtil from '../util/ast.js';
import Components from '../util/Components.js';
import docsUrl from '../util/docsUrl.js';
import requiredModule0 from '../util/eslint.js';
import report from '../util/report.js';
import variableUtil from '../util/variable.js';

const getAncestors = requiredModule0.getAncestors;

const messages = {
  missingReturn: 'Component can complete without returning a render value. Return null to render nothing explicitly.',
  undefinedReturn: 'Component should not return undefined. Return null to render nothing explicitly.',
};

function isFunction(node) {
  return node && ['ArrowFunctionExpression', 'FunctionDeclaration', 'FunctionExpression'].includes(node.type);
}

function getEnclosingFunction(context, node) {
  return getAncestors(context, node).toReversed().find(isFunction);
}

function isNamedLikeComponent(node) {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return /^[A-Z]/u.test(node.id.name);
  }

  if (node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'Identifier') {
    return /^[A-Z]/u.test(node.parent.id.name);
  }

  if (node.parent.type === 'AssignmentExpression' && node.parent.left.type === 'Identifier') {
    return /^[A-Z]/u.test(node.parent.left.name);
  }

  return false;
}

function isUninitializedVariable(context, node) {
  if (node.type !== 'Identifier') {
    return false;
  }

  const variable = variableUtil.getVariableFromContext(context, node, node.name);
  if (!variable || variable.defs.length === 0) {
    return node.name === 'undefined';
  }

  const definition = variableUtil.getLatestVariableDefinition(variable);
  if (!definition || definition.type !== 'Variable' || !definition.node || definition.node.init) {
    return false;
  }

  return !variable.references.some(
    (reference) =>
      reference.isWrite() &&
      reference.identifier.range[0] > definition.node.range[0] &&
      reference.identifier.range[0] < node.range[0],
  );
}

function isStaticallyUndefined(context, node) {
  if (!node) {
    return true;
  }

  if (node.type === 'UnaryExpression') {
    return node.operator === 'void';
  }

  if (node.type === 'ConditionalExpression') {
    return isStaticallyUndefined(context, node.consequent) || isStaticallyUndefined(context, node.alternate);
  }

  if (node.type === 'SequenceExpression') {
    return isStaticallyUndefined(context, node.expressions.at(-1));
  }

  return isUninitializedVariable(context, node);
}

function canCompleteNormally(node) {
  if (!node) {
    return true;
  }

  if (node.type === 'ReturnStatement' || node.type === 'ThrowStatement') {
    return false;
  }

  if (node.type === 'BlockStatement') {
    return node.body.every(canCompleteNormally);
  }

  if (node.type === 'IfStatement') {
    return !node.alternate || canCompleteNormally(node.consequent) || canCompleteNormally(node.alternate);
  }

  return true;
}

function getRenderFunctions(node) {
  if (isFunction(node)) {
    return [node];
  }

  if (node.type === 'CallExpression') {
    return node.arguments.flatMap(getRenderFunctions);
  }

  return astUtil
    .getComponentProperties(node)
    .filter((property) => astUtil.getPropertyName(property) === 'render')
    .flatMap((property) => getRenderFunctions(property.value));
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow React components from returning undefined',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-render-return-undefined'),
    },

    messages,

    schema: [],
  },

  create: Components.detect((context, components, utils) => {
    const returnsByFunction = new Map();
    const hookFunctions = new Set();

    function recordReturn(node) {
      const enclosingFunction = getEnclosingFunction(context, node);
      if (!enclosingFunction) {
        return;
      }

      const returns = returnsByFunction.get(enclosingFunction) || [];
      returns.push(node);
      returnsByFunction.set(enclosingFunction, returns);
    }

    function reportFunction(functionNode) {
      if (functionNode.expression) {
        if (isStaticallyUndefined(context, functionNode.body)) {
          report(context, messages.undefinedReturn, 'undefinedReturn', { node: functionNode.body });
        }
        return;
      }

      const returns = returnsByFunction.get(functionNode) || [];
      const hasUndefinedReturn = returns.some((node) => isStaticallyUndefined(context, node.argument));

      returns
        .filter((node) => isStaticallyUndefined(context, node.argument))
        .forEach((node) => {
          report(context, messages.undefinedReturn, 'undefinedReturn', { node });
        });

      if (!hasUndefinedReturn && canCompleteNormally(functionNode.body)) {
        report(context, messages.missingReturn, 'missingReturn', { node: functionNode });
      }
    }

    return {
      CallExpression(node) {
        if (!utils.isReactHookCall(node)) {
          return;
        }

        const enclosingFunction = getEnclosingFunction(context, node);
        if (enclosingFunction && isNamedLikeComponent(enclosingFunction)) {
          hookFunctions.add(enclosingFunction);
        }
      },

      ReturnStatement: recordReturn,

      'Program:exit'() {
        const componentFunctions = new Set(
          Object.values(components.list()).flatMap((component) => getRenderFunctions(component.node)),
        );
        hookFunctions.forEach((functionNode) => componentFunctions.add(functionNode));
        componentFunctions.forEach(reportFunction);
      },
    };
  }),
};

export default exported;
export { exported as 'module.exports' };
