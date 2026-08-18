import asyncServerAction from './rules/async-server-action.js';
import booleanPropNaming from './rules/boolean-prop-naming.js';
import buttonHasType from './rules/button-has-type.js';
import controlledFormRequiresHandler from './rules/controlled-form-requires-handler.js';
import destructuringAssignment from './rules/destructuring-assignment.js';
import displayName from './rules/display-name.js';
import forbidComponentProps from './rules/forbid-component-props.js';
import forbidDomProps from './rules/forbid-dom-props.js';
import forbidElements from './rules/forbid-elements.js';
import functionComponentDefinition from './rules/function-component-definition.js';
import hookUseState from './rules/hook-use-state.js';
import iframeMissingSandbox from './rules/iframe-missing-sandbox.js';
import jsxBooleanValue from './rules/jsx-boolean-value.js';
import jsxCurlyBracePresence from './rules/jsx-curly-brace-presence.js';
import jsxFilenameExtension from './rules/jsx-filename-extension.js';
import jsxFragments from './rules/jsx-fragments.js';
import jsxHandlerNames from './rules/jsx-handler-names.js';
import jsxKey from './rules/jsx-key.js';
import jsxMaxDepth from './rules/jsx-max-depth.js';
import jsxNoBind from './rules/jsx-no-bind.js';
import jsxNoCommentTextnodes from './rules/jsx-no-comment-textnodes.js';
import jsxNoConstructedContextValues from './rules/jsx-no-constructed-context-values.js';
import jsxNoDuplicateProps from './rules/jsx-no-duplicate-props.js';
import jsxNoKeyAfterSpread from './rules/jsx-no-key-after-spread.js';
import jsxNoLeakedRender from './rules/jsx-no-leaked-render.js';
import jsxNoLiterals from './rules/jsx-no-literals.js';
import jsxNoScriptUrl from './rules/jsx-no-script-url.js';
import jsxNoUselessFragment from './rules/jsx-no-useless-fragment.js';
import jsxPascalCase from './rules/jsx-pascal-case.js';
import jsxPropsNoSpreadMulti from './rules/jsx-props-no-spread-multi.js';
import jsxPropsNoSpreading from './rules/jsx-props-no-spreading.js';
import jsxSortProps from './rules/jsx-sort-props.js';
import noAccessStateInSetstate from './rules/no-access-state-in-setstate.js';
import noAdjacentInlineElements from './rules/no-adjacent-inline-elements.js';
import noArrayIndexKey from './rules/no-array-index-key.js';
import noArrowFunctionLifecycle from './rules/no-arrow-function-lifecycle.js';
import noChildrenProp from './rules/no-children-prop.js';
import noDanger from './rules/no-danger.js';
import noDangerWithChildren from './rules/no-danger-with-children.js';
import noDeprecated from './rules/no-deprecated.js';
import noDidMountSetState from './rules/no-did-mount-set-state.js';
import noDidUpdateSetState from './rules/no-did-update-set-state.js';
import noDirectMutationState from './rules/no-direct-mutation-state.js';
import noFunctionDefaultProps from './rules/no-function-default-props.js';
import noImplicitRefCallbackReturn from './rules/no-implicit-ref-callback-return.js';
import noInvalidHtmlAttribute from './rules/no-invalid-html-attribute.js';
import noMisspelledLifecycleMethods from './rules/no-misspelled-lifecycle-methods.js';
import noMultiComp from './rules/no-multi-comp.js';
import noNamespace from './rules/no-namespace.js';
import noObjectTypeAsDefaultProp from './rules/no-object-type-as-default-prop.js';
import noPropTypes from './rules/no-prop-types.js';
import noRedundantShouldComponentUpdate from './rules/no-redundant-should-component-update.js';
import noRenderReturnUndefined from './rules/no-render-return-undefined.js';
import noSetState from './rules/no-set-state.js';
import noStringRefs from './rules/no-string-refs.js';
import noThisInSfc from './rules/no-this-in-sfc.js';
import noUnescapedEntities from './rules/no-unescaped-entities.js';
import noUnknownProperty from './rules/no-unknown-property.js';
import noUnsafe from './rules/no-unsafe.js';
import noUnusedClassComponentMethods from './rules/no-unused-class-component-methods.js';
import noUnusedPropTypes from './rules/no-unused-prop-types.js';
import noUnusedState from './rules/no-unused-state.js';
import noWillUpdateSetState from './rules/no-will-update-set-state.js';
import preferReadOnlyProps from './rules/prefer-read-only-props.js';
import preferStatelessFunction from './rules/prefer-stateless-function.js';
import preferUseStateLazyInitialization from './rules/prefer-use-state-lazy-initialization.js';
import selfClosingComp from './rules/self-closing-comp.js';
import sortComp from './rules/sort-comp.js';
import sortDefaultProps from './rules/sort-default-props.js';
import stateInConstructor from './rules/state-in-constructor.js';
import staticPropertyPlacement from './rules/static-property-placement.js';
import stylePropObject from './rules/style-prop-object.js';
import voidDomElementsNoChildren from './rules/void-dom-elements-no-children.js';

