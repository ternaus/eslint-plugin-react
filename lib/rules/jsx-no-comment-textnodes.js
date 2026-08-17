/**
 * @fileoverview Comments inside children section of tag should be placed inside braces.
 * @author Ben Vinegar
 */

import docsUrl from '../util/docsUrl.js';
import requiredModule0 from '../util/eslint.js';

const getText = requiredModule0.getText;

import report from '../util/report.js';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  putCommentInBraces: 'Comments inside children section of tag should be placed inside braces',
};

/**
 * @param {Context} context
 * @param {ASTNode} node
 * @returns {void}
 */
function checkText(context, node) {
  const rawValue = getText(context, node);
  if (/^\s*\/(\/|\*)/m.test(rawValue)) {
    // inside component, e.g. <div>literal</div>
    if (
      node.parent.type !== 'JSXAttribute' &&
      node.parent.type !== 'JSXExpressionContainer' &&
      node.parent.type.indexOf('JSX') !== -1
    ) {
      report(context, messages.putCommentInBraces, 'putCommentInBraces', {
        node,
      });
    }
  }
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow comments from being inserted as text nodes',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('jsx-no-comment-textnodes'),
    },

    messages,

    schema: [],
  },

  create(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      Literal(node) {
        checkText(context, node);
      },
      JSXText(node) {
        checkText(context, node);
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
