import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

const FUNCTION_TYPES = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration']);

function getFunctionIdentifier(node) {
  if (node.type === 'FunctionDeclaration') {
    return node.id;
  }
  if (node.parent.type === 'VariableDeclarator' && node.parent.id.type === 'Identifier') {
    return node.parent.id;
  }
  return null;
}

function isStartTransitionArgument(context, identifier) {
  return (
    identifier.parent.type === 'CallExpression' &&
    identifier.parent.arguments[0] === identifier &&
    reactImports.isReactCall(context, identifier.parent, 'startTransition')
  );
}

function isPassedToStartTransition(context, node) {
  const identifier = getFunctionIdentifier(node);
  if (!identifier) {
    return false;
  }
  return reactImports
    .getVariable(context, identifier)
    ?.references.some((reference) => isStartTransitionArgument(context, reference.identifier));
}

function isInsideStartTransition(context, node) {
  let ancestor = node.parent;
  while (ancestor) {
    if (FUNCTION_TYPES.has(ancestor.type)) {
      if (
        (ancestor.parent.type === 'CallExpression' &&
          ancestor.parent.arguments[0] === ancestor &&
          reactImports.isReactCall(context, ancestor.parent, 'startTransition')) ||
        isPassedToStartTransition(context, ancestor)
      ) {
        return true;
      }
    }
    ancestor = ancestor.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require addTransitionType calls to run inside a React startTransition callback',
      recommended: false,
      url: docsUrl('no-add-transition-type-outside-transition'),
    },
    messages: {
      outsideTransition: 'Call addTransitionType inside a React startTransition callback.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (reactImports.isReactCall(context, node, 'addTransitionType') && !isInsideStartTransition(context, node)) {
          context.report({ node, messageId: 'outsideTransition' });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
