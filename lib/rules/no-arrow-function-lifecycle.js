/**
 * @fileoverview Lifecycle methods should be methods on the prototype, not class fields
 * @author Tan Nguyen
 */

import astUtil from '../util/ast.js';
import Components from '../util/Components.js';
import componentUtil from '../util/componentUtil.js';
import docsUrl from '../util/docsUrl.js';
import eslintUtil from '../util/eslint.js';
import lifecycleMethods from '../util/lifecycleMethods.js';
import report from '../util/report.js';

const getSourceCode = eslintUtil.getSourceCode;
const getText = eslintUtil.getText;

function getRuleText(node) {
  const params = node.value.params.map((p) => p.name);

  if (node.type === 'Property') {
    return `: function(${params.join(', ')}) `;
  }

  if (node.type === 'ClassProperty' || node.type === 'PropertyDefinition') {
    return `(${params.join(', ')}) `;
  }

  return null;
}

const messages = {
  lifecycle:
    '{{propertyName}} is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.',
};

/** @type {import('eslint').Rule.RuleModule} */
const exported = {
  meta: {
    docs: {
      description: 'Lifecycle methods should be methods on the prototype, not class fields',
      category: 'Best Practices',
      recommended: false,
      url: docsUrl('no-arrow-function-lifecycle'),
    },
    messages,
    schema: [],
    fixable: 'code',
  },

  create: Components.detect((context, components) => {
    /**
     * @param {Array} properties list of component properties
     */
    function reportNoArrowFunctionLifecycle(properties) {
      properties.forEach((node) => {
        if (!node || !node.value) {
          return;
        }

        const propertyName = astUtil.getPropertyName(node);
        const nodeType = node.value.type;
        const isLifecycleMethod =
          (node.static && !componentUtil.isES5Component(node, context)
            ? lifecycleMethods.static
            : lifecycleMethods.instance
          ).indexOf(propertyName) > -1;

        if (nodeType === 'ArrowFunctionExpression' && isLifecycleMethod) {
          const body = node.value.body;
          const isBlockBody = body.type === 'BlockStatement';
          const sourceCode = getSourceCode(context);

          let nextComment = [];
          let previousComment = [];
          let bodyRange;
          if (!isBlockBody) {
            previousComment = sourceCode.getCommentsBefore(body);
            nextComment = sourceCode.getCommentsAfter(body);
            bodyRange = [
              (previousComment.length > 0 ? previousComment[0] : body).range[0],
              (nextComment.length > 0 ? nextComment[nextComment.length - 1] : body).range[1] +
                (node.value.body.type === 'ObjectExpression' ? 1 : 0), // to account for a wrapped end paren
            ];
          }
          const headRange = [node.key.range[1], (previousComment.length > 0 ? previousComment[0] : body).range[0]];
          const hasSemi =
            node.value.expression && getText(context, node).slice(node.value.range[1] - node.range[0]) === ';';

          report(context, messages.lifecycle, 'lifecycle', {
            node,
            data: {
              propertyName,
            },
            fix(fixer) {
              const replaceHead = fixer.replaceTextRange(headRange, getRuleText(node));
              if (isBlockBody) {
                return replaceHead;
              }
              return [
                replaceHead,
                fixer.replaceTextRange(
                  [bodyRange[0], bodyRange[1] + (hasSemi ? 1 : 0)],
                  `{ return ${previousComment.map((x) => getText(context, x)).join('')}${getText(context, body)}${nextComment.map((x) => getText(context, x)).join('')}; }`,
                ),
              ];
            },
          });
        }
      });
    }

    return {
      'Program:exit'() {
        Object.values(components.list()).forEach((component) => {
          const properties = astUtil.getComponentProperties(component.node);
          reportNoArrowFunctionLifecycle(properties);
        });
      },
    };
  }),
};

export default exported;
export { exported as 'module.exports' };
