/**
 * @fileoverview Prevent JSX prop spreading the same expression multiple times
 * @author Simon Schick
 */

import docsUrl from '../util/docsUrl.js';
import report from '../util/report.js';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noMultiSpreading: 'Spreading the same expression multiple times is forbidden',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow JSX prop spreading the same identifier multiple times',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('jsx-props-no-spread-multi'),
    },
    schema: [],
    messages,
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        const spreads = node.attributes.filter(
          (attr) => attr.type === 'JSXSpreadAttribute' && attr.argument.type === 'Identifier',
        );
        if (spreads.length < 2) {
          return;
        }
        // We detect duplicate expressions by their identifier
        const identifierNames = new Set();
        spreads.forEach((spread) => {
          if (identifierNames.has(spread.argument.name)) {
            report(context, messages.noMultiSpreading, 'noMultiSpreading', {
              node: spread,
            });
          }
          identifierNames.add(spread.argument.name);
        });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
