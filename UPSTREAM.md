# Upstream provenance and independent maintenance

This standalone repository started from
[`jsx-eslint/eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react)
at commit [`c99d3b274efbc593e46563358e7b77cad8d01957`](https://github.com/jsx-eslint/eslint-plugin-react/commit/c99d3b274efbc593e46563358e7b77cad8d01957).
The complete upstream Git history and MIT license are retained. The repository
is no longer part of GitHub's fork network.

The project keeps the public `react/*` rules and focuses on an ESLint 10-only,
flat-config-only package. Its deliberate differences are native ESM source and
exports, a maintained Node.js matrix, current parser coverage, and a
Biome-plus-residual-ESLint quality boundary.

Changes in the original project are reference material, not an automatic
synchronization source. Before adopting a change, compare its public rule
behavior and tests, adapt it to the current architecture, and run
`yarn quality:complete`. Do not reintroduce legacy configuration, ESLint 9
compatibility, obsolete Node.js support, or retired tooling.
