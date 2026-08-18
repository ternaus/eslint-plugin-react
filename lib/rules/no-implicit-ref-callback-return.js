import docsUrl from '../util/docsUrl.js';

function isSafeImplicitReturn(node) {
  return node.type === 'AssignmentExpression' || node.type === 'UpdateExpression';
}

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      category: 'Possible Errors',
      description: 'Disallow ref callbacks that implicitly return an assignment or update',
      recommended: false,
      url: docsUrl('no-implicit-ref-callback-return'),
    },
    fixable: 'code',
    messages: {
      implicitReturn: 'A ref callback must not implicitly return a value in React 19.',
    },
    schema: [],
  },

  create(context) {
    const sourceCode = context.sourceCode;

    return {
      JSXAttribute(node) {
        if (
          node.name.type !== 'JSXIdentifier' ||
          node.name.name !== 'ref' ||
          node.value?.type !== 'JSXExpressionContainer' ||
          node.value.expression.type !== 'ArrowFunctionExpression' ||
          !isSafeImplicitReturn(node.value.expression.body)
        ) {
          return;
        }

        const body = node.value.expression.body;
        context.report({
          fix(fixer) {
            const before = sourceCode.getTokenBefore(body);
            const after = sourceCode.getTokenAfter(body);
            const range =
              before?.value === '(' && after?.value === ')' ? [before.range[0], after.range[1]] : body.range;
            return fixer.replaceTextRange(range, `{ ${sourceCode.getText(body)}; }`);
          },
          messageId: 'implicitReturn',
          node: body,
        });
      },
    };
  },
};

export default exported;
export { exported as 'module.exports' };
