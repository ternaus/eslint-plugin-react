# Why an upstream rule may be unavailable

The [rule catalog](rules/README.md) is the complete supported API of this
package. An upstream `jsx-eslint/eslint-plugin-react` rule ID that is absent
from that catalog is intentionally unsupported. Do not add it to an ESLint
configuration and expect a compatibility alias.

## Biome owns the check

This package removes a rule when the pinned Biome version provides the same
user-visible diagnostic. Run Biome with `rules.preset: "all"`; keeping both
implementations would make users review duplicate diagnostics and would split
maintenance of one behavior.

These upstream IDs were removed because Biome 2.5.8 owns the check:

| Upstream rule | Biome rule |
| --- | --- |
| `async-server-action` | `nursery/useReactAsyncServerFunction` |
| `button-has-type` | `a11y/useButtonType` |
| `iframe-missing-sandbox` | `nursery/useIframeSandbox` |
| `jsx-key` | `correctness/useJsxKeyInIterable` |
| `jsx-no-bind` | `performance/noJsxPropsBind` |
| `jsx-no-comment-textnodes` | `suspicious/noCommentText` |
| `jsx-no-duplicate-props` | `suspicious/noDuplicateJsxProps` |
| `jsx-no-leaked-render` | `suspicious/noLeakedRender` |
| `jsx-no-literals` | `style/noJsxLiterals` |
| `jsx-no-script-url` | `security/noScriptUrl` |
| `jsx-no-useless-fragment` | `complexity/noUselessFragments` |
| `no-array-index-key` | `suspicious/noArrayIndexKey` |
| `no-children-prop` | `correctness/noChildrenProp` |
| `no-danger` | `security/noDangerouslySetInnerHtml` |
| `no-danger-with-children` | `security/noDangerouslySetInnerHtmlWithChildren` |
| `no-namespace` | `nursery/noJsxNamespace` |
| `no-string-refs` | `nursery/noReactStringRefs` |
| `no-unknown-property` | `suspicious/noUnknownAttribute` |
| `self-closing-comp` | `style/useSelfClosingElements` |
| `void-dom-elements-no-children` | `correctness/noVoidElementsWithChildren` |

Matching names are not enough to remove or add a rule. For example,
`suspicious/noUnknownAttribute` detects unknown JSX attribute names, while
`react/no-invalid-html-attribute` also checks whether a known HTML attribute
and its literal value are valid for a specific DOM element. The latter remains
in this package because the contracts differ.

## The rule is outside the React 19 contract

This package keeps direct React 19 behavior checks. It does not enforce a
team's component style, file structure, naming, prop-spreading policy, or
security policy. Rules such as `display-name`, `function-component-definition`,
`jsx-sort-props`, `no-multi-comp`, `no-set-state`, and `prefer-stateless-function`
therefore do not belong to this package. Configure an equivalent Biome check or
your project directly when one of those conventions matters.

It also avoids broad heuristics whose result depends on whole-program,
type-aware, or project-specific evidence. `no-unused-prop-types`,
`no-unused-state`, and `no-unused-class-component-methods` are examples. A
React 19 version constraint alone cannot make those reports reliable.

## The source is outside the supported boundary

The package supports ESLint 10 flat config, React 19+, and native ESM source.
It has no classic-config, React 18, parser-workaround, or React Native-specific
rule surface. A rule that exists only to support one of those boundaries is not
part of this API.

## Proposing a missing rule

Before proposing an upstream rule, establish all three facts:

1. The rule protects a concrete React 19+ behavior rather than a project convention.
2. The pinned Biome version does not already provide the same behavior and fix policy.
3. ESLint 10 can prove the diagnostic with a bounded false-positive policy.

If the rule passes those checks, add its focused tests, a rule page, registry
entry, and generated catalog entry in the same change. Otherwise, configure
Biome or the project directly instead of expanding this package.
