'use strict';

const { ESLint } = require('eslint');

const path = require('path');
const assert = require('assert');

describe('eslint-plugin-react in flat config', () => {
  const fixturesdDir = path.resolve(__dirname, 'fixtures', 'flat-config');

  it('should work when the plugin is used directly', () => {
    const eslint = new ESLint({
      cwd: path.resolve(fixturesdDir, 'plugin'),
    });

    return eslint.lintFiles(['test.jsx']).then((results) => {
      const result = results[0];

      assert.strictEqual(result.messages.length, 1);
      assert.strictEqual(result.messages[0].severity, 1);
      assert.strictEqual(result.messages[0].ruleId, 'react/no-invalid-html-attribute');
      assert.strictEqual(result.messages[0].messageId, 'invalidAttribute');
    });
  });

  ['root', 'deep'].forEach((configAccess) => {
    const overrideConfigFile = `eslint.config-${configAccess}.js`;

    it(`should work when the plugin is used with "recommended" config (${configAccess})`, () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, 'config-recommended'),
        overrideConfigFile,
      });

      return eslint.lintFiles(['test.jsx']).then((results) => {
        const result = results[0];

        assert.strictEqual(result.messages.length, 1);
        assert.strictEqual(result.messages[0].severity, 2);
        assert.strictEqual(result.messages[0].ruleId, 'react/no-invalid-html-attribute');
        assert.strictEqual(result.messages[0].messageId, 'invalidAttribute');
      });
    });

    // https://github.com/jsx-eslint/eslint-plugin-react/issues/3693
    it(`should work when the plugin is used directly and with "recommended" config (${configAccess})`, () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, 'plugin-and-config'),
        overrideConfigFile,
      });

      return eslint.lintFiles(['test.jsx']).then((results) => {
        const result = results[0];

        assert.strictEqual(result.messages.length, 1);
        assert.strictEqual(result.messages[0].severity, 2);
        assert.strictEqual(result.messages[0].ruleId, 'react/no-invalid-html-attribute');
        assert.strictEqual(result.messages[0].messageId, 'invalidAttribute');
      });
    });
  });
});
