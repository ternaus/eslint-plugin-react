import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'ternaus-eslint-plugin-react-pack-'));

try {
  execFileSync(
    'npm',
    ['pack', '--dry-run', '--json', '--ignore-scripts', '--cache', join(temporaryDirectory, 'npm-cache')],
    {
      cwd: repository,
      stdio: 'pipe',
    },
  );
  execFileSync(process.execPath, [join(repository, 'node_modules', 'publint', 'src', 'cli.js')], {
    cwd: repository,
    stdio: 'inherit',
  });
} finally {
  await rm(temporaryDirectory, { force: true, recursive: true });
}
