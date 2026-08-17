import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'ternaus-eslint-plugin-react-'));
const archiveDirectory = join(temporaryDirectory, 'archive');
const packageDirectory = join(temporaryDirectory, 'package');
const consumerDirectory = join(temporaryDirectory, 'consumer');
const npmCache = join(temporaryDirectory, 'npm-cache');
const packageName = '@ternaus/eslint-plugin-react';
const runtimeDependencies = ['eslint', 'estraverse', 'jsx-ast-utils', 'minimatch', 'prop-types', 'resolve', 'semver'];

function run(command, arguments_, options = {}) {
  return execFileSync(command, arguments_, {
    cwd: consumerDirectory,
    encoding: 'utf8',
    stdio: 'pipe',
    ...options,
  });
}

try {
  await mkdir(archiveDirectory);
  const packed = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--json', '--ignore-scripts', '--cache', npmCache, '--pack-destination', archiveDirectory],
      {
        cwd: repository,
        encoding: 'utf8',
      },
    ),
  );
  const archive = join(archiveDirectory, packed[0].filename);

  await mkdir(packageDirectory);
  execFileSync('tar', ['-xzf', archive, '-C', packageDirectory]);

  await mkdir(join(packageDirectory, 'package', 'node_modules'));
  await Promise.all(
    runtimeDependencies.map((dependency) =>
      symlink(
        join(repository, 'node_modules', dependency),
        join(packageDirectory, 'package', 'node_modules', dependency),
        'dir',
      ),
    ),
  );
  await mkdir(join(consumerDirectory, 'node_modules', '@ternaus'), { recursive: true });
  await symlink(join(repository, 'node_modules', 'eslint'), join(consumerDirectory, 'node_modules', 'eslint'), 'dir');
  await symlink(
    join(packageDirectory, 'package'),
    join(consumerDirectory, 'node_modules', '@ternaus', 'eslint-plugin-react'),
    'dir',
  );

  await writeFile(join(consumerDirectory, 'package.json'), '{"type":"module"}\n');
  await writeFile(
    join(consumerDirectory, 'eslint.config.js'),
    `import { defineConfig } from 'eslint/config';
import react from '${packageName}';

export default defineConfig(
  {
    files: ['component.jsx'],
    plugins: { react },
    extends: ['react/flat/recommended', 'react/flat/jsx-runtime'],
    settings: { react: { version: '19.0' } },
  },
  {
    files: ['all.jsx'],
    plugins: { react },
    extends: ['react/flat/all'],
    settings: { react: { version: '19.0' } },
  },
);
`,
  );
  await writeFile(
    join(consumerDirectory, 'component.jsx'),
    'const Component = () => <div class="broken">text</div>;\n',
  );
  await writeFile(join(consumerDirectory, 'all.jsx'), 'const Component = () => <div class="broken">text</div>;\n');
  await writeFile(join(consumerDirectory, 'direct.jsx'), 'const Component = () => <div class="broken">text</div>;\n');
  await writeFile(
    join(consumerDirectory, 'eslint.direct.config.js'),
    `import react from '${packageName}';

export default [
  {
    files: ['direct.jsx'],
    ...react.configs.flat.recommended,
    settings: { react: { version: '19.0' } },
  },
];
`,
  );
  await writeFile(
    join(consumerDirectory, 'consumer.mjs'),
    `import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
import react from '${packageName}';
import recommended from '${packageName}/configs/recommended';

assert.equal(react.meta.name, '${packageName}');
assert.equal(recommended, react.configs.flat.recommended);
assert.equal(react.configs.flat.recommended.plugins.react, react);
assert.equal(react.configs['flat/all'], react.configs.flat.all);
assert.equal(react.configs['flat/jsx-runtime'], react.configs.flat['jsx-runtime']);
assert.equal(react.configs['flat/recommended'], react.configs.flat.recommended);

const eslint = new ESLint();
const results = await eslint.lintFiles(['component.jsx', 'all.jsx']);
for (const result of results) {
  const ruleIds = result.messages.map(({ ruleId }) => ruleId);
  assert.ok(ruleIds.includes('react/no-unknown-property'), JSON.stringify(result.messages));
}

const directEslint = new ESLint({ overrideConfigFile: 'eslint.direct.config.js' });
const [directResult] = await directEslint.lintFiles(['direct.jsx']);
assert.ok(
  directResult.messages.some(({ ruleId }) => ruleId === 'react/no-unknown-property'),
  JSON.stringify(directResult.messages),
);
`,
  );
  await writeFile(
    join(consumerDirectory, 'consumer.cjs'),
    `const assert = require('node:assert/strict');
const react = require('${packageName}');
const recommended = require('${packageName}/configs/recommended');

assert.equal(react.meta.name, '${packageName}');
assert.equal(recommended, react.configs.flat.recommended);
assert.equal(react.configs.flat.recommended.plugins.react, react);
assert.equal(react.configs['flat/recommended'], react.configs.flat.recommended);
`,
  );
  await writeFile(
    join(consumerDirectory, 'consumer.ts'),
    `import { defineConfig } from 'eslint/config';
import react from '${packageName}';
import recommended from '${packageName}/configs/recommended';

const configs = [react.configs.flat.recommended, recommended];
const aliases = [
  react.configs['flat/all'],
  react.configs['flat/jsx-runtime'],
  react.configs['flat/recommended'],
];
const config = defineConfig({
  files: ['**/*.jsx'],
  plugins: { react },
  extends: ['react/flat/recommended'],
});
void configs;
void aliases;
void config;
`,
  );
  run(process.execPath, ['consumer.mjs']);
  run(process.execPath, ['consumer.cjs']);
  run(process.execPath, [
    join(repository, 'node_modules', 'typescript', 'bin', 'tsc'),
    '--noEmit',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    '--target',
    'ES2024',
    '--strict',
    '--skipLibCheck',
    'consumer.ts',
  ]);

  const packageJson = JSON.parse(await readFile(join(packageDirectory, 'package', 'package.json'), 'utf8'));
  assert.equal(packageJson.name, packageName);
  assert.equal(packageJson.peerDependencies.eslint, '^10.0.0');
} finally {
  await rm(temporaryDirectory, { force: true, recursive: true });
}
