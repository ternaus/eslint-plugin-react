import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

function getInvalidUsage(node) {
  const { parent } = node;

  if (parent.type === 'ExpressionStatement' || (parent.type === 'UnaryExpression' && parent.operator === 'void')) {
    return 'unused';
  }

  if (parent.type === 'ThrowStatement') {
    return 'thrown';
  }

  if (parent.type === 'SequenceExpression') {
    const index = parent.expressions.indexOf(node);
    return index < parent.expressions.length - 1 ? 'unused' : getInvalidUsage(parent);
  }

  return null;
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow discarded or thrown react-dom browser results',
      recommended: true,
      url: docsUrl('no-invalid-browser-call'),
    },
    messages: {
      thrown: "Do not throw browser(). Pass its result to React use or a server renderer's abort function.",
      unused: 'browser() has no effect unless its result is consumed.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (!reactImports.isModuleCall(context, node, 'react-dom', 'browser')) {
          return;
        }

        const messageId = getInvalidUsage(node);
        if (messageId !== null) {
          context.report({ node, messageId });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
