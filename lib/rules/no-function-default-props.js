import docsUrl from '../util/docsUrl.js';
import reactComponents from '../util/reactComponents.js';

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow function component defaultProps ignored by React 19',
      recommended: false,
      url: docsUrl('no-function-default-props'),
    },
    messages: {
      defaultProps: 'React 19 ignores defaultProps on function components. Use a default parameter instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      AssignmentExpression(node) {
        if (
          node.left.type !== 'MemberExpression' ||
          node.left.computed ||
          node.left.object.type !== 'Identifier' ||
          node.left.property.type !== 'Identifier' ||
          node.left.property.name !== 'defaultProps' ||
          !reactComponents.getFunctionComponent(context, node.left.object)
        ) {
          return;
        }

        context.report({ messageId: 'defaultProps', node: node.left.property });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
