/**
 * @fileoverview Prevent React to be marked as unused
 * @author Glen Mailer
 */

import docsUrl from '../util/docsUrl.js';
import versionUtil from '../util/version.js';

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
    versionUtil.testReactVersion(context, '>= 19.0.0');
    return {};
  },
};

export default exported;
export { exported as 'module.exports' };
