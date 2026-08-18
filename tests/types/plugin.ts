import plugin from '@ternaus/eslint-plugin-react';
import recommended from '@ternaus/eslint-plugin-react/configs/recommended';
import type { Linter } from 'eslint';

export const configs: readonly Linter.Config[] = [
  plugin.configs['flat/recommended'],
  plugin.configs.flat.recommended,
  recommended,
];

export const noInvalidHtmlAttributeRule = plugin.rules['no-invalid-html-attribute'];
export const preferUseStateLazyInitializationRule = plugin.rules['prefer-use-state-lazy-initialization'];
