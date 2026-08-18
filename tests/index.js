'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');
const index = require('../lib/rules');
const ruleRegistry = require('../lib/rule-registry');

const ACTIVE_RULE_NAMES = [
  'controlled-form-requires-handler',
  'jsx-no-constructed-context-values',
  'jsx-no-key-after-spread',
  'no-deprecated',
  'no-direct-mutation-state',
  'no-function-default-props',
  'no-implicit-ref-callback-return',
  'no-invalid-html-attribute',
  'no-misspelled-lifecycle-methods',
  'no-prop-types',
  'prefer-use-state-lazy-initialization',
];

const ruleFiles = fs
  .readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .filter((file) => file.endsWith('.js'))
  .map((file) => path.basename(file, '.js'))
  .filter((name) => name !== 'index')
  .sort();

describe('React 19 rule surface', () => {
  it('exports only the current React 19 rules', () => {
    assert.deepStrictEqual(ruleFiles, ACTIVE_RULE_NAMES);
    assert.deepStrictEqual(Object.keys(plugin.rules).sort(), ACTIVE_RULE_NAMES);
    assert.deepStrictEqual(Object.keys(index).sort(), ACTIVE_RULE_NAMES);
  });

  it('links every active rule to its implementation, documentation, and test', () => {
    assert.strictEqual(ruleRegistry.length, ACTIVE_RULE_NAMES.length);
    assert.deepStrictEqual(ruleRegistry.map(({ name }) => name).sort(), ACTIVE_RULE_NAMES);

    ruleRegistry.forEach(
      ({ documentationPath, implementation, name, recommended, requiresTypeInformation, testPath }) => {
        assert.strictEqual(plugin.rules[name], implementation);
        assert.strictEqual(implementation.meta.docs.recommended, true);
        assert.equal(recommended === 'error' || recommended === 'warn', true);
        assert.strictEqual(requiresTypeInformation, false);
        assert.ok(fs.existsSync(path.resolve(documentationPath)), `${name} must have documentation`);
        assert.ok(fs.existsSync(path.resolve(testPath)), `${name} must have tests`);
      },
    );
  });

  it('generates the React 19 baseline', () => {
    assert.deepStrictEqual(plugin.configs.flat.recommended.rules, {
      'react/controlled-form-requires-handler': 'error',
      'react/jsx-no-key-after-spread': 'error',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-function-default-props': 'error',
      'react/no-implicit-ref-callback-return': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-misspelled-lifecycle-methods': 'error',
      'react/no-prop-types': 'error',
      'react/prefer-use-state-lazy-initialization': 'warn',
    });
  });
});

describe('configurations', () => {
  it('exports only the recommended flat config', () => {
    assert.equal(plugin.configs['flat/recommended'], plugin.configs.flat.recommended);
    assert.deepStrictEqual(Object.keys(plugin.configs).sort(), ['flat', 'flat/recommended']);
    assert.deepStrictEqual(Object.keys(plugin.configs.flat), ['recommended']);
  });
});
