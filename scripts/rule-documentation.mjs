import ruleRegistry from '../lib/rule-registry.js';

export const README_PATH = 'README.md';
export const CATALOG_PATH = 'docs/rules/README.md';
export const SUMMARY_START = '<!-- rule-config-summary:start -->';
export const SUMMARY_END = '<!-- rule-config-summary:end -->';

function escapeTableCell(value) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function formatFixSupport(rule) {
  const capabilities = [];
  if (rule.meta.fixable) {
    capabilities.push('`--fix`');
  }
  if (rule.meta.hasSuggestions) {
    capabilities.push('suggestion');
  }
  return capabilities.join(', ') || '—';
}

export function getRuleRows() {
  return ruleRegistry
    .map(({ category, implementation, name, recommended, requiresTypeInformation }) => ({
      category,
      description: implementation.meta.docs.description,
      fixSupport: formatFixSupport(implementation),
      name,
      recommended,
      requiresTypeInformation,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function renderConfigSummary(rows = getRuleRows()) {
  const recommendedCount = rows.filter((row) => row.recommended !== 'off').length;
  return [
    '| Config | Active rules | Use it when |',
    '| --- | ---: | --- |',
    `| \`recommended\` | ${recommendedCount} | You want the supported baseline of React 19 contracts that Biome does not provide. |`,
  ].join('\n');
}

export function renderRuleCatalog(rows = getRuleRows()) {
  const activeCount = rows.length;

  const table = rows.map((row) => {
    const rule = `[\`react/${row.name}\`](${row.name}.md)`;
    return `| ${rule} | ${escapeTableCell(row.description)} | ${row.recommended} | ${row.category} | ${row.fixSupport} | ${row.requiresTypeInformation ? 'yes' : 'no'} |`;
  });

  return [
    '# Rule catalog',
    '',
    'Start with the setup in the [repository README](../../README.md). Use this page when you need to choose an additional rule or inspect whether a rule can apply an automatic fix.',
    '',
    `The plugin exports ${activeCount} active rules, all included in \`recommended\`.`,
    '',
    'A `--fix` entry means ESLint can apply that rule’s fix with `eslint --fix`. A `suggestion` entry means the rule can offer an editor suggestion; it is not changed by the normal automatic-fix pass.',
    '',
    '## Rules',
    '',
    '| Rule | What it reports | `recommended` | Category | Fix support | Type info |',
    '| --- | --- | :---: | --- | --- | :---: |',
    ...table,
  ].join('\n');
}

export function replaceGeneratedSection(source, content) {
  const start = source.indexOf(SUMMARY_START);
  const end = source.indexOf(SUMMARY_END);
  if (start === -1 || end === -1 || start >= end) {
    throw new Error(`Missing generated rule-summary markers in ${README_PATH}.`);
  }

  const contentStart = start + SUMMARY_START.length;
  return `${source.slice(0, contentStart)}\n${content}\n${source.slice(end)}`;
}
