import plugin from '../index.js';

export const README_PATH = 'README.md';
export const CATALOG_PATH = 'docs/rules/README.md';
export const SUMMARY_START = '<!-- rule-config-summary:start -->';
export const SUMMARY_END = '<!-- rule-config-summary:end -->';

function isEnabled(setting) {
  if (setting === undefined) {
    return false;
  }
  const severity = Array.isArray(setting) ? setting[0] : setting;
  return severity !== 0 && severity !== 'off';
}

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
  const recommendedRules = plugin.configs.flat.recommended.rules;
  const allRules = plugin.configs.flat.all.rules;

  return Object.entries(plugin.rules)
    .map(([name, rule]) => ({
      all: isEnabled(allRules[`react/${name}`]),
      deprecated: Boolean(rule.meta.deprecated),
      description: rule.meta.docs.description,
      fixSupport: formatFixSupport(rule),
      name,
      recommended: isEnabled(recommendedRules[`react/${name}`]),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function renderConfigSummary(rows = getRuleRows()) {
  const recommendedCount = rows.filter((row) => row.recommended).length;
  const allCount = rows.filter((row) => row.all).length;
  const jsxRuntimeCount = Object.keys(plugin.configs.flat['jsx-runtime'].rules).length;

  return [
    '| Config | Active rules | Use it when |',
    '| --- | ---: | --- |',
    `| \`recommended\` | ${recommendedCount} | You want the supported baseline for React correctness and established best practices. |`,
    `| \`all\` | ${allCount} | You want to audit every non-deprecated rule, then keep only the rules that fit your codebase. |`,
    `| \`jsx-runtime\` | ${jsxRuntimeCount} disabled | Your project uses the automatic JSX runtime, so importing \`React\` solely for JSX is unnecessary. |`,
  ].join('\n');
}

export function renderRuleCatalog(rows = getRuleRows()) {
  const activeCount = rows.filter((row) => !row.deprecated).length;
  const deprecatedCount = rows.filter((row) => row.deprecated).length;

  const table = rows.map((row) => {
    const rule = `[\`react/${row.name}\`](${row.name}.md)`;
    const status = row.deprecated ? 'deprecated' : 'active';
    return `| ${rule} | ${escapeTableCell(row.description)} | ${row.recommended ? '✓' : '—'} | ${row.all ? '✓' : '—'} | ${row.fixSupport} | ${status} |`;
  });

  return [
    '# Rule catalog',
    '',
    'Start with the setup in the [repository README](../../README.md). Use this page when you need to choose an additional rule or inspect whether a rule can apply an automatic fix.',
    '',
    `The plugin exports ${activeCount} active rules and ${deprecatedCount} deprecated rules. The \`all\` preset enables every active rule as an error. Deprecated rules remain available for an explicit configuration but are not enabled by a preset.`,
    '',
    'A `--fix` entry means ESLint can apply that rule’s fix with `eslint --fix`. A `suggestion` entry means the rule can offer an editor suggestion; it is not changed by the normal automatic-fix pass.',
    '',
    '## Rules',
    '',
    '| Rule | What it reports | `recommended` | `all` | Fix support | Status |',
    '| --- | --- | :---: | :---: | --- | --- |',
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
