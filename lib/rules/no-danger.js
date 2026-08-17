/**
 * @fileoverview Prevent usage of dangerous React props
 * @author Scott Andrews
 */

import { minimatch } from 'minimatch';

import docsUrl from '../util/docsUrl.js';
import eslintUtil from '../util/eslint.js';
import isCreateElement from '../util/isCreateElement.js';
import jsxUtil from '../util/jsx.js';
import report from '../util/report.js';

const getText = eslintUtil.getText;

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

const DANGEROUS_PROPERTY_NAMES = ['dangerouslySetInnerHTML'];

const DANGEROUS_PROPERTIES = Object.fromEntries(DANGEROUS_PROPERTY_NAMES.map((prop) => [prop, prop]));

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Checks if a JSX attribute is dangerous.
 * @param {string} name - Name of the attribute to check.
 * @returns {boolean} Whether or not the attribute is dangerous.
 */
function isDangerous(name) {
  return Object.hasOwn(DANGEROUS_PROPERTIES, name);
}

function getCreateElementComponentName(context, node) {
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node.type === 'Identifier' || node.type === 'MemberExpression') {
    return getText(context, node);
  }
  return undefined;
}

function getDangerousProperty(props) {
  if (props?.type !== 'ObjectExpression') {
    return undefined;
  }

  return props.properties.find((property) => {
    if (property.type !== 'Property' || property.computed) {
      return false;
    }
    const propertyName = property.key.type === 'Identifier' ? property.key.name : property.key.value;
    return typeof propertyName === 'string' && isDangerous(propertyName);
  });
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  dangerousProp: "Dangerous property '{{name}}' found",
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow usage of dangerous React properties',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-danger'),
    },

    messages,

    schema: [
      {
        type: 'object',
        properties: {
          customComponentNames: {
            items: {
              type: 'string',
            },
            minItems: 0,
            type: 'array',
            uniqueItems: true,
          },
        },
      },
    ],
  },

  create(context) {
    const configuration = context.options[0] || {};
    const customComponentNames = configuration.customComponentNames || [];

    return {
      JSXAttribute(node) {
        const nodeName = node.parent.name;
        const functionName = nodeName.name || `${nodeName.object.name}.${nodeName.property.name}`;

        const enableCheckingCustomComponent = customComponentNames.some((name) => minimatch(functionName, name));

        if ((enableCheckingCustomComponent || jsxUtil.isDOMComponent(node.parent)) && isDangerous(node.name.name)) {
          report(context, messages.dangerousProp, 'dangerousProp', {
            node,
            data: {
              name: node.name.name,
            },
          });
        }
      },
      CallExpression(node) {
        if (!isCreateElement(context, node) || node.arguments.length < 2) {
          return;
        }

        const componentName = getCreateElementComponentName(context, node.arguments[0]);
        const isDOMComponent = typeof componentName === 'string' && /^[a-z]/.test(componentName);
        const enableCheckingCustomComponent =
          typeof componentName === 'string' && customComponentNames.some((name) => minimatch(componentName, name));
        if (!isDOMComponent && !enableCheckingCustomComponent) {
          return;
        }

        const dangerousProperty = getDangerousProperty(node.arguments[1]);
        if (dangerousProperty) {
          const propertyName =
            dangerousProperty.key.type === 'Identifier' ? dangerousProperty.key.name : dangerousProperty.key.value;
          report(context, messages.dangerousProp, 'dangerousProp', {
            node: dangerousProperty,
            data: {
              name: propertyName,
            },
          });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
