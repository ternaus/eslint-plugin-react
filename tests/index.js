'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');
const index = require('../lib/rules');
const ruleRegistry = require('../lib/rule-registry');

const ruleFiles = fs
  .readdirSync(path.resolve(__dirname, '../lib/rules/'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => path.basename(f, '.js'))
  .filter((f) => f !== 'index');

describe('all rule files should be exported by the plugin', () => {
  ruleFiles.forEach((ruleName) => {
    it(`should export ${ruleName}`, () => {
      assert.equal(plugin.rules[ruleName], require(path.join('../lib/rules', ruleName)));
    });

    it(`should export ${ruleName} from lib/rules/index`, () => {
      assert.equal(plugin.rules[ruleName], index[ruleName]);
    });
  });
});

describe('legacy rule inventory', () => {
  it('does not export a deprecated rule inventory or deprecated implementations', () => {
    assert.equal('deprecatedRules' in plugin, false);
    ruleFiles.forEach((ruleName) => {
      assert.notEqual(plugin.rules[ruleName].meta.deprecated, true, `${ruleName} must not be deprecated`);
    });
  });

  it('does not retain React version detection', () => {
    assert.equal(fs.existsSync(path.resolve(__dirname, '../lib/util/version.js')), false);
  });
});

describe('removed rules', () => {
  const removedRuleNames = [
    'default-props-match-prop-types',
    'checked-requires-onchange-or-readonly',
    'forbid-foreign-prop-types',
    'forbid-prop-types',
    'forward-ref-uses-ref',
    'jsx-no-target-blank',
    'jsx-no-undef',
    'jsx-sort-default-props',
    'jsx-uses-react',
    'jsx-uses-vars',
    'jsx-child-element-spacing',
    'jsx-closing-bracket-location',
    'jsx-closing-tag-location',
    'jsx-curly-newline',
    'jsx-curly-spacing',
    'jsx-equals-spacing',
    'jsx-first-prop-new-line',
    'jsx-indent',
    'jsx-indent-props',
    'jsx-max-props-per-line',
    'jsx-newline',
    'jsx-one-expression-per-line',
    'jsx-props-no-multi-spaces',
    'jsx-space-before-closing',
    'jsx-tag-spacing',
    'jsx-wrap-multilines',
    'no-find-dom-node',
    'no-is-mounted',
    'no-render-return-value',
    'no-typos',
    'no-unstable-nested-components',
    'prefer-exact-props',
    'prefer-es6-class',
    'prop-types',
    'require-default-props',
    'require-optimization',
    'require-render-return',
    'react-in-jsx-scope',
    'sort-prop-types',
  ];

  removedRuleNames.forEach((ruleName) => {
    it(`does not export ${ruleName}`, () => {
      assert.equal(plugin.rules[ruleName], undefined);
      assert.equal(index[ruleName], undefined);
    });
  });
});

describe('rule registry', () => {
  it('is the complete source of exported rules and preset severities', () => {
    assert.strictEqual(ruleRegistry.length, 73);
    assert.deepStrictEqual(new Set(ruleRegistry.map(({ name }) => name)), new Set(Object.keys(plugin.rules)));

    ruleRegistry.forEach(
      ({ category, documentationPath, implementation, name, recommended, requiresTypeInformation, testPath }) => {
        assert.strictEqual(plugin.rules[name], implementation);
        assert(['correctness', 'performance', 'policy', 'security'].includes(category));
        assert(['error', 'off', 'warn'].includes(recommended));
        assert.strictEqual(documentationPath, `docs/rules/${name}.md`);
        assert.ok(fs.existsSync(path.resolve(documentationPath)), `${name} must have documentation`);
        assert.strictEqual(requiresTypeInformation, false);
        assert.strictEqual(testPath, `tests/lib/rules/${name}.js`);
        assert.ok(fs.existsSync(path.resolve(testPath)), `${name} must have tests`);
      },
    );
  });

  it('generates the React 19 recommended baseline', () => {
    assert.deepStrictEqual(plugin.configs.flat.recommended.rules, {
      'react/async-server-action': 'error',
      'react/button-has-type': 'error',
      'react/controlled-form-requires-handler': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-key-after-spread': 'error',
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-constructed-context-values': 'warn',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-script-url': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-function-default-props': 'error',
      'react/no-implicit-ref-callback-return': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-misspelled-lifecycle-methods': 'error',
      'react/no-namespace': 'error',
      'react/no-prop-types': 'error',
      'react/no-string-refs': 'error',
      'react/no-unknown-property': 'error',
      'react/prefer-use-state-lazy-initialization': 'warn',
      'react/void-dom-elements-no-children': 'error',
    });
  });
});

describe('configurations', () => {
  it('should export ESLint flat config aliases', () => {
    ['all', 'recommended', 'jsx-runtime'].forEach((configName) => {
      assert.equal(plugin.configs[`flat/${configName}`], plugin.configs.flat[configName]);
    });
  });

  it('should export a ‘recommended’ configuration', () => {
    const configName = 'recommended';
    const config = plugin.configs.flat[configName];
    assert(config);

    Object.keys(config.rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      const subRuleName = ruleName.slice('react/'.length);
      assert(plugin.rules[subRuleName]);
    });
  });

  it('should export an ‘all’ configuration', () => {
    const configName = 'all';
    const config = plugin.configs.flat[configName];
    assert(config);

    Object.keys(config.rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      assert.equal(config.rules[ruleName], 'error');
    });

    ruleFiles.forEach((ruleName) => {
      const inConfig = typeof config.rules[`react/${ruleName}`] !== 'undefined';
      assert(inConfig);
    });
  });

  it('should export a ‘jsx-runtime’ configuration', () => {
    const configName = 'jsx-runtime';
    const config = plugin.configs.flat[configName];
    assert(config);
    assert.deepEqual(config.rules, {});
  });
});