function defineRule(name, implementation, { category = 'policy', recommended = 'off' } = {}) {
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
  defineRule('async-server-action', asyncServerAction, { category: 'correctness', recommended: 'error' }),
  defineRule('boolean-prop-naming', booleanPropNaming),
  defineRule('button-has-type', buttonHasType, { category: 'correctness', recommended: 'error' }),
  defineRule('controlled-form-requires-handler', controlledFormRequiresHandler, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('destructuring-assignment', destructuringAssignment),
  defineRule('display-name', displayName),
  defineRule('forbid-component-props', forbidComponentProps),
  defineRule('forbid-dom-props', forbidDomProps),
  defineRule('forbid-elements', forbidElements),
  defineRule('function-component-definition', functionComponentDefinition),
  defineRule('hook-use-state', hookUseState),
  defineRule('iframe-missing-sandbox', iframeMissingSandbox, { category: 'security' }),
  defineRule('jsx-boolean-value', jsxBooleanValue),
  defineRule('jsx-curly-brace-presence', jsxCurlyBracePresence),
  defineRule('jsx-filename-extension', jsxFilenameExtension),
  defineRule('jsx-fragments', jsxFragments),
  defineRule('jsx-handler-names', jsxHandlerNames),
  defineRule('jsx-key', jsxKey, { category: 'correctness', recommended: 'error' }),
  defineRule('jsx-no-key-after-spread', jsxNoKeyAfterSpread, { category: 'correctness', recommended: 'error' }),
  defineRule('jsx-max-depth', jsxMaxDepth),
  defineRule('jsx-no-bind', jsxNoBind, { category: 'performance' }),
  defineRule('jsx-no-comment-textnodes', jsxNoCommentTextnodes, { category: 'correctness', recommended: 'error' }),
  defineRule('jsx-no-constructed-context-values', jsxNoConstructedContextValues, {
    category: 'performance',
    recommended: 'warn',
  }),
  defineRule('jsx-no-duplicate-props', jsxNoDuplicateProps, { category: 'correctness', recommended: 'error' }),
  defineRule('jsx-no-leaked-render', jsxNoLeakedRender, { category: 'correctness' }),
  defineRule('jsx-no-literals', jsxNoLiterals),
  defineRule('jsx-no-script-url', jsxNoScriptUrl, { category: 'security', recommended: 'error' }),
  defineRule('jsx-no-useless-fragment', jsxNoUselessFragment, { category: 'correctness' }),
  defineRule('jsx-pascal-case', jsxPascalCase),
  defineRule('jsx-props-no-spread-multi', jsxPropsNoSpreadMulti),
  defineRule('jsx-props-no-spreading', jsxPropsNoSpreading),
  defineRule('jsx-sort-props', jsxSortProps),
  defineRule('no-access-state-in-setstate', noAccessStateInSetstate, { category: 'correctness' }),
  defineRule('no-adjacent-inline-elements', noAdjacentInlineElements),
  defineRule('no-array-index-key', noArrayIndexKey, { category: 'correctness', recommended: 'warn' }),
  defineRule('no-arrow-function-lifecycle', noArrowFunctionLifecycle, { category: 'correctness' }),
  defineRule('no-children-prop', noChildrenProp, { category: 'correctness' }),
  defineRule('no-danger', noDanger, { category: 'security', recommended: 'warn' }),
  defineRule('no-danger-with-children', noDangerWithChildren, { category: 'security', recommended: 'error' }),
  defineRule('no-deprecated', noDeprecated, { category: 'correctness', recommended: 'error' }),
  defineRule('no-did-mount-set-state', noDidMountSetState, { category: 'correctness' }),
  defineRule('no-did-update-set-state', noDidUpdateSetState, { category: 'correctness' }),
  defineRule('no-direct-mutation-state', noDirectMutationState, { category: 'correctness', recommended: 'error' }),
  defineRule('no-function-default-props', noFunctionDefaultProps, { category: 'correctness', recommended: 'error' }),
  defineRule('no-invalid-html-attribute', noInvalidHtmlAttribute, { category: 'correctness', recommended: 'error' }),
  defineRule('no-implicit-ref-callback-return', noImplicitRefCallbackReturn, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-misspelled-lifecycle-methods', noMisspelledLifecycleMethods, {
    category: 'correctness',
    recommended: 'error',
  }),
  defineRule('no-multi-comp', noMultiComp),
  defineRule('no-namespace', noNamespace, { category: 'correctness', recommended: 'error' }),
  defineRule('no-object-type-as-default-prop', noObjectTypeAsDefaultProp),
  defineRule('no-prop-types', noPropTypes, { category: 'correctness', recommended: 'error' }),
  defineRule('no-redundant-should-component-update', noRedundantShouldComponentUpdate, { category: 'performance' }),
  defineRule('no-render-return-undefined', noRenderReturnUndefined, { category: 'correctness' }),
  defineRule('no-set-state', noSetState),
  defineRule('no-string-refs', noStringRefs, { category: 'correctness', recommended: 'error' }),
  defineRule('no-this-in-sfc', noThisInSfc),
  defineRule('no-unescaped-entities', noUnescapedEntities),
  defineRule('no-unknown-property', noUnknownProperty, { category: 'correctness', recommended: 'error' }),
  defineRule('no-unsafe', noUnsafe, { category: 'correctness' }),
  defineRule('no-unused-class-component-methods', noUnusedClassComponentMethods),
  defineRule('no-unused-prop-types', noUnusedPropTypes),
  defineRule('no-unused-state', noUnusedState),
  defineRule('no-will-update-set-state', noWillUpdateSetState, { category: 'correctness' }),
  defineRule('prefer-read-only-props', preferReadOnlyProps),
  defineRule('prefer-stateless-function', preferStatelessFunction),
  defineRule('prefer-use-state-lazy-initialization', preferUseStateLazyInitialization, {
    category: 'performance',
    recommended: 'warn',
  }),
  defineRule('self-closing-comp', selfClosingComp),
  defineRule('sort-comp', sortComp),
  defineRule('sort-default-props', sortDefaultProps),
  defineRule('state-in-constructor', stateInConstructor),
  defineRule('static-property-placement', staticPropertyPlacement),
  defineRule('style-prop-object', stylePropObject),
  defineRule('void-dom-elements-no-children', voidDomElementsNoChildren, {
    category: 'correctness',
    recommended: 'error',
  }),
]);

export default ruleRegistry;
export { ruleRegistry as 'module.exports' };
