/**
 * @fileoverview Enforce shorthand or standard form for React fragments.
 * @author Alex Zherdev
 */

import elementType from 'jsx-ast-utils/elementType.js';
import docsUrl from '../util/docsUrl.js';
import requiredModule1 from '../util/eslint.js';
import pragmaUtil from '../util/pragma.js';
import report from '../util/report.js';
import variableUtil from '../util/variable.js';

const getText = requiredModule1.getText;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replaceNode(source, node, text) {
  return `${source.slice(0, node.range[0])}${text}${source.slice(node.range[1])}`;
}

const messages = {
  preferPragma: 'Prefer {{react}}.{{fragment}} over fragment shorthand',
  preferFragment: 'Prefer fragment shorthand over {{react}}.{{fragment}}',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Enforce shorthand or standard form for React fragments',
      category: 'Stylistic Issues',
      recommended: false,
      url: docsUrl('jsx-fragments'),
    },
    fixable: 'code',

    messages,

    schema: [
      {
        enum: ['syntax', 'element'],
      },
    ],
  },

  create(context) {
    const configuration = context.options[0] || 'syntax';
    const reactPragma = pragmaUtil.getFromContext(context);
    const fragmentPragma = pragmaUtil.getFragmentFromContext(context);
    const openFragShort = '<>';
    const closeFragShort = '</>';
    const openFragLong = `<${reactPragma}.${fragmentPragma}>`;
    const closeFragLong = `</${reactPragma}.${fragmentPragma}>`;

    function getFixerToLong(jsxFragment) {
      if (!jsxFragment.closingFragment || !jsxFragment.openingFragment) {
        // A fixer needs both fragment delimiters.
        return null;
      }
      return function fix(fixer) {
        let source = getText(context);
        source = replaceNode(source, jsxFragment.closingFragment, closeFragLong);
        source = replaceNode(source, jsxFragment.openingFragment, openFragLong);
        const lengthDiff =
          openFragLong.length -
          getText(context, jsxFragment.openingFragment).length +
          closeFragLong.length -
          getText(context, jsxFragment.closingFragment).length;
        const range = jsxFragment.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] + lengthDiff));
      };
    }

    function getFixerToShort(jsxElement) {
      return function fix(fixer) {
        let source = getText(context);
        let lengthDiff;
        if (jsxElement.closingElement) {
          source = replaceNode(source, jsxElement.closingElement, closeFragShort);
          source = replaceNode(source, jsxElement.openingElement, openFragShort);
          lengthDiff =
            getText(context, jsxElement.openingElement).length -
            openFragShort.length +
            getText(context, jsxElement.closingElement).length -
            closeFragShort.length;
        } else {
          source = replaceNode(source, jsxElement.openingElement, `${openFragShort}${closeFragShort}`);
          lengthDiff =
            getText(context, jsxElement.openingElement).length - openFragShort.length - closeFragShort.length;
        }

        const range = jsxElement.range;
        return fixer.replaceTextRange(range, source.slice(range[0], range[1] - lengthDiff));
      };
    }

    function refersToReactFragment(node, name) {
      const variableInit = variableUtil.findVariableByName(context, node, name);
      if (!variableInit) {
        return false;
      }

      // const { Fragment } = React;
      if (variableInit.type === 'Identifier' && variableInit.name === reactPragma) {
        return true;
      }

      // const Fragment = React.Fragment;
      if (
        variableInit.type === 'MemberExpression' &&
        variableInit.object.type === 'Identifier' &&
        variableInit.object.name === reactPragma &&
        variableInit.property.type === 'Identifier' &&
        variableInit.property.name === fragmentPragma
      ) {
        return true;
      }

      // const { Fragment } = require('react');
      if (
        variableInit.callee &&
        variableInit.callee.name === 'require' &&
        variableInit.arguments &&
        variableInit.arguments[0] &&
        variableInit.arguments[0].value === 'react'
      ) {
        return true;
      }

      return false;
    }

    const jsxElements = [];
    const fragmentNames = new Set([`${reactPragma}.${fragmentPragma}`]);

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      JSXElement(node) {
        jsxElements.push(node);
      },

      JSXFragment(node) {
        if (configuration === 'element') {
          report(context, messages.preferPragma, 'preferPragma', {
            node,
            data: {
              react: reactPragma,
              fragment: fragmentPragma,
            },
            fix: getFixerToLong(node),
          });
        }
      },

      ImportDeclaration(node) {
        if (node.source && node.source.value === 'react') {
          node.specifiers.forEach((spec) => {
            if (
              'imported' in spec &&
              spec.imported &&
              'name' in spec.imported &&
              spec.imported.name === fragmentPragma
            ) {
              if (spec.local) {
                fragmentNames.add(spec.local.name);
              }
            }
          });
        }
      },

      'Program:exit'() {
        jsxElements.forEach((node) => {
          const openingEl = node.openingElement;
          const elName = elementType(openingEl);

          if (fragmentNames.has(elName) || refersToReactFragment(node, elName)) {
            const attrs = openingEl.attributes;
            if (configuration === 'syntax' && !(attrs && attrs.length > 0)) {
              report(context, messages.preferFragment, 'preferFragment', {
                node,
                data: {
                  react: reactPragma,
                  fragment: fragmentPragma,
                },
                fix: getFixerToShort(node),
              });
            }
          }
        });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
