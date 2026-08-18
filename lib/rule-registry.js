import controlledFormRequiresHandler from './rules/controlled-form-requires-handler.js';
import jsxNoConstructedContextValues from './rules/jsx-no-constructed-context-values.js';
import jsxNoKeyAfterSpread from './rules/jsx-no-key-after-spread.js';
import noDeprecated from './rules/no-deprecated.js';
import noDirectMutationState from './rules/no-direct-mutation-state.js';
import noFunctionDefaultProps from './rules/no-function-default-props.js';
import noImplicitRefCallbackReturn from './rules/no-implicit-ref-callback-return.js';
import noInvalidHtmlAttribute from './rules/no-invalid-html-attribute.js';
import noMisspelledLifecycleMethods from './rules/no-misspelled-lifecycle-methods.js';
import noPropTypes from './rules/no-prop-types.js';
import preferUseStateLazyInitialization from './rules/prefer-use-state-lazy-initialization.js';

function defineRule(name, implementation, { category, recommended }) {
  return Object.freeze({
    category,
    documentationPath: `docs/rules/${name}.md`,
    implementation,
    name,
    recommended,
    requiresTypeInformation: false,
    testPath: `tests/lib/rules/${name}.js`,
  });
}

const ruleRegistry = Object.freeze([
  defineRule('controlled-form-requires-handler', controlledFormRequiresHandler, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('jsx-no-constructed-context-values', jsxNoConstructedContextValues, {
    category: 'performance',
    recommended: 'warn',
  }),
  defineRule('jsx-no-key-after-spread', jsxNoKeyAfterSpread, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-deprecated', noDeprecated, { category: 'correctness', recommended: 'error' }),
  defineRule('no-direct-mutation-state', noDirectMutationState, { category: 'correctness', recommended: 'error' }),
  defineRule('no-function-default-props', noFunctionDefaultProps, { category: 'correctness', recommended: 'error' }),
  defineRule('no-implicit-ref-callback-return', noImplicitRefCallbackReturn, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-invalid-html-attribute', noInvalidHtmlAttribute, { category: 'correctness', recommended: 'error' }),
  defineRule('no-misspelled-lifecycle-methods', noMisspelledLifecycleMethods, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-prop-types', noPropTypes, { category: 'correctness', recommended: 'error' }),
  defineRule('prefer-use-state-lazy-initialization', preferUseStateLazyInitialization, {
    category: 'performance',
    recommended: 'warn',
  }),
]);

export default ruleRegistry;
export { ruleRegistry as 'module.exports' };
