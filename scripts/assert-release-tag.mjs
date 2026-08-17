import { readFile } from 'node:fs/promises';

const tag = process.argv[2];
const packageJsonUrl = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8'));
const expectedTag = `v${packageJson.version}`;

if (tag !== expectedTag) {
  throw new Error(`Release tag must be ${expectedTag}; received ${tag ?? '(missing)'}.`);
}
