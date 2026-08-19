import { HTML5_ELEMENT_ATTRIBUTES, HTML5_GLOBAL_ATTRIBUTES } from '../generated/html5-attributes.js';
import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

const ATTRIBUTE_ALIASES = new Map([
  ['acceptcharset', 'accept-charset'],
  ['charset', 'charset'],
  ['classname', 'class'],
  ['htmlfor', 'for'],
  ['httpequiv', 'http-equiv'],
]);

const REACT_ONLY_ATTRIBUTES = new Set([
  'children',
  'dangerouslysetinnerhtml',
  'defaultchecked',
  'defaultvalue',
  'key',
  'ref',
  'suppresscontenteditablewarning',
  'suppresshydrationwarning',
]);

const UNIVERSAL_ATTRIBUTES = new Set([
  'about',
  'accesskey',
  'autocapitalize',
  'autofocus',
  'class',
  'contenteditable',
  'dir',
  'draggable',
  'enterkeyhint',
  'exportparts',
  'hidden',
  'id',
  'inert',
  'inputmode',
  'is',
  'itemid',
  'itemprop',
  'itemref',
  'itemscope',
  'itemtype',
  'lang',
  'nonce',
  'part',
  'popover',
  'role',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
  'translate',
]);

const KNOWN_ATTRIBUTES = new Set([
  ...UNIVERSAL_ATTRIBUTES,
  ...Object.keys(HTML5_GLOBAL_ATTRIBUTES),
  ...Object.values(HTML5_ELEMENT_ATTRIBUTES).flatMap((attributes) => Object.keys(attributes)),
]);

const NAVIGABLE_TARGET_ATTRIBUTES = new Set(['formtarget', 'target']);
const NAVIGABLE_TARGET_KEYWORDS = new Set(['_blank', '_parent', '_self', '_top']);

function normalizeAttribute(name) {
  const lowercase = name.toLowerCase();
  return ATTRIBUTE_ALIASES.get(lowercase) ?? lowercase;
}

function isIgnoredAttribute(name) {
  return (
    REACT_ONLY_ATTRIBUTES.has(name) || name.startsWith('aria-') || name.startsWith('data-') || /^on[A-Z]/u.test(name)
  );
}

function getElementAttributes(name) {
  if (name === 'math' || name === 'svg') {
    return null;
  }
  return HTML5_ELEMENT_ATTRIBUTES[name] ?? null;
}

function literalStringValue(node) {
  if (node?.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  if (node?.type === 'JSXExpressionContainer') {
    return literalStringValue(node.expression);
  }
  return null;
}

function isValidNavigableTarget(value) {
  const lowercase = value.toLowerCase();
  if (NAVIGABLE_TARGET_KEYWORDS.has(lowercase)) {
    return true;
  }
  if (value.length === 0 || value.startsWith('_')) {
    return false;
  }
  return !(/[\t\n]/u.test(value) && value.includes('<'));
}

function getAttributeDefinition(elementAttributes, attribute) {
  if (Object.hasOwn(elementAttributes, attribute)) {
    return elementAttributes[attribute];
  }
  if (Object.hasOwn(HTML5_GLOBAL_ATTRIBUTES, attribute)) {
    return HTML5_GLOBAL_ATTRIBUTES[attribute];
  }
  if (UNIVERSAL_ATTRIBUTES.has(attribute)) {
    return null;
  }
  return undefined;
}

function isReactCreateElementCall(context, node) {
  if (node.callee.type === 'Identifier') {
    return reactImports.isNamedImport(context, node.callee, 'react', 'createElement');
  }
  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'createElement' &&
    reactImports.isModuleObject(context, node.callee.object, 'react')
  );
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow static HTML attributes and values forbidden for a React DOM element',
      recommended: true,
      url: docsUrl('no-invalid-html-attribute'),
    },
    messages: {
      invalidAttribute: '{{attribute}} is not valid on <{{element}}> according to HTML5 metadata.',
      invalidValue: '{{value}} is not a valid {{attribute}} value on <{{element}}> according to HTML5 metadata.',
    },
    schema: [],
  },

  create(context) {
    function checkAttribute(element, elementAttributes, attributeName, valueNode, reportNode) {
      if (isIgnoredAttribute(attributeName)) {
        return;
      }

      const attribute = normalizeAttribute(attributeName);
      const definition = getAttributeDefinition(elementAttributes, attribute);
      if (definition === undefined) {
        if (KNOWN_ATTRIBUTES.has(attribute)) {
          context.report({
            data: { attribute, element },
            messageId: 'invalidAttribute',
            node: reportNode,
          });
        }
        return;
      }

      const value = literalStringValue(valueNode);
      if (NAVIGABLE_TARGET_ATTRIBUTES.has(attribute)) {
        if (value !== null && !isValidNavigableTarget(value)) {
          context.report({
            data: { attribute, element, value },
            messageId: 'invalidValue',
            node: reportNode,
          });
        }
        return;
      }

      if (Array.isArray(definition) && value !== null && !definition.includes(value)) {
        context.report({
          data: { attribute, element, value },
          messageId: 'invalidValue',
          node: reportNode,
        });
      }
    }

    function checkJsxElement(node) {
      if (node.name.type !== 'JSXIdentifier') {
        return;
      }

      const element = node.name.name;
      if (element !== element.toLowerCase()) {
        return;
      }
      const elementAttributes = getElementAttributes(element);
      if (!elementAttributes) {
        return;
      }
      if (node.attributes.some((attribute) => attribute.type === 'JSXSpreadAttribute')) {
        return;
      }

      for (const attribute of node.attributes) {
        if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') {
          continue;
        }
        checkAttribute(element, elementAttributes, attribute.name.name, attribute.value, attribute.name);
      }
    }

    function checkCreateElement(node) {
      if (
        !isReactCreateElementCall(context, node) ||
        node.arguments[0]?.type !== 'Literal' ||
        typeof node.arguments[0].value !== 'string' ||
        node.arguments[1]?.type !== 'ObjectExpression'
      ) {
        return;
      }

      const element = node.arguments[0].value;
      const elementAttributes = getElementAttributes(element);
      const properties = node.arguments[1].properties;
      if (!elementAttributes || properties.some((property) => property.type === 'SpreadElement')) {
        return;
      }

      for (const property of properties) {
        if (
          property.type !== 'Property' ||
          property.computed ||
          (property.key.type !== 'Identifier' && property.key.type !== 'Literal')
        ) {
          continue;
        }
        const name = property.key.type === 'Identifier' ? property.key.name : property.key.value;
        if (typeof name === 'string') {
          checkAttribute(element, elementAttributes, name, property.value, property.key);
        }
      }
    }

    return {
      JSXOpeningElement: checkJsxElement,
      CallExpression: checkCreateElement,
    };
  },
};

export default exported;
export { exported as 'module.exports' };
