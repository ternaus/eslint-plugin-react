import { readFile } from 'node:fs/promises';

const [citation, packageText, readme] = await Promise.all([
  readFile('CITATION.cff', 'utf8'),
  readFile('package.json', 'utf8'),
  readFile('README.md', 'utf8'),
]);
const packageJson = JSON.parse(packageText);
const expectedVersion = packageJson.version;
const version = citation.match(/^version: (.+)$/m)?.[1];
const issues = [];

if (!citation.startsWith('cff-version: 1.2.0\n')) {
  issues.push('CITATION.cff must use CFF 1.2.0.');
}
if (version !== expectedVersion) {
  issues.push(`CITATION.cff version must match package.json (${expectedVersion}).`);
}
if (!readme.includes(`version = {${expectedVersion}}`)) {
  issues.push(`README citation must use the package version (${expectedVersion}).`);
}

if (issues.length > 0) {
  throw new Error(`Citation check failed:\n${issues.map((issue) => `- ${issue}`).join('\n')}`);
}

console.log('Citation check passed.');
