function getVariable(context, identifier) {
  let scope = context.sourceCode.getScope(identifier);

  while (scope) {
    const variable = scope.set.get(identifier.name);
    if (variable) {
      return variable;
    }
    scope = scope.upper;
  }

  return null;
}

function getRequiredModule(context, init) {
  if (
    init?.type !== 'CallExpression' ||
    init.callee.type !== 'Identifier' ||
    init.callee.name !== 'require' ||
    init.arguments.length !== 1 ||
    init.arguments[0].type !== 'Literal' ||
    typeof init.arguments[0].value !== 'string'
  ) {
    return null;
  }

  const requireBinding = getVariable(context, init.callee);
  if (requireBinding?.defs?.length) {
    return null;
  }

  return init.arguments[0].value;
}

function getCommonJsBinding(context, definition, identifier) {
  const declarator = definition.node;
  const moduleName = getRequiredModule(context, declarator.init);
  if (!moduleName) {
    return null;
  }

  if (declarator.id.type === 'Identifier' && declarator.id.name === identifier.name) {
    return { imported: 'default', moduleName };
  }

  if (declarator.id.type !== 'ObjectPattern') {
    return null;
  }

  for (const property of declarator.id.properties) {
    if (
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.value.type === 'Identifier' &&
      property.value.name === identifier.name
    ) {
      return { imported: property.key.name, moduleName };
    }
  }

  return null;
}

function getImportBinding(context, identifier) {
  const definition = getVariable(context, identifier)?.defs?.[0];
  if (!definition) {
    return null;
  }

  if (definition.type === 'ImportBinding') {
    const specifier = definition.node;
    const moduleName = definition.parent.source.value;

    if (specifier.type === 'ImportSpecifier') {
      return { imported: specifier.imported.name, moduleName };
    }
    if (specifier.type === 'ImportNamespaceSpecifier') {
      return { imported: '*', moduleName };
    }
    return { imported: 'default', moduleName };
  }

  if (definition.type === 'Variable') {
    return getCommonJsBinding(context, definition, identifier);
  }

  return null;
}

function isModuleObject(context, identifier, moduleName) {
  const binding = getImportBinding(context, identifier);
  return binding?.moduleName === moduleName && (binding.imported === '*' || binding.imported === 'default');
}

function isNamedImport(context, identifier, moduleName, importedName) {
  const binding = getImportBinding(context, identifier);
  return binding?.moduleName === moduleName && binding.imported === importedName;
}

const exported = {
  getVariable,
  getImportBinding,
  isModuleObject,
  isNamedImport,
};

export default exported;
export { exported as 'module.exports' };
