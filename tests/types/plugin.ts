import plugin from '@ternaus/eslint-plugin-react';
import all from '@ternaus/eslint-plugin-react/configs/all';
import jsxRuntime from '@ternaus/eslint-plugin-react/configs/jsx-runtime';
import recommended from '@ternaus/eslint-plugin-react/configs/recommended';
import type { Linter } from 'eslint';

export const configs: readonly Linter.Config[] = [
  plugin.configs['flat/all'],
  plugin.configs['flat/jsx-runtime'],
  plugin.configs['flat/recommended'],
  plugin.configs.flat.all,
  plugin.configs.flat['jsx-runtime'],
  plugin.configs.flat.recommended,
  all,
  jsxRuntime,
  recommended,
];

export const jsxKeyRule = plugin.rules['jsx-key'];
