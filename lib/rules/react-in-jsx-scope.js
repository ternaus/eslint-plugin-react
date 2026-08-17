/**
 * @fileoverview Prevent missing React when using JSX
 * @author Glen Mailer
 */

import docsUrl from '../util/docsUrl.js';

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow missing React when using JSX',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('react-in-jsx-scope'),
    },

    schema: [],
  },

  create() {
    return {};
  },
};

export default exported;
export { exported as 'module.exports' };
