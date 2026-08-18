# Contributing

This repository supports ESLint 10 on Node.js 22.13, 24, and 26. It uses native
ES modules and flat configuration exclusively.

## Local setup

```sh
corepack enable
yarn install --immutable
yarn quality:complete
```

Use Node.js 22.13 for the complete quality suite. The CI also runs the product
tests on Node.js 24 and 26.

## Change rules safely

Rule implementations live in `lib/rules`; their tests live in the matching
`tests/lib/rules` path. Update a rule’s reference page in `docs/rules` whenever
its public behavior, options, or recommendation status changes. Run
`yarn docs:rules` whenever rule metadata or a preset changes. It rebuilds the
README preset summary and the full rule catalog; the quality gate rejects stale
generated documentation.

Every rule change needs a focused regression test. Use current ESLint parser
syntax and do not add parser-version exceptions or alternate-parser harnesses.

Keep the exported `react/*` namespace stable. New configuration must be flat
config, and new runtime files must be ESM with explicit `.js` import extensions.
Before adding or changing a rule, compare its complete contract with the pinned
Biome version. If Biome owns that check, remove the local rule instead of
maintaining two versions. Keep the README and rule catalog limited to the
current package contract. Explain an intentionally unsupported upstream rule
through the categories in `docs/upstream-rule-support.md` rather than adding a
compatibility alias.

## Quality ownership

Biome formats all supported files and enforces its JavaScript, JSX, DOM, and
React rules. Its completeness check requires every disabled rule to have a
reviewed reason. ESLint enforces residual Node.js and ESLint-plugin authoring
rules. `scripts/check-eslint-residual.mjs` verifies that the residual plugin
registrations are real.

Run these narrower checks while iterating:

```sh
yarn format:check
yarn lint
yarn typecheck
yarn test:coverage
yarn pack:check
```

`yarn quality:complete` is the required final check. It verifies the published
archive with `npm pack --dry-run` and `publint`, then loads the packed tarball
as ESM, CommonJS, and TypeScript. Do not bypass it before a release.

## Pull requests

Keep each pull request focused. Explain the user-visible rule or configuration
change, include the regression case that proves it, and state whether a rule
reference page changed. Do not reintroduce ESLint 9, `.eslintrc*`, CommonJS
source files, compatibility polyfills, or parser-version migration branches.
