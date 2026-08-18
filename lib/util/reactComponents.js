import reactImports from './reactImports.js';

function isJsx(node) {
  return node?.type === 'JSXElement' || node?.type === 'JSXFragment';
}

function functionReturnsJsx(node) {
  if (node.body.type !== 'BlockStatement') {
    return isJsx(node.body);
  }

  function visit(current) {
    if (!current || typeof current !== 'object') {
      return false;
    }
    if (current !== node && /^(ArrowFunctionExpression|FunctionDeclaration|FunctionExpression)$/u.test(current.type)) {
      return false;
    }
    if (current.type === 'ReturnStatement' && isJsx(current.argument)) {
      return true;
    }
    return Object.entries(current).some(([key, value]) => {
      if (key === 'parent' || key === 'tokens' || key === 'comments') {
        return false;
      }
      return Array.isArray(value) ? value.some(visit) : visit(value);
    });
  }

  return visit(node.body);
}

function isFunctionComponent(node) {
  if (!/^(ArrowFunctionExpression|FunctionDeclaration|FunctionExpression)$/u.test(node.type)) {
    return false;
  }

  if (node.type === 'FunctionDeclaration') {
    return (
      (Boolean(node.id?.name && /^[A-Z]/u.test(node.id.name)) || node.parent?.type === 'ExportDefaultDeclaration') &&
      functionReturnsJsx(node)
    );
  }

  const parent = node.parent;
  if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
    return /^[A-Z]/u.test(parent.id.name) && functionReturnsJsx(node);
  }

  return parent?.type === 'ExportDefaultDeclaration' && functionReturnsJsx(node);
}

function getFunctionComponent(context, identifier) {
  const definition = reactImports.getVariable(context, identifier)?.defs?.[0];
  if (!definition) {
    return null;
  }

  if (definition.node.type === 'FunctionDeclaration') {
    return functionReturnsJsx(definition.node) ? definition.node : null;
  }

  const initializer = definition.node.type === 'VariableDeclarator' ? definition.node.init : null;
  if (initializer?.type === 'ArrowFunctionExpression' || initializer?.type === 'FunctionExpression') {
    return functionReturnsJsx(initializer) ? initializer : null;
  }

  return null;
}

function isReactComponentClass(context, node) {
  const superClass = node.superClass;
  if (!superClass) {
    return false;
  }

  if (superClass.type === 'Identifier') {
    return (
      reactImports.isNamedImport(context, superClass, 'react', 'Component') ||
      reactImports.isNamedImport(context, superClass, 'react', 'PureComponent')
    );
  }

  if (
    superClass.type !== 'MemberExpression' ||
    superClass.computed ||
    superClass.object.type !== 'Identifier' ||
    superClass.property.type !== 'Identifier'
  ) {
    return false;
  }

  return (
    (superClass.property.name === 'Component' || superClass.property.name === 'PureComponent') &&
    reactImports.isModuleObject(context, superClass.object, 'react')
  );
}

function isInsideReactComponent(context, node) {
  let current = node.parent;
  while (current) {
    if (isReactComponentClass(context, current) || isFunctionComponent(current)) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

const exported = {
  getFunctionComponent,
  isFunctionComponent,
  isInsideReactComponent,
  isReactComponentClass,
};

export default exported;
export { exported as 'module.exports' };
