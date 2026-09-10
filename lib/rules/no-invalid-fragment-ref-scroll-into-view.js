import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

function getScrollRef(context, node) {
  const callee = node.callee;
  if (
    callee.type !== 'MemberExpression' ||
    callee.computed ||
    callee.property.type !== 'Identifier' ||
    callee.property.name !== 'scrollIntoView' ||
    callee.object.type !== 'MemberExpression' ||
    callee.object.computed ||
    callee.object.object.type !== 'Identifier' ||
    callee.object.property.type !== 'Identifier' ||
    callee.object.property.name !== 'current'
  ) {
    return null;
  }
  return reactImports.getVariable(context, callee.object.object);
}

function isInvalidArgument(node) {
  if (!node || node.type === 'SpreadElement') {
    return false;
  }
  if (node.type === 'Literal') {
    return typeof node.value !== 'boolean';
  }
  return [
    'ArrayExpression',
    'ArrowFunctionExpression',
    'ClassExpression',
    'FunctionExpression',
    'ObjectExpression',
    'TemplateLiteral',
  ].includes(node.type);
}

function isReassigned(variable) {
  return variable.references.some((reference) => reference.isWrite() && !reference.init);
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invalid options passed to FragmentInstance.scrollIntoView',
      recommended: true,
      url: docsUrl('no-invalid-fragment-ref-scroll-into-view'),
    },
    messages: {
      invalidArgument: 'FragmentInstance.scrollIntoView accepts only an optional alignToTop boolean.',
    },
    schema: [],
  },
  create(context) {
    const fragmentRefs = new Set();
    const otherRefs = new Set();
    const candidates = [];

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== 'JSXIdentifier' ||
          node.name.name !== 'ref' ||
          node.value?.type !== 'JSXExpressionContainer' ||
          node.value.expression.type !== 'Identifier'
        ) {
          return;
        }

        const variable = reactImports.getVariable(context, node.value.expression);
        if (!variable) {
          return;
        }
        const refs = reactImports.isReactJsxElementName(context, node.parent.name, 'Fragment')
          ? fragmentRefs
          : otherRefs;
        refs.add(variable);
      },
      CallExpression(node) {
        const variable = getScrollRef(context, node);
        if (variable && isInvalidArgument(node.arguments[0])) {
          candidates.push({ node: node.arguments[0], variable });
        }
      },
      'Program:exit'() {
        for (const candidate of candidates) {
          if (
            fragmentRefs.has(candidate.variable) &&
            !otherRefs.has(candidate.variable) &&
            !isReassigned(candidate.variable)
          ) {
            context.report({ node: candidate.node, messageId: 'invalidArgument' });
          }
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
