/**
 * @fileoverview Enforce ES5 or ES6 class for React Components
 * @author Dan Hamilton
 */

import componentUtil from '../util/componentUtil.js';
import docsUrl from '../util/docsUrl.js';
import report from '../util/report.js';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  shouldUseES6Class: 'Component should use es6 class instead of createClass',
  shouldUseCreateClass: 'Component should use createClass instead of es6 class',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Enforce ES5 or ES6 class for React Components',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('prefer-es6-class'),
    },

    messages,

    schema: [
      {
        enum: ['always', 'never'],
      },
    ],
  },

  create(context) {
    const configuration = context.options[0] || 'always';

    return {
      ObjectExpression(node) {
        if (componentUtil.isES5Component(node, context) && configuration === 'always') {
          report(context, messages.shouldUseES6Class, 'shouldUseES6Class', {
            node,
          });
        }
      },
      ClassDeclaration(node) {
        if (componentUtil.isES6Component(node, context) && configuration === 'never') {
          report(context, messages.shouldUseCreateClass, 'shouldUseCreateClass', {
            node,
          });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
