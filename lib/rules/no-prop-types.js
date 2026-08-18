import docsUrl from '../util/docsUrl.js';
import reactComponents from '../util/reactComponents.js';

function isPropTypesMember(node) {
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'Identifier' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'propTypes'
  );
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow component propTypes ignored by React 19',
      recommended: true,
      url: docsUrl('no-prop-types'),
    },
    messages: {
      propTypes:
        'React 19 ignores component propTypes. Use TypeScript or an external runtime schema at the boundary instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      AssignmentExpression(node) {
        if (!isPropTypesMember(node.left) || !reactComponents.getFunctionComponent(context, node.left.object)) {
          return;
        }
        context.report({ messageId: 'propTypes', node: node.left.property });
      },
      PropertyDefinition(node) {
        if (
          node.static &&
          node.key.type === 'Identifier' &&
          node.key.name === 'propTypes' &&
          reactComponents.isReactComponentClass(context, node.parent.parent)
        ) {
          context.report({ messageId: 'propTypes', node: node.key });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
