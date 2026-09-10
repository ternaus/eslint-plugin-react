import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

const EVENT_NAMES = new Set(['onEnter', 'onExit', 'onShare', 'onUpdate']);
const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration']);

function isInstanceAnimationCall(node, parameterName) {
  if (
    node.type !== 'CallExpression' ||
    node.callee.type !== 'MemberExpression' ||
    node.callee.computed ||
    node.callee.property.type !== 'Identifier' ||
    node.callee.property.name !== 'animate'
  ) {
    return false;
  }

  let receiver = node.callee.object;
  while (receiver.type === 'MemberExpression') {
    receiver = receiver.object;
  }
  return receiver.type === 'Identifier' && receiver.name === parameterName;
}

function visitFunctionBody(node, visitorKeys, callback, root = true) {
  if (!root && FUNCTION_TYPES.has(node.type)) {
    return;
  }
  callback(node);
  for (const key of visitorKeys[node.type] ?? []) {
    const value = node[key];
    for (const child of Array.isArray(value) ? value : [value]) {
      if (child?.type) {
        visitFunctionBody(child, visitorKeys, callback, false);
      }
    }
  }
}

function containsInstanceAnimation(body, parameterName, visitorKeys) {
  let found = false;
  visitFunctionBody(body, visitorKeys, (node) => {
    found ||= isInstanceAnimationCall(node, parameterName);
  });
  return found;
}

function hasPossibleCleanup(body, parameterName, visitorKeys) {
  if (body.type !== 'BlockStatement') {
    return !isInstanceAnimationCall(body, parameterName);
  }

  let found = false;
  visitFunctionBody(body, visitorKeys, (node) => {
    if (node.type !== 'ReturnStatement' || !node.argument) {
      return;
    }
    if (
      !isInstanceAnimationCall(node.argument, parameterName) &&
      !['ArrayExpression', 'Literal', 'ObjectExpression', 'TemplateLiteral'].includes(node.argument.type)
    ) {
      found = true;
    }
  });
  return found;
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require cleanup for animations started by ViewTransition event callbacks',
      recommended: true,
      url: docsUrl('view-transition-event-requires-cleanup'),
    },
    messages: {
      asyncCleanup: 'A ViewTransition event callback cannot return cleanup from an async function.',
      missingCleanup: 'Return a cleanup function that cancels animations started by this ViewTransition event.',
    },
    schema: [],
  },
  create(context) {
    const visitorKeys = context.sourceCode.visitorKeys;

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== 'JSXIdentifier' ||
          !EVENT_NAMES.has(node.name.name) ||
          !reactImports.isReactJsxElementName(context, node.parent.name, 'ViewTransition') ||
          node.value?.type !== 'JSXExpressionContainer' ||
          !FUNCTION_TYPES.has(node.value.expression.type)
        ) {
          return;
        }

        const callback = node.value.expression;
        const parameter = callback.params[0];
        if (
          parameter?.type !== 'Identifier' ||
          !containsInstanceAnimation(callback.body, parameter.name, visitorKeys)
        ) {
          return;
        }

        if (callback.async) {
          context.report({ node: callback, messageId: 'asyncCleanup' });
        } else if (!hasPossibleCleanup(callback.body, parameter.name, visitorKeys)) {
          context.report({ node: callback, messageId: 'missingCleanup' });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
