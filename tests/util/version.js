'use strict';

const path = require('path');
const assert = require('assert');
const sinon = require('sinon');
const versionUtil = require('../../lib/util/version');

describe('Version', () => {
  const base = path.resolve(__dirname, '..', 'fixtures', 'version');
  let expectedErrorArgs = [];

  beforeEach(() => {
    sinon.stub(console, 'error');
    expectedErrorArgs = [];
    versionUtil.resetWarningFlag();
    versionUtil.resetDetectedVersion();
    versionUtil.resetDefaultVersion();
  });

  afterEach(() => {
    const actualArgs = console.error.args;
    console.error.restore();
    assert.deepEqual(actualArgs, expectedErrorArgs);
  });

  describe('Detect version', () => {
    const context = {
      settings: { react: { version: 'detect', flowVersion: 'detect' } },
      filename: path.resolve(base, 'test.js'),
    };

    it('matches detected version', () => {
      context.filename = path.resolve(base, 'detect-version', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '>= 19.2.7'), true);
      assert.equal(versionUtil.testReactVersion(context, '>= 19.2.8'), false);
      assert.equal(versionUtil.testFlowVersion(context, '>= 0.92.0'), true);
    });

    it('matches detected version in sibling project', () => {
      context.filename = path.resolve(base, 'detect-version-sibling', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.1'), false);
      assert.equal(versionUtil.testFlowVersion(context, '>= 2.92.0'), true);
    });

    it('matches detected version in child project', () => {
      context.filename = path.resolve(base, 'detect-version', 'detect-version-child', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '>= 20.1.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '>= 20.1.1'), false);
      assert.equal(versionUtil.testFlowVersion(context, '>= 3.92.0'), true);
    });

    it('assumes latest version if react is not installed', () => {
      context.filename = path.resolve(base, 'detect-version-missing', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.',
        ],
      ];
    });

    it('uses default version from settings if provided and react is not installed', () => {
      context.settings.react.defaultVersion = '19.0.0';
      context.filename = path.resolve(base, 'detect-version-missing', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '19.0.0'), true);

      expectedErrorArgs = [
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming default React version for linting: "19.0.0".',
        ],
      ];

      delete context.settings.react.defaultVersion;
    });

    it('fails nicely with an invalid default version of react', () => {
      context.settings.react.defaultVersion = 'not semver';
      context.filename = path.resolve(base, 'detect-version-missing', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        [
          'Warning: React version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “not semver”. Falling back to latest version as default.',
        ],
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.',
        ],
      ];

      delete context.settings.react.defaultVersion;
    });

    it('warns only once for failure to detect react ', () => {
      context.filename = path.resolve(base, 'detect-version-missing', 'test.js');

      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);
      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        [
          'Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.',
        ],
      ];
    });

    it('assumes latest version if flow-bin is not installed', () => {
      assert.equal(versionUtil.testFlowVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        [
          'Warning: Flow version was set to "detect" in eslint-plugin-react settings, but the "flow-bin" package is not installed. Assuming latest Flow version for linting.',
        ],
      ];
    });

    it('works with virtual filename', () => {
      context.filename = path.resolve(base, 'detect-version-sibling', 'test.js/0_fake.js');

      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.1'), false);
      assert.equal(versionUtil.testFlowVersion(context, '>= 2.92.0'), true);
    });

    it('works with recursive virtual filename', () => {
      context.filename = path.resolve(base, 'detect-version-sibling', 'test.js/0_fake.md/1_fake.js');

      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.1'), false);
      assert.equal(versionUtil.testFlowVersion(context, '>= 2.92.0'), true);
    });
  });

  describe('string version', () => {
    const context = { settings: { react: { version: '19.0', flowVersion: '1.2' } } };
    const unsupportedContext = { settings: { react: { version: '18.3.1', flowVersion: '1.2' } } };
    const invalidContext = { settings: { react: { version: 'latest', flowVersion: 'not semver' } } };

    it('works with react', () => {
      assert.equal(versionUtil.testReactVersion(context, '>= 19.0.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.0'), false);
    });

    it('rejects an unsupported configured React version', () => {
      assert.throws(
        () => versionUtil.testReactVersion(unsupportedContext, '>= 19.0.0'),
        /React 18\.3\.1 is unsupported\. @ternaus\/eslint-plugin-react requires React 19\.0\.0 or newer\./u,
      );
    });

    it('works with flow', () => {
      assert.equal(versionUtil.testFlowVersion(context, '>= 1.1.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '>= 1.2.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '>= 1.3.0'), false);
    });

    it('fails nicely with an invalid react version', () => {
      assert.equal(versionUtil.testReactVersion(invalidContext, '>= 19.0'), true);
      expectedErrorArgs = [
        [
          'Warning: React version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “latest”',
        ],
      ];
    });

    it('fails nicely with an invalid flow version', () => {
      assert.equal(versionUtil.testFlowVersion(invalidContext, '>= 1.0'), true);
      expectedErrorArgs = [
        [
          'Warning: Flow version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “not semver”',
        ],
      ];
    });
  });

  describe('non-string version', () => {
    const context = { settings: { react: { version: 19.0, flowVersion: 1.2 } } };

    it('works with react', () => {
      assert.equal(versionUtil.testReactVersion(context, '>= 19.0.0'), true, '>= 19.0.0');
      assert.equal(versionUtil.testReactVersion(context, '>= 20.0.0'), false, '>= 20.0.0');

      expectedErrorArgs = [
        ['Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”'],
      ];
    });

    it('works with flow', () => {
      assert.equal(versionUtil.testFlowVersion(context, '>= 1.1.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '>= 1.2.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '>= 1.3.0'), false);

      expectedErrorArgs = [
        ['Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”'],
      ];
    });
  });

  it('rejects an unsupported detected React version', () => {
    const context = {
      settings: { react: { version: 'detect' } },
      filename: path.resolve(base, 'detect-version-unsupported', 'test.js'),
    };

    assert.throws(
      () => versionUtil.testReactVersion(context, '>= 19.0.0'),
      /React 18\.3\.1 is unsupported\. @ternaus\/eslint-plugin-react requires React 19\.0\.0 or newer\./u,
    );
  });
});
