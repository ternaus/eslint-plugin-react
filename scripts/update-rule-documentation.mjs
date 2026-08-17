import { readFile, writeFile } from 'node:fs/promises';

import {
  CATALOG_PATH,
  README_PATH,
  renderConfigSummary,
  renderRuleCatalog,
  replaceGeneratedSection,
} from './rule-documentation.mjs';

const readme = await readFile(README_PATH, 'utf8');
const updatedReadme = replaceGeneratedSection(readme, renderConfigSummary());
const catalog = `${renderRuleCatalog()}\n`;

await Promise.all([writeFile(README_PATH, updatedReadme), writeFile(CATALOG_PATH, catalog)]);
console.log('Updated rule documentation.');
