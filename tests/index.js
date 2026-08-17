'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const plugin = require('..');
const index = require('../lib/rules');

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

describe('deprecated rules', () => {
  it('marks all deprecated rules as deprecated', () => {
    ruleFiles.forEach((ruleName) => {
      const inDeprecatedRules = !!plugin.deprecatedRules[ruleName];
      const isDeprecated = plugin.rules[ruleName].meta.deprecated;
      if (inDeprecatedRules) {
        assert(isDeprecated, `${ruleName} metadata should mark it as deprecated`);
      } else {
        assert(!isDeprecated, `${ruleName} metadata should not mark it as deprecated`);
      }
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
      const inDeprecatedRules = !!plugin.deprecatedRules[ruleName];
      const inConfig = typeof config.rules[`react/${ruleName}`] !== 'undefined';
      assert(inDeprecatedRules ^ inConfig);
    });
  });

  it('should export a ‘jsx-runtime’ configuration', () => {
    const configName = 'jsx-runtime';
    const config = plugin.configs.flat[configName];
    assert(config);

    Object.keys(config.rules).forEach((ruleName) => {
      assert.ok(ruleName.startsWith('react/'));
      assert.equal(config.rules[ruleName], 'off');

      assert(['react/jsx-uses-react', 'react/react-in-jsx-scope'].includes(ruleName));
    });
  });
});
