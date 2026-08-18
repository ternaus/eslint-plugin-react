import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

const messages = {
  useLazyInitialization: 'Pass a lazy initializer to useState to avoid recomputing the initial value on every render.',
};

function isReactUseStateCall(context, node) {
  if (node.callee.type === 'Identifier') {
    return reactImports.isNamedImport(context, node.callee, 'react', 'useState');
  }

  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'useState' &&
    reactImports.isModuleObject(context, node.callee.object, 'react')
  );
}

function containsEagerCall(node) {
  if (!node || typeof node !== 'object') {
    return false;
  }
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
    return false;
  }
  if (node.type === 'CallExpression') {
    return true;
  }

  return Object.entries(node).some(([key, value]) => {
    if (key === 'parent' || key === 'tokens' || key === 'comments') {
      return false;
    }
    return Array.isArray(value) ? value.some(containsEagerCall) : containsEagerCall(value);
  });
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer lazy initialization for React useState values that call a function',
      category: 'performance',
      recommended: true,
      url: docsUrl('prefer-use-state-lazy-initialization'),
    },
    messages,
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        const initializer = node.arguments[0];
        if (!initializer || !isReactUseStateCall(context, node) || !containsEagerCall(initializer)) {
          return;
        }
        context.report({ messageId: 'useLazyInitialization', node: initializer });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
