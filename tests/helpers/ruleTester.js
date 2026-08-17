'use strict';

const { RuleTester: ESLintRuleTester } = require('eslint');

// `item` can be a config passed to the constructor, or a test case object/string
function convertToFlat(item, plugins) {
  if (typeof item === 'string') {
    return item;
  }

  if (typeof item !== 'object' || item === null) {
    throw new TypeError('Invalid value for "item" option. Expected an object or a string.');
  }

  const newItem = Object.assign({}, item, { languageOptions: {} });

  if (newItem.parserOptions) {
    newItem.languageOptions.parserOptions = newItem.parserOptions;

    if (newItem.parserOptions.ecmaVersion) {
      newItem.languageOptions.ecmaVersion = newItem.parserOptions.ecmaVersion;
    }

    if (newItem.parserOptions.sourceType) {
      newItem.languageOptions.sourceType = newItem.parserOptions.sourceType;
    }

    delete newItem.parserOptions;
  }

  if (newItem.parser) {
    newItem.languageOptions.parser = newItem.parser;
    delete newItem.parser;
  }

  if (newItem.globals) {
    newItem.languageOptions.globals = Object.fromEntries(
      Object.entries(newItem.globals).map(([name, value]) => [
        name,
        value === true ? 'writable' : value === false ? 'readonly' : value,
      ]),
    );
    delete newItem.globals;
  }

  if (plugins) {
    newItem.plugins = plugins;
  }

  return newItem;
}

function normalizeExpectedErrors(test) {
  if (!test || typeof test !== 'object' || !Array.isArray(test.errors)) {
    return test;
  }
  return Object.assign({}, test, {
    errors: test.errors.map((err) => {
      if (!err || typeof err !== 'object' || !('type' in err)) {
        return err;
      }
      const next = Object.assign({}, err);
      delete next.type;
      return next;
    }),
  });
}

function normalizeValidTest(test) {
  if (!test || typeof test !== 'object') {
    return test;
  }
  const { errors, output, ...validTest } = test;
  return validTest;
}

const PLUGINS = Symbol('eslint-plugin-react plugins');
const RULE_DEFINER = Symbol.for('react.RuleTester.RuleDefiner');

class RuleTester extends ESLintRuleTester {
  constructor(config) {
    if ((typeof config !== 'object' && typeof config !== 'undefined') || config === null) {
      throw new TypeError('Invalid value for "config" option. Expected an object or undefined.');
    }

    const newConfig = convertToFlat(config || {});

    if (!newConfig.languageOptions.ecmaVersion) {
      newConfig.languageOptions.ecmaVersion = 2022;
    }

    if (!newConfig.languageOptions.sourceType) {
      newConfig.languageOptions.sourceType = 'module';
    }

    super(newConfig);

    this[RULE_DEFINER] = {
      defineRule: (ruleId, rule) => {
        if (!this[PLUGINS]) {
          this[PLUGINS] = {};
        }

        const ruleIdSplit = ruleId.split('/');

        if (ruleIdSplit.length !== 2) {
          throw new Error('ruleId should be in the format: plugin-name/rule-name');
        }

        const pluginName = ruleIdSplit[0];
        const ruleName = ruleIdSplit[1];

        if (!this[PLUGINS][pluginName]) {
          this[PLUGINS][pluginName] = { rules: {} };
        }

        this[PLUGINS][pluginName].rules[ruleName] = rule;
      },
    };
  }

  run(ruleName, rule, tests) {
    const newTests = {
      valid: tests.valid.map(normalizeValidTest).map((test) => convertToFlat(test, this[PLUGINS])),
      invalid: tests.invalid.map(normalizeExpectedErrors).map((test) => convertToFlat(test, this[PLUGINS])),
    };

    super.run(ruleName, rule, newTests);
  }
}

module.exports = RuleTester;
