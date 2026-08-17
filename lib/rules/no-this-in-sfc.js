/**
 * @fileoverview Report "this" being used in stateless functional components.
 */

import Components from '../util/Components.js';
import docsUrl from '../util/docsUrl.js';
import report from '../util/report.js';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noThisInSFC: 'Stateless functional components should not use `this`',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow `this` from being used in stateless functional components',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-this-in-sfc'),
    },

    messages,

    schema: [],
  },

  create: Components.detect((context, components, utils) => ({
    MemberExpression(node) {
      if (node.object.type === 'ThisExpression') {
        const component = components.get(utils.getParentStatelessComponent(node));
        if (!component || (component.node && component.node.parent && component.node.parent.type === 'Property')) {
          return;
        }
        report(context, messages.noThisInSFC, 'noThisInSFC', {
          node,
        });
      }
    },
  })),
};

export default exported;
export { exported as 'module.exports' };
