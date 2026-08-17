/**
 * @fileoverview Utility functions for React and Flow version configuration
 * @author Yannick Croissant
 */

import fs from 'node:fs';
import path from 'node:path';

import resolve from 'resolve';
import * as semver from 'semver';
import error from './error.js';
import requiredModule0 from './eslint.js';

const getFilename = requiredModule0.getFilename;

const { sync: resolveSync } = resolve;

const ULTIMATE_LATEST_SEMVER = '999.999.999';
const MINIMUM_REACT_VERSION = '19.0.0';

let warnedForMissingVersion = false;

function resetWarningFlag() {
  warnedForMissingVersion = false;
}

let cachedDetectedReactVersion;

function resetDetectedVersion() {
  cachedDetectedReactVersion = undefined;
}

function resolveBasedir(contextOrFilename) {
  if (contextOrFilename) {
    const filename = typeof contextOrFilename === 'string' ? contextOrFilename : getFilename(contextOrFilename);
    const dirname = path.dirname(filename);
    try {
      if (fs.statSync(filename).isFile()) {
        // dirname must be dir here
        return dirname;
      }
    } catch (err) {
      // https://github.com/eslint/eslint/issues/11989
      if (err.code === 'ENOTDIR') {
        // virtual filename could be recursive
        return resolveBasedir(dirname);
      }
    }
  }
  return process.cwd();
}

function convertConfVerToSemver(confVer) {
  const fullSemverString = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return semver.coerce(
    fullSemverString
      .split('.')
      .map((part) => Number(part))
      .join('.'),
  );
}

let defaultVersion = ULTIMATE_LATEST_SEMVER;

function resetDefaultVersion() {
  defaultVersion = ULTIMATE_LATEST_SEMVER;
}

function readInstalledPackageVersion(packageJsonPath) {
  const version = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version;
  if (typeof version !== 'string') {
    const error = new Error(`Package at ${packageJsonPath} does not declare a version.`);
    error.code = 'MODULE_NOT_FOUND';
    throw error;
  }
  return version;
}

function readDefaultReactVersionFromContext(context) {
  // Shared ESLint settings.
  if (context.settings && context.settings.react && context.settings.react.defaultVersion) {
    let settingsDefaultVersion = context.settings.react.defaultVersion;
    if (typeof settingsDefaultVersion !== 'string') {
      error(
        `Warning: default React version specified in eslint-pluigin-react-settings must be a string; got "${typeof settingsDefaultVersion}"`,
      );
    }
    settingsDefaultVersion = String(settingsDefaultVersion);
    const result = convertConfVerToSemver(settingsDefaultVersion);
    if (result) {
      defaultVersion = result.version;
    } else {
      error(
        `Warning: React version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “${settingsDefaultVersion}”. Falling back to latest version as default.`,
      );
    }
  } else {
    defaultVersion = ULTIMATE_LATEST_SEMVER;
  }
}

function detectReactVersion(context) {
  if (cachedDetectedReactVersion) {
    return cachedDetectedReactVersion;
  }

  const basedir = resolveBasedir(context);

  try {
    const reactPackageJsonPath = resolveSync('react/package.json', { basedir });
    cachedDetectedReactVersion = readInstalledPackageVersion(reactPackageJsonPath);
    return cachedDetectedReactVersion;
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      if (!warnedForMissingVersion) {
        let sentence2 = 'Assuming latest React version for linting.';
        if (defaultVersion !== ULTIMATE_LATEST_SEMVER) {
          sentence2 = `Assuming default React version for linting: "${defaultVersion}".`;
        }
        error(
          `Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. ${sentence2}`,
        );
        warnedForMissingVersion = true;
      }
      cachedDetectedReactVersion = defaultVersion;
      return cachedDetectedReactVersion;
    }
    throw e;
  }
}

function getReactVersionFromContext(context) {
  readDefaultReactVersionFromContext(context);
  let confVer = defaultVersion;
  // Shared ESLint settings.
  if (context.settings && context.settings.react && context.settings.react.version) {
    let settingsVersion = context.settings.react.version;
    if (settingsVersion === 'detect') {
      settingsVersion = detectReactVersion(context);
    }
    if (typeof settingsVersion !== 'string') {
      error(
        `Warning: React version specified in eslint-plugin-react-settings must be a string; got “${typeof settingsVersion}”`,
      );
    }
    confVer = String(settingsVersion);
  } else if (!warnedForMissingVersion) {
    error(
      'Warning: React version not specified in eslint-plugin-react settings. See https://github.com/ternaus/eslint-plugin-react#settings.',
    );
    warnedForMissingVersion = true;
  }

  const result = convertConfVerToSemver(confVer);
  if (!result) {
    error(
      `Warning: React version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “${confVer}”`,
    );
  }
  const version = result ? result.version : defaultVersion;
  if (semver.lt(version, MINIMUM_REACT_VERSION)) {
    throw new Error(
      `React ${version} is unsupported. @ternaus/eslint-plugin-react requires React ${MINIMUM_REACT_VERSION} or newer.`,
    );
  }
  return version;
}

function detectFlowVersion(context) {
  const basedir = resolveBasedir(context);

  try {
    const flowPackageJsonPath = resolveSync('flow-bin/package.json', { basedir });
    return readInstalledPackageVersion(flowPackageJsonPath);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      error(
        'Warning: Flow version was set to "detect" in eslint-plugin-react settings, ' +
          'but the "flow-bin" package is not installed. Assuming latest Flow version for linting.',
      );
      return ULTIMATE_LATEST_SEMVER;
    }
    throw e;
  }
}

function getFlowVersionFromContext(context) {
  const configuredFlowVersion = context.settings?.react?.flowVersion;
  if (!configuredFlowVersion) {
    throw new Error('Could not retrieve flowVersion from settings.');
  }

  const flowVersion = configuredFlowVersion === 'detect' ? detectFlowVersion(context) : configuredFlowVersion;
  if (typeof flowVersion !== 'string') {
    error(
      'Warning: Flow version specified in eslint-plugin-react-settings must be a string; ' +
        `got “${typeof flowVersion}”`,
    );
  }
  const confVer = String(flowVersion);

  const result = convertConfVerToSemver(confVer);
  if (!result) {
    error(
      `Warning: Flow version specified in eslint-plugin-react-settings must be a valid semver version, or "detect"; got “${confVer}”`,
    );
  }
  return result ? result.version : defaultVersion;
}

function test(semverRange, confVer) {
  return semver.satisfies(confVer, semverRange);
}

function testReactVersion(context, semverRange) {
  return test(semverRange, getReactVersionFromContext(context));
}

function testFlowVersion(context, semverRange) {
  return test(semverRange, getFlowVersionFromContext(context));
}

const exported = {
  testReactVersion,
  testFlowVersion,
  resetWarningFlag,
  resetDetectedVersion,
  resetDefaultVersion,
};

export default exported;
export { exported as 'module.exports' };
