import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

import { BIOME_RULE_EXCEPTIONS } from './biome-exceptions.mjs';

const [biomeText, packageText] = await Promise.all([readFile('biome.jsonc', 'utf8'), readFile('package.json', 'utf8')]);
const biomeConfig = JSON.parse(biomeText);
const packageJson = JSON.parse(packageText);
const issues = [];

function disabledBiomeRules(config) {
  return Object.entries(config.linter?.rules ?? {})
    .flatMap(([group, rules]) => {
      if (group === 'preset' || typeof rules !== 'object' || rules === null) {
        return [];
      }
      return Object.entries(rules)
        .filter(([, setting]) => setting === 'off')
        .map(([rule]) => `${group}/${rule}`);
    })
    .sort((left, right) => left.localeCompare(right));
}

const biomeVersion = packageJson.devDependencies['@biomejs/biome'].replace(/^\^/, '');
if (biomeConfig.$schema !== `https://biomejs.dev/schemas/${biomeVersion}/schema.json`) {
  issues.push('Biome schema version must match the pinned @biomejs/biome version.');
}
if (biomeConfig.linter?.rules?.preset !== 'all') {
  issues.push('Biome linter.rules.preset must be "all".');
}
for (const domain of ['react', 'test']) {
  if (biomeConfig.linter?.domains?.[domain] !== 'all') {
    issues.push(`Biome domain ${domain} must be set to "all".`);
  }
}

const configuredExceptions = disabledBiomeRules(biomeConfig);
const registeredExceptions = BIOME_RULE_EXCEPTIONS.map(({ rule }) => rule).sort((left, right) =>
  left.localeCompare(right),
);
const duplicateExceptions = registeredExceptions.filter((rule, index) => registeredExceptions[index - 1] === rule);
const missingReasons = BIOME_RULE_EXCEPTIONS.filter(({ reason }) => !reason).map(({ rule }) => rule);
const unregistered = configuredExceptions.filter((rule) => !registeredExceptions.includes(rule));
const stale = registeredExceptions.filter((rule) => !configuredExceptions.includes(rule));

if (duplicateExceptions.length > 0) {
  issues.push(`Duplicate Biome exceptions: ${duplicateExceptions.join(', ')}.`);
}
if (missingReasons.length > 0) {
  issues.push(`Biome exceptions without reasons: ${missingReasons.join(', ')}.`);
}
if (unregistered.length > 0) {
  issues.push(`Unregistered disabled Biome rules: ${unregistered.join(', ')}.`);
}
if (stale.length > 0) {
  issues.push(`Stale Biome exceptions: ${stale.join(', ')}.`);
}

const trackedFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
})
  .split('\n')
  .filter((file) => file && existsSync(file) && /\.(?:[cm]?[jt]sx?)$/.test(file));
for (const file of trackedFiles) {
  const source = await readFile(file, 'utf8');
  for (const [index, line] of source.split('\n').entries()) {
    if (/^\s*(?:\/\/|\/\*|\{\/\*)\s*(?:biome-ignore|eslint-disable)/.test(line)) {
      issues.push(`${file}:${index + 1}: inline Biome or ESLint suppressions are forbidden.`);
    }
  }
}

if (issues.length > 0) {
  throw new Error(`Biome completeness check failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
}

console.log('Biome completeness check passed.');
