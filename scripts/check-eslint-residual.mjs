import { ESLint } from 'eslint';

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' });
const files = [
  'index.js',
  'lib/rules/no-invalid-html-attribute.js',
  'lib/util/reactImports.js',
  'tests/index.js',
  'scripts/check-eslint-residual.mjs',
];
const RESIDUAL_ESLINT_RULES = new Set([
  'eslint-plugin/require-meta-docs-url',
  'eslint-plugin/require-meta-schema',
  'n/hashbang',
  'n/no-deprecated-api',
  'n/no-exports-assign',
  'n/no-extraneous-import',
  'n/no-extraneous-require',
  'n/no-missing-import',
  'n/no-missing-require',
  'n/no-process-exit',
  'n/no-unpublished-import',
  'n/no-unpublished-require',
  'n/no-unsupported-features/es-builtins',
  'n/no-unsupported-features/es-syntax',
  'n/no-unsupported-features/node-builtins',
  'n/process-exit-as-throw',
  'no-warning-comments',
  'preserve-caught-error',
]);
const issues = [];

function getPluginName(rule) {
  const separator = rule.startsWith('@') ? rule.indexOf('/', 1) : rule.indexOf('/');
  return rule.slice(0, separator);
}

for (const file of files) {
  const config = await eslint.calculateConfigForFile(file);
  const enabledPlugins = new Set(Object.keys(config.plugins ?? {}).filter((name) => name !== '@'));
  const usedPlugins = new Set();

  for (const [rule, setting] of Object.entries(config.rules ?? {})) {
    const severity = Array.isArray(setting) ? setting[0] : setting;
    if (severity !== 0 && severity !== 'off' && !RESIDUAL_ESLINT_RULES.has(rule)) {
      issues.push(`${file}: ESLint rule ${rule} is not a documented residual check`);
    }
    if (severity === 'warn' || severity === 'warning' || severity === 1) {
      issues.push(`${file}: ESLint rule ${rule} uses warning severity`);
    }
    if (severity !== 0 && severity !== 'off' && rule.includes('/')) {
      const plugin = getPluginName(rule);
      usedPlugins.add(plugin);
      if (!enabledPlugins.has(plugin)) {
        issues.push(`${file}: ESLint rule ${rule} has no registered plugin`);
      }
    }
  }

  for (const plugin of enabledPlugins) {
    if (!usedPlugins.has(plugin)) {
      issues.push(`${file}: ESLint plugin ${plugin} has no residual rule`);
    }
  }
}

if (issues.length > 0) {
  throw new Error(`Residual ESLint check failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
}

console.log('Residual ESLint check passed.');
