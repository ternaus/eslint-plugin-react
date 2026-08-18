import docsUrl from '../util/docsUrl.js';
import reactComponents from '../util/reactComponents.js';

const messages = {
  noDirectMutation: 'Do not mutate state directly. Use setState().',
};

function isThisStateMember(node) {
  return (
    node.type === 'MemberExpression' &&
    !node.computed &&
    node.object.type === 'ThisExpression' &&
    node.property.type === 'Identifier' &&
    node.property.name === 'state'
  );
}

function mutatesThisState(node) {
  let current = node;
  while (current.type === 'MemberExpression') {
    if (isThisStateMember(current)) {
      return true;
    }
    current = current.object;
  }
  return false;
}

function getReactClass(context, node) {
  let current = node.parent;
  while (current) {
    if (current.type === 'ClassDeclaration' || current.type === 'ClassExpression') {
      return reactComponents.isReactComponentClass(context, current) ? current : null;
    }
    if (
      (current.type === 'FunctionDeclaration' || current.type === 'FunctionExpression') &&
      current.parent?.type !== 'MethodDefinition'
    ) {
      return null;
    }
    current = current.parent;
  }
  return null;
}

function isInConstructor(node, component) {
  let current = node.parent;
  while (current && current !== component) {
    if (current.parent === component.body && current.type === 'MethodDefinition') {
      return current.kind === 'constructor';
    }
    if (
      (current.type === 'ArrowFunctionExpression' ||
        current.type === 'FunctionDeclaration' ||
        current.type === 'FunctionExpression') &&
      current.parent?.type !== 'MethodDefinition'
    ) {
      return false;
    }
    current = current.parent;
  }
  return false;
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Disallow direct mutation of this.state',
      category: 'correctness',
      recommended: true,
      url: docsUrl('no-direct-mutation-state'),
    },
    messages,
    schema: [],
  },

  create(context) {
    function reportIfStateMutation(node, target) {
      const component = getReactClass(context, node);
      if (!component || isInConstructor(node, component) || !mutatesThisState(target)) {
        return;
      }
      context.report({ messageId: 'noDirectMutation', node: target });
    }

    return {
      AssignmentExpression(node) {
        reportIfStateMutation(node, node.left);
      },
      UpdateExpression(node) {
        reportIfStateMutation(node, node.argument);
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
