import docsUrl from '../util/docsUrl.js';

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow an explicit key prop after a JSX spread',
      recommended: false,
      url: docsUrl('jsx-no-key-after-spread'),
    },
    messages: {
      keyAfterSpread: 'Place key before every JSX spread. A spread can otherwise override its value.',
    },
    schema: [],
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        let hasSpread = false;

        for (const attribute of node.attributes) {
          if (attribute.type === 'JSXSpreadAttribute') {
            hasSpread = true;
            continue;
          }
          if (
            hasSpread &&
            attribute.type === 'JSXAttribute' &&
            attribute.name.type === 'JSXIdentifier' &&
            attribute.name.name === 'key'
          ) {
            context.report({ messageId: 'keyAfterSpread', node: attribute.name });
          }
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
