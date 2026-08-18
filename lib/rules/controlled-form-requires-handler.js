import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

const READ_ONLY_VALUE_INPUT_TYPES = new Set(['button', 'checkbox', 'hidden', 'image', 'radio', 'reset', 'submit']);

function isNullish(node) {
  const expression = node?.type === 'JSXExpressionContainer' ? node.expression : node;
  return (
    (expression?.type === 'Literal' && expression.value === null) ||
    (expression?.type === 'Identifier' && expression.name === 'undefined')
  );
}

function collectObjectProperties(properties) {
  if (properties.some((property) => property.type === 'SpreadElement')) {
    return null;
  }

  const result = new Map();
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
      result.set(name, property.value);
    }
  }
  return result;
}

function collectJsxProperties(attributes) {
  const properties = new Map();

  for (const attribute of attributes) {
    if (attribute.type === 'JSXSpreadAttribute') {
      if (attribute.argument.type !== 'ObjectExpression') {
        return null;
      }
      const spread = collectObjectProperties(attribute.argument.properties);
      if (!spread) {
        return null;
      }
      for (const [name, value] of spread) {
        properties.set(name, value);
      }
      continue;
    }
    if (attribute.type === 'JSXAttribute' && attribute.name.type === 'JSXIdentifier') {
      properties.set(attribute.name.name, attribute.value ?? { type: 'Literal', value: true });
    }
  }

  return properties;
}

function hasUsableProperty(properties, name) {
  return properties.has(name) && !isNullish(properties.get(name));
}

function literalInputType(properties) {
  const type = properties.get('type');
  if (type?.type === 'Literal' && typeof type.value === 'string') {
    return type.value.toLowerCase();
  }
  if (type?.type === 'JSXExpressionContainer') {
    return literalInputType(new Map([['type', type.expression]]));
  }
  return null;
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
      description: 'Require the React 19 handler contract for controlled DOM form controls',
      recommended: false,
      url: docsUrl('controlled-form-requires-handler'),
    },
    messages: {
      checkedDefaultChecked: 'Use either checked or defaultChecked, not both.',
      missingCheckedHandler: 'A checked prop requires onChange, readOnly, or disabled.',
      missingValueHandler: 'A value prop requires onChange, onInput, readOnly, or disabled.',
      valueDefaultValue: 'Use either value or defaultValue, not both.',
    },
    schema: [],
  },

  create(context) {
    function checkControl(node, element, properties) {
      if (!properties) {
        return;
      }

      const hasValue = hasUsableProperty(properties, 'value');
      const hasDefaultValue = hasUsableProperty(properties, 'defaultValue');
      const hasChecked = hasUsableProperty(properties, 'checked');
      const hasDefaultChecked = hasUsableProperty(properties, 'defaultChecked');
      const hasValueHandler =
        hasUsableProperty(properties, 'onChange') ||
        hasUsableProperty(properties, 'onInput') ||
        hasUsableProperty(properties, 'readOnly') ||
        hasUsableProperty(properties, 'disabled');
      const hasCheckedHandler =
        hasUsableProperty(properties, 'onChange') ||
        hasUsableProperty(properties, 'readOnly') ||
        hasUsableProperty(properties, 'disabled');

      if (hasValue && hasDefaultValue) {
        context.report({ messageId: 'valueDefaultValue', node });
      }
      if (element === 'input' && hasChecked && hasDefaultChecked) {
        context.report({ messageId: 'checkedDefaultChecked', node });
      }
      if (
        hasValue &&
        !(element === 'input' && READ_ONLY_VALUE_INPUT_TYPES.has(literalInputType(properties))) &&
        !hasValueHandler
      ) {
        context.report({ messageId: 'missingValueHandler', node });
      }
      if (element === 'input' && hasChecked && !hasCheckedHandler) {
        context.report({ messageId: 'missingCheckedHandler', node });
      }
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier' || !['input', 'select', 'textarea'].includes(node.name.name)) {
          return;
        }
        checkControl(node, node.name.name, collectJsxProperties(node.attributes));
      },
      CallExpression(node) {
        if (
          !isReactCreateElementCall(context, node) ||
          node.arguments[0]?.type !== 'Literal' ||
          !['input', 'select', 'textarea'].includes(node.arguments[0].value) ||
          node.arguments[1]?.type !== 'ObjectExpression'
        ) {
          return;
        }
        checkControl(node, node.arguments[0].value, collectObjectProperties(node.arguments[1].properties));
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
