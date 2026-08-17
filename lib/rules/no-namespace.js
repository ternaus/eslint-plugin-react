/**
 * @fileoverview Enforce that namespaces are not used in React elements
 * @author Yacine Hmito
 */

import elementType from 'jsx-ast-utils/elementType.js';
import docsUrl from '../util/docsUrl.js';
import isCreateElement from '../util/isCreateElement.js';
import report from '../util/report.js';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  noNamespace: 'React component {{name}} must not be in a namespace, as React does not support them',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Enforce that namespaces are not used in React elements',
      category: 'Possible Errors',
      recommended: false,
      url: docsUrl('no-namespace'),
    },

    messages,

    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        if (isCreateElement(context, node) && node.arguments.length > 0 && node.arguments[0].type === 'Literal') {
          const name = node.arguments[0].value;
          if (typeof name !== 'string' || name.indexOf(':') === -1) return undefined;
          report(context, messages.noNamespace, 'noNamespace', {
            node,
            data: {
              name,
            },
          });
        }
      },
      JSXOpeningElement(node) {
        const name = elementType(node);
        if (typeof name !== 'string' || name.indexOf(':') === -1) return undefined;
        report(context, messages.noNamespace, 'noNamespace', {
          node,
          data: {
            name,
          },
        });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
