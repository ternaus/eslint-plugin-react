/**
 * @fileoverview Prevent usage of the return value of React.render
 * @author Dustan Kasten
 */

import docsUrl from '../util/docsUrl.js';
import report from '../util/report.js';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noReturnValue: 'Do not depend on the return value from {{node}}.render',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow usage of the return value of ReactDOM.render',
      category: 'Best Practices',
      recommended: true,
      url: docsUrl('no-render-return-value'),
    },

    messages,

    schema: [],
  },

  create(context) {
    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      CallExpression(node) {
        const callee = node.callee;
        const parent = node.parent;
        if (callee.type !== 'MemberExpression') {
          return;
        }

        if (
          callee.object.type !== 'Identifier' ||
          callee.object.name !== 'ReactDOM' ||
          !('name' in callee.property) ||
          callee.property.name !== 'render'
        ) {
          return;
        }

        if (
          parent.type === 'VariableDeclarator' ||
          parent.type === 'Property' ||
          parent.type === 'ReturnStatement' ||
          parent.type === 'ArrowFunctionExpression' ||
          parent.type === 'AssignmentExpression'
        ) {
          report(context, messages.noReturnValue, 'noReturnValue', {
            node: callee,
            data: {
              node: callee.object.name,
            },
          });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
