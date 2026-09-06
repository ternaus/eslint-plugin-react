import docsUrl from '../util/docsUrl.js';
import reactComponents from '../util/reactComponents.js';
import reactImports from '../util/reactImports.js';

function enclosingFunction(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (/^(ArrowFunctionExpression|FunctionDeclaration|FunctionExpression)$/u.test(parent.type)) {
      return parent;
    }
  }
  return null;
}

function isRenderFunction(node) {
  if (!node || node.async) {
    return false;
  }
  const name = node.id?.name ?? (node.parent?.type === 'VariableDeclarator' ? node.parent.id.name : null);
  return reactComponents.isFunctionComponent(node) || /^use[A-Z0-9]/u.test(name ?? '');
}

function createsPromise(context, node) {
  if (node?.type !== 'CallExpression' && node?.type !== 'NewExpression') {
    return false;
  }
  const name = node.type === 'NewExpression' ? 'Promise' : 'fetch';
  return (
    node.callee.type === 'Identifier' &&
    node.callee.name === name &&
    !reactImports.getVariable(context, node.callee)?.defs?.length
  );
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow fresh fetch or Promise results passed to use during client rendering',
      recommended: true,
      url: docsUrl('no-uncached-use-promise'),
    },
    messages: {
      uncached: 'This creates a new Promise during rendering. Pass use a cached Promise that is reused across renders.',
    },
    schema: [],
  },
  create(context) {
    if (!context.sourceCode.ast.body.some((statement) => statement.directive === 'use client')) {
      return {};
    }
    return {
      CallExpression(node) {
        if (!reactImports.isReactCall(context, node, 'use')) {
          return;
        }
        const render = enclosingFunction(node);
        if (!isRenderFunction(render)) {
          return;
        }
        let argument = node.arguments[0];
        if (argument?.type === 'Identifier') {
          const initializer = reactImports.getConstantInitializer(context, argument);
          if (!initializer || enclosingFunction(initializer) !== render) {
            return;
          }
          argument = initializer;
        }
        if (createsPromise(context, argument)) {
          context.report({ node: node.arguments[0], messageId: 'uncached' });
        }
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
