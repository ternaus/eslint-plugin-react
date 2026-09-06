'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Linter } = require('eslint');

const plugin = require('..');
const index = require('../lib/rules');
const ruleRegistry = require('../lib/rule-registry');
const upstreamRuleSupportPath = path.resolve(__dirname, '../docs/upstream-rule-support.md');
const readmePath = path.resolve(__dirname, '../README.md');
const ruleCatalogPath = path.resolve(__dirname, '../docs/rules/README.md');

const ACTIVE_RULE_NAMES = [
  'context-provider-requires-value',
  'controlled-form-requires-handler',
  'jsx-no-constructed-context-values',
  'jsx-no-key-after-spread',
  'no-deprecated',
  'no-direct-mutation-state',
  'no-function-default-props',
  'no-implicit-ref-callback-return',
  'no-invalid-form-action',
  'no-invalid-html-attribute',
  'no-invalid-title-children',
  'no-invalid-use-argument',
  'no-misspelled-lifecycle-methods',
  'no-prop-types',
  'no-uncached-use-promise',
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
      'react/context-provider-requires-value': 'error',
      'react/controlled-form-requires-handler': 'error',
      'react/jsx-no-key-after-spread': 'error',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-function-default-props': 'error',
      'react/no-implicit-ref-callback-return': 'error',
      'react/no-invalid-form-action': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-invalid-title-children': 'error',
      'react/no-invalid-use-argument': 'error',
      'react/no-misspelled-lifecycle-methods': 'error',
      'react/no-prop-types': 'error',
      'react/no-uncached-use-promise': 'error',
      'react/prefer-use-state-lazy-initialization': 'warn',
    });
  });

  it('allows ordinary named submitters but reports names overridden by function Actions', () => {
    const linter = new Linter();
    const config = [{ files: ['**/*.jsx'], ...plugin.configs.flat.recommended }];
    const valid = `
      import { createElement } from 'react';
      <button type="submit" name="operation" formAction="/save">Save</button>;
      createElement('button', { type: 'submit', name: 'operation' });
    `;
    assert.deepStrictEqual(linter.verify(valid, config, { filename: 'form.jsx' }), []);
    const messages = linter.verify(
      '<button type="submit" name="operation" formAction={async () => {}}>Save</button>;',
      config,
      { filename: 'form.jsx' },
    );
    assert.deepStrictEqual(
      messages.map(({ ruleId, messageId }) => ({ ruleId, messageId })),
      [{ ruleId: 'react/no-invalid-form-action', messageId: 'overridden' }],
    );
  });

  it('documents why absent upstream rules are unsupported', () => {
    assert.ok(fs.existsSync(upstreamRuleSupportPath));
    const upstreamRuleSupport = fs.readFileSync(upstreamRuleSupportPath, 'utf8');
    const readme = fs.readFileSync(readmePath, 'utf8');
    const ruleCatalog = fs.readFileSync(ruleCatalogPath, 'utf8');

    assert.match(upstreamRuleSupport, /The \[rule catalog\]\(rules\/README\.md\) is the complete supported API/u);
    assert.match(upstreamRuleSupport, /Biome owns the check/u);
    assert.match(upstreamRuleSupport, /outside the React 19 contract/u);
    assert.match(readme, /docs\/upstream-rule-support\.md/u);
    assert.match(ruleCatalog, /\.\.\/upstream-rule-support\.md/u);
  });
});

describe('configurations', () => {
  it('exposes recommended rules for transitive legacy-config consumers', () => {
    assert.deepStrictEqual(plugin.configs.recommended.rules, plugin.configs.flat.recommended.rules);
  });

  it('keeps the recommended flat config aliases', () => {
    assert.equal(plugin.configs['flat/recommended'], plugin.configs.flat.recommended);
    assert.deepStrictEqual(Object.keys(plugin.configs).sort(), ['flat', 'flat/recommended', 'recommended']);
    assert.deepStrictEqual(Object.keys(plugin.configs.flat), ['recommended']);
  });
});
