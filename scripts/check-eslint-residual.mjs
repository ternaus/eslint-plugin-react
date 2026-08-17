import { ESLint } from 'eslint';

import { BIOME_OWNED_ESLINT_RULES } from './rule-ownership.mjs';

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' });
const files = [
  'index.js',
  'lib/rules/display-name.js',
  'lib/util/eslint.js',
  'tests/index.js',
  'scripts/rule-ownership.mjs',
];
const ownedRules = new Set(BIOME_OWNED_ESLINT_RULES);
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
    if (ownedRules.has(rule) && severity !== 0 && severity !== 'off') {
      issues.push(`${file}: Biome-owned ESLint rule ${rule} is enabled`);
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
