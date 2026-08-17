/**
 * @fileoverview Prevent React to be marked as unused
 * @author Glen Mailer
 */

import docsUrl from '../util/docsUrl.js';
import requiredModule0 from '../util/eslint.js';
import pragmaUtil from '../util/pragma.js';

const markVariableAsUsed = requiredModule0.markVariableAsUsed;

import requiredModule1 from '../util/version.js';

const testReactVersion = requiredModule1.testReactVersion;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow React to be incorrectly marked as unused',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('jsx-uses-react'),
    },
    schema: [],
  },

  create(context) {
    if (testReactVersion(context, '>= 19.0.0')) {
      return {};
    }

    const pragma = pragmaUtil.getFromContext(context);
    const fragment = pragmaUtil.getFragmentFromContext(context);

    /**
     * @param {ASTNode} node
     * @returns {void}
     */
    function handleOpeningElement(node) {
      markVariableAsUsed(pragma, node, context);
    }
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXOpeningElement: handleOpeningElement,
      JSXOpeningFragment: handleOpeningElement,
      JSXFragment(node) {
        markVariableAsUsed(fragment, node, context);
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
