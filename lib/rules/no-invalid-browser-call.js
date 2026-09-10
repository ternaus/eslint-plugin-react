import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

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

        if (node.parent.type === 'ExpressionStatement') {
          context.report({ node, messageId: 'unused' });
        } else if (node.parent.type === 'ThrowStatement') {
          context.report({ node, messageId: 'thrown' });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
