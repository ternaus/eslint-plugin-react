import docsUrl from '../util/docsUrl.js';
import elementProps from '../util/elementProps.js';
import reactImports from '../util/reactImports.js';

function isContextProvider(context, node) {
  if (node?.type === 'JSXMemberExpression' && node.property.name === 'Provider') {
    node = node.object;
  } else if (node?.type === 'MemberExpression' && !node.computed && node.property.name === 'Provider') {
    node = node.object;
  }
  return (
    (node?.type === 'Identifier' || node?.type === 'JSXIdentifier') &&
    reactImports.isReactCall(context, reactImports.getConstantInitializer(context, node), 'createContext')
  );
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require an explicit value on a statically identified Context provider',
      recommended: true,
      url: docsUrl('context-provider-requires-value'),
    },
    messages: {
      missingValue:
        'A Context provider without value passes undefined, not the createContext default. Add an explicit value prop.',
    },
    schema: [],
  },

  create(context) {
    function check(node, provider, props) {
      if (props && !props.has('value') && isContextProvider(context, provider)) {
        context.report({ node, messageId: 'missingValue' });
      }
    }
    return {
      JSXOpeningElement(node) {
        check(node, node.name, elementProps.getJsxProps(node));
      },
      CallExpression(node) {
        if (!reactImports.isReactCall(context, node, 'createElement')) {
          return;
        }
        check(node, node.arguments[0], elementProps.getCreateElementProps(node.arguments[1]));
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
