import contextProviderRequiresValue from './rules/context-provider-requires-value.js';
import controlledFormRequiresHandler from './rules/controlled-form-requires-handler.js';
import jsxNoConstructedContextValues from './rules/jsx-no-constructed-context-values.js';
import jsxNoKeyAfterSpread from './rules/jsx-no-key-after-spread.js';
import noAddTransitionTypeOutsideTransition from './rules/no-add-transition-type-outside-transition.js';
import noDeprecated from './rules/no-deprecated.js';
import noDirectMutationState from './rules/no-direct-mutation-state.js';
import noFunctionDefaultProps from './rules/no-function-default-props.js';
import noImplicitRefCallbackReturn from './rules/no-implicit-ref-callback-return.js';
import noInvalidBrowserCall from './rules/no-invalid-browser-call.js';
import noInvalidFormAction from './rules/no-invalid-form-action.js';
import noInvalidFragmentRefScrollIntoView from './rules/no-invalid-fragment-ref-scroll-into-view.js';
import noInvalidHtmlAttribute from './rules/no-invalid-html-attribute.js';
import noInvalidTitleChildren from './rules/no-invalid-title-children.js';
import noInvalidUseArgument from './rules/no-invalid-use-argument.js';
import noMisspelledLifecycleMethods from './rules/no-misspelled-lifecycle-methods.js';
import noPropTypes from './rules/no-prop-types.js';
import noUncachedUsePromise from './rules/no-uncached-use-promise.js';
import preferUseStateLazyInitialization from './rules/prefer-use-state-lazy-initialization.js';
import viewTransitionEventRequiresCleanup from './rules/view-transition-event-requires-cleanup.js';

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
  defineRule('context-provider-requires-value', contextProviderRequiresValue, {
    category: 'correctness',
    recommended: 'error',
  }),
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
  defineRule('no-add-transition-type-outside-transition', noAddTransitionTypeOutsideTransition, {
    category: 'correctness',
    recommended: 'off',
  }),
  defineRule('no-deprecated', noDeprecated, { category: 'correctness', recommended: 'error' }),
  defineRule('no-direct-mutation-state', noDirectMutationState, { category: 'correctness', recommended: 'error' }),
  defineRule('no-function-default-props', noFunctionDefaultProps, { category: 'correctness', recommended: 'error' }),
  defineRule('no-implicit-ref-callback-return', noImplicitRefCallbackReturn, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-invalid-browser-call', noInvalidBrowserCall, { category: 'correctness', recommended: 'error' }),
  defineRule('no-invalid-form-action', noInvalidFormAction, { category: 'correctness', recommended: 'error' }),
  defineRule('no-invalid-fragment-ref-scroll-into-view', noInvalidFragmentRefScrollIntoView, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-invalid-html-attribute', noInvalidHtmlAttribute, { category: 'correctness', recommended: 'error' }),
  defineRule('no-invalid-title-children', noInvalidTitleChildren, { category: 'correctness', recommended: 'error' }),
  defineRule('no-invalid-use-argument', noInvalidUseArgument, { category: 'correctness', recommended: 'error' }),
  defineRule('no-misspelled-lifecycle-methods', noMisspelledLifecycleMethods, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-prop-types', noPropTypes, { category: 'correctness', recommended: 'error' }),
  defineRule('no-uncached-use-promise', noUncachedUsePromise, { category: 'correctness', recommended: 'error' }),
  defineRule('prefer-use-state-lazy-initialization', preferUseStateLazyInitialization, {
    category: 'performance',
    recommended: 'warn',
  }),
  defineRule('view-transition-event-requires-cleanup', viewTransitionEventRequiresCleanup, {
    category: 'correctness',
    recommended: 'warn',
  }),
]);

export default ruleRegistry;
export { ruleRegistry as 'module.exports' };
