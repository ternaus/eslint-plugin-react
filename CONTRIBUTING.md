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

Every rule change needs a focused regression test. The suite runs each eligible
case with Espree, TypeScript-ESLint, and the current Babel parser. Do not add
parser-version exceptions: change the rule or test only when the current parser
contracts differ materially.

Keep the exported `react/*` namespace stable. New configuration must be flat
config, and new runtime files must be ESM with explicit `.js` import extensions.

## Quality ownership

Biome formats all supported files and enforces the lint rules it owns. Its
completeness check requires every disabled rule to have a reviewed reason.
ESLint enforces the residual Node.js, JavaScript, and ESLint-plugin authoring
rules. `scripts/check-eslint-residual.mjs` verifies that no rule is enforced by
both tools and that residual plugin registrations are real.

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
