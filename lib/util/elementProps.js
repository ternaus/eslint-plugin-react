import reactImports from './reactImports.js';

function getCreateElementProps(node) {
  if (!node || (node.type === 'Literal' && node.value === null)) {
    return new Map();
  }
  if (node.type !== 'ObjectExpression') {
    return null;
  }
  const props = new Map();
  for (const property of node.properties) {
    if (property.type !== 'Property' || property.computed || property.kind !== 'init') {
      return null;
    }
    const name = property.key.type === 'Identifier' ? property.key.name : property.key.value;
    props.set(name, property.value);
  }
  return props;
}

function getJsxProps(node) {
  const props = new Map();
  for (const attribute of node.attributes) {
    if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') {
      return null;
    }
    const value = attribute.value;
    props.set(
      attribute.name.name,
      value?.type === 'JSXExpressionContainer' ? value.expression : (value ?? { type: 'Literal', value: true }),
    );
  }
  return props;
}

function isHtmlNamespace(context, node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (/^(ArrowFunctionExpression|FunctionDeclaration|FunctionExpression)$/u.test(parent.type)) {
      break;
    }
    let name;
    if (parent.type === 'JSXElement' && parent.openingElement.name.type === 'JSXIdentifier') {
      name = parent.openingElement.name.name;
    } else if (reactImports.isReactCall(context, parent, 'createElement')) {
      name = parent.arguments[0]?.value;
    }
    if (name === 'foreignObject') {
      return true;
    }
    if (name === 'svg' || name === 'math') {
      return false;
    }
  }
  return true;
}

const exported = { getCreateElementProps, getJsxProps, isHtmlNamespace };
export default exported;
export { exported as 'module.exports' };
