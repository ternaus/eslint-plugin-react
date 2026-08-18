import { readFile } from 'node:fs/promises';

const [citation, readme] = await Promise.all([readFile('CITATION.cff', 'utf8'), readFile('README.md', 'utf8')]);
const issues = [];

if (!citation.startsWith('cff-version: 1.2.0\n')) {
  issues.push('CITATION.cff must use CFF 1.2.0.');
}
if (/^version:/m.test(citation)) {
  issues.push('CITATION.cff must not pin a package version.');
}
if (readme.includes('version = {')) {
  issues.push('README citation must not pin a package version.');
}

if (issues.length > 0) {
  throw new Error(`Citation check failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
}

console.log('Citation check passed.');
