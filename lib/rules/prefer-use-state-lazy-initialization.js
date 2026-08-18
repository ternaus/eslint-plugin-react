/**
 * @fileoverview Prefer lazy initialization for eager React useState values.
 */

import astUtil from '../util/ast.js';
import Components from '../util/Components.js';
import docsUrl from '../util/docsUrl.js';
import report from '../util/report.js';

const messages = {
  useLazyInitialization: 'Pass a lazy initializer to useState to avoid recomputing the initial value on every render.',
};

function containsEagerCall(node) {
  let found = false;

  astUtil.traverse(node, {
    enter(currentNode) {
      if (currentNode.type === 'ArrowFunctionExpression' || currentNode.type === 'FunctionExpression') {
        this.skip();
        return;
      }

      if (currentNode.type === 'CallExpression') {
        found = true;
        this.break();
      }
    },
  });

  return found;
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer lazy initialization for React useState values that call a function',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('prefer-use-state-lazy-initialization'),
    },
    messages,
    schema: [],
  },

  create: Components.detect((context, _components, util) => ({
    CallExpression(node) {
      const initializer = node.arguments[0];
      if (!initializer || !util.isReactHookCall(node, ['useState']) || !containsEagerCall(initializer)) {
        return;
      }

      report(context, messages.useLazyInitialization, 'useLazyInitialization', { node: initializer });
    },
  })),
};

export default exported;
export { exported as 'module.exports' };
