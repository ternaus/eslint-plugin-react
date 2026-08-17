/**
 * @fileoverview Prevent missing React when using JSX
 * @author Glen Mailer
 */

import docsUrl from '../util/docsUrl.js';
import pragmaUtil from '../util/pragma.js';
import report from '../util/report.js';
import variableUtil from '../util/variable.js';
import requiredModule0 from '../util/version.js';

const testReactVersion = requiredModule0.testReactVersion;

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

const messages = {
  notInScope: "'{{name}}' must be in scope when using JSX",
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow missing React when using JSX',
      category: 'Possible Errors',
      recommended: true,
      url: docsUrl('react-in-jsx-scope'),
    },

    messages,

    schema: [],
  },

  create(context) {
    if (testReactVersion(context, '>= 19.0.0')) {
      return {};
    }

    const pragma = pragmaUtil.getFromContext(context);

    function checkIfReactIsInScope(node) {
      if (variableUtil.getVariableFromContext(context, node, pragma)) {
        return;
      }
      report(context, messages.notInScope, 'notInScope', {
        node,
        data: {
          name: pragma,
        },
      });
    }

    return {
      JSXOpeningElement: checkIfReactIsInScope,
      JSXOpeningFragment: checkIfReactIsInScope,
    };
  },
};

export default exported;
export { exported as 'module.exports' };
