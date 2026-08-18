import docsUrl from '../util/docsUrl.js';
import reactComponents from '../util/reactComponents.js';
import reactImports from '../util/reactImports.js';

const messages = {
  withIdentifierMsg:
    "The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.",
  withIdentifierMsgFunc:
    "The '{{variableName}}' {{type}} (at line {{nodeLine}}) passed as the value prop to the Context provider (at line {{usageLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.",
  defaultMsg:
    'The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useMemo hook.',
  defaultMsgFunc:
    'The {{type}} passed as the value prop to the Context provider (at line {{nodeLine}}) changes every render. To fix this consider wrapping it in a useCallback hook.',
};

function isReactCreateContextCall(context, node) {
  if (node?.type !== 'CallExpression') {
    return false;
  }

  if (node.callee.type === 'Identifier') {
    return reactImports.isNamedImport(context, node.callee, 'react', 'createContext');
  }

  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.object.type === 'Identifier' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'createContext' &&
    reactImports.isModuleObject(context, node.callee.object, 'react')
  );
}

function isReactContext(context, node) {
  if (node.type !== 'Identifier' && node.type !== 'JSXIdentifier') {
    return false;
  }

  const definition = reactImports.getVariable(context, node)?.defs?.at(-1);
  return definition?.node.type === 'VariableDeclarator' && isReactCreateContextCall(context, definition.node.init);
}

function isContextProvider(context, name) {
  return name.type === 'JSXIdentifier' && isReactContext(context, name);
}

function isConstruction(context, node) {
  switch (node.type) {
    case 'Literal':
      return node.regex === undefined || node.regex === null ? null : { node, type: 'regular expression' };
    case 'Identifier': {
      const definition = reactImports.getVariable(context, node)?.defs?.at(-1);
      if (!definition || (definition.type !== 'Variable' && definition.type !== 'FunctionName')) {
        return null;
      }
      if (definition.node.type === 'FunctionDeclaration') {
        return { node: definition.node, type: 'function declaration', usage: node };
      }
      const initializer = definition.node.init;
      if (!initializer) {
        return null;
      }
      const construction = isConstruction(context, initializer);
      return construction ? { ...construction, usage: node } : null;
    }
    case 'ObjectExpression':
      return { node, type: 'object' };
    case 'ArrayExpression':
      return { node, type: 'array' };
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return { node, type: 'function expression' };
    case 'ClassExpression':
      return { node, type: 'class expression' };
    case 'NewExpression':
      return { node, type: 'new expression' };
    case 'ConditionalExpression':
      return isConstruction(context, node.consequent) || isConstruction(context, node.alternate);
    case 'LogicalExpression':
      return isConstruction(context, node.left) || isConstruction(context, node.right);
    case 'MemberExpression': {
      const construction = isConstruction(context, node.object);
      return construction ? { ...construction, usage: node.object } : null;
    }
    case 'JSXFragment':
      return { node, type: 'JSX fragment' };
    case 'JSXElement':
      return { node, type: 'JSX element' };
    case 'AssignmentExpression': {
      const construction = isConstruction(context, node.right);
      return construction ? { ...construction, type: 'assignment expression', usage: node } : null;
    }
    case 'TypeCastExpression':
    case 'TSAsExpression':
      return isConstruction(context, node.expression);
    default:
      return null;
  }
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow Context provider values that change identity on every render',
      category: 'performance',
      recommended: true,
      url: docsUrl('jsx-no-constructed-context-values'),
    },
    messages,
    schema: [],
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        if (!isContextProvider(context, node.name) || !reactComponents.isInsideReactComponent(context, node)) {
          return;
        }

        const valueAttribute = node.attributes.find(
          (attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === 'value',
        );
        if (!valueAttribute?.value || valueAttribute.value.type !== 'JSXExpressionContainer') {
          return;
        }

        const construction = isConstruction(context, valueAttribute.value.expression);
        if (!construction) {
          return;
        }

        const data = { nodeLine: construction.node.loc.start.line, type: construction.type };
        let messageId = 'defaultMsg';
        if (construction.usage) {
          messageId = 'withIdentifierMsg';
          data.usageLine = construction.usage.loc.start.line;
          data.variableName = construction.usage.name;
        }
        if (construction.type === 'function expression' || construction.type === 'function declaration') {
          messageId += 'Func';
        }

        context.report({ data, messageId, node: construction.node });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
