import docsUrl from '../util/docsUrl.js';
import reactImports from '../util/reactImports.js';

function isUnsupported(context, node) {
  if (!node) {
    return true;
  }
  if (node.type === 'Literal') {
    return !node.regex;
  }
  if (node.type === 'Identifier') {
    return (
      ['undefined', 'NaN', 'Infinity'].includes(node.name) && !reactImports.getVariable(context, node)?.defs?.length
    );
  }
  return ['TemplateLiteral', 'UnaryExpression', 'ArrowFunctionExpression', 'FunctionExpression'].includes(node.type);
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow statically unsupported arguments to React use',
      recommended: true,
      url: docsUrl('no-invalid-use-argument'),
    },
    messages: {
      unsupported: 'React use expects a supported resource such as a Promise or Context, not a primitive or function.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (reactImports.isReactCall(context, node, 'use') && isUnsupported(context, node.arguments[0])) {
          context.report({ node: node.arguments[0] ?? node, messageId: 'unsupported' });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
