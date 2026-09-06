import docsUrl from '../util/docsUrl.js';
import elementProps from '../util/elementProps.js';
import reactImports from '../util/reactImports.js';

function isKnownFunction(context, node) {
  if (!node) {
    return false;
  }
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
    return true;
  }
  if (node.type !== 'Identifier') {
    return false;
  }
  const variable = reactImports.getVariable(context, node);
  const definition = variable?.defs?.[0];
  if (variable?.references.some((reference) => reference.isWrite() && !reference.init)) {
    return false;
  }
  if (definition?.type === 'FunctionName' && definition.node.type === 'FunctionDeclaration') {
    return true;
  }
  if (definition?.type !== 'Variable' || definition.parent.kind !== 'const') {
    return false;
  }
  const { id, init } = definition.node;
  if (id.type === 'ArrayPattern') {
    return id.elements[1]?.name === node.name && reactImports.isReactCall(context, init, 'useActionState');
  }
  return id.type === 'Identifier' && (init?.type === 'ArrowFunctionExpression' || init?.type === 'FunctionExpression');
}

function isKnownPresent(context, node) {
  if (node?.type === 'Identifier') {
    node = reactImports.getConstantInitializer(context, node);
  }
  return (node?.type === 'Literal' && node.value !== null) || node?.type === 'TemplateLiteral';
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow incompatible props and submitter types for form Actions',
      recommended: true,
      url: docsUrl('no-invalid-form-action'),
    },
    messages: {
      overridden: '{{prop}} is overridden by React when {{action}} is a function. Remove {{prop}}.',
      inputType: 'An input with formAction must have type="submit" or type="image".',
      buttonType: 'A button with formAction must have type="submit" or no type.',
    },
    schema: [],
  },

  create(context) {
    function check(node, tag, props) {
      if (!props || props.has('is') || !elementProps.isHtmlNamespace(context, node)) {
        return;
      }
      const action = tag === 'form' ? 'action' : 'formAction';
      const value = props.get(action);
      const isFunction = isKnownFunction(context, value);
      if (!isFunction && !isKnownPresent(context, value)) {
        return;
      }
      const type = props.get('type');
      const literalType = type?.type === 'Literal' ? type.value : undefined;
      const hasKnownType = !props.has('type') || type?.type === 'Literal';
      if (tag === 'input' && hasKnownType && literalType !== 'submit' && literalType !== 'image') {
        context.report({ node, messageId: 'inputType' });
        return;
      }
      if (tag === 'button' && hasKnownType && literalType != null && literalType !== 'submit') {
        context.report({ node, messageId: 'buttonType' });
        return;
      }
      if (!isFunction) {
        return;
      }
      const conflicts =
        tag === 'form' ? ['method', 'encType', 'target'] : ['name', 'formMethod', 'formEncType', 'formTarget'];
      for (const prop of conflicts) {
        if (isKnownPresent(context, props.get(prop))) {
          context.report({ node, messageId: 'overridden', data: { prop, action } });
        }
      }
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.type === 'JSXIdentifier' && ['form', 'button', 'input'].includes(node.name.name)) {
          check(node, node.name.name, elementProps.getJsxProps(node));
        }
      },
      CallExpression(node) {
        if (
          reactImports.isReactCall(context, node, 'createElement') &&
          ['form', 'button', 'input'].includes(node.arguments[0]?.value)
        ) {
          check(node, node.arguments[0].value, elementProps.getCreateElementProps(context, node.arguments[1]));
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
