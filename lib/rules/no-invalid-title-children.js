import docsUrl from '../util/docsUrl.js';
import elementProps from '../util/elementProps.js';
import reactImports from '../util/reactImports.js';

function hasJsxText(node) {
  const lines = node.value.replaceAll('\t', ' ').split(/\r\n|\n|\r/u);
  return lines.some((line, index) => {
    if (index > 0) {
      line = line.replace(/^ +/u, '');
    }
    if (index < lines.length - 1) {
      line = line.replace(/ +$/u, '');
    }
    return line.length > 0;
  });
}

function isInvalidChild(context, node) {
  if (node?.type === 'JSXExpressionContainer') {
    return isInvalidChild(context, node.expression);
  }
  if (node?.type === 'ArrayExpression') {
    return node.elements.length > 1 && !node.elements.some((element) => element?.type === 'SpreadElement');
  }
  if (reactImports.isReactCall(context, node, 'createElement')) {
    const name = node.arguments[0]?.value;
    return typeof name === 'string' && /^[a-z]/u.test(name);
  }
  return (
    node?.type === 'JSXElement' &&
    node.openingElement.name.type === 'JSXIdentifier' &&
    /^[a-z]/u.test(node.openingElement.name.name)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow multiple children or intrinsic markup in an HTML title',
      recommended: true,
      url: docsUrl('no-invalid-title-children'),
    },
    messages: {
      invalidChildren:
        'An HTML title needs a single text value. Combine text and expressions in a template literal and remove intrinsic markup.',
    },
    schema: [],
  },
  create(context) {
    function check(node, children) {
      if (
        elementProps.isHtmlNamespace(context, node) &&
        (children.length > 1 || isInvalidChild(context, children[0]))
      ) {
        context.report({ node, messageId: 'invalidChildren' });
      }
    }
    return {
      JSXElement(node) {
        if (node.openingElement.name.type !== 'JSXIdentifier' || node.openingElement.name.name !== 'title') {
          return;
        }
        const props = elementProps.getJsxProps(node.openingElement);
        if (!props || props.has('is')) {
          return;
        }
        const children = node.children.filter((child) =>
          child.type === 'JSXText'
            ? hasJsxText(child)
            : !(child.type === 'JSXExpressionContainer' && child.expression.type === 'JSXEmptyExpression'),
        );
        check(node, children.length ? children : [props.get('children')]);
      },
      CallExpression(node) {
        if (!reactImports.isReactCall(context, node, 'createElement') || node.arguments[0]?.value !== 'title') {
          return;
        }
        const props = elementProps.getCreateElementProps(context, node.arguments[1]);
        if (!props || props.has('is') || node.arguments.some((argument) => argument.type === 'SpreadElement')) {
          return;
        }
        check(node, node.arguments.length > 2 ? node.arguments.slice(2) : [props.get('children')]);
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
