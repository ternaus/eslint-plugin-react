import { readFile } from 'node:fs/promises';

import {
  CATALOG_PATH,
  README_PATH,
  renderConfigSummary,
  renderRuleCatalog,
  replaceGeneratedSection,
} from './rule-documentation.mjs';

const [readme, catalog] = await Promise.all([readFile(README_PATH, 'utf8'), readFile(CATALOG_PATH, 'utf8')]);
const expectedReadme = replaceGeneratedSection(readme, renderConfigSummary());
const expectedCatalog = `${renderRuleCatalog()}\n`;
const issues = [];

if (readme !== expectedReadme) {
  issues.push(`${README_PATH} has an outdated generated rule-config summary. Run yarn docs:rules.`);
}
if (catalog !== expectedCatalog) {
  issues.push(`${CATALOG_PATH} is out of date. Run yarn docs:rules.`);
}

if (issues.length > 0) {
  throw new Error(`Rule documentation check failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
}

console.log('Rule documentation check passed.');
