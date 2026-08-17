'use strict';

const { builtinRules } = require('eslint/use-at-your-own-risk');

const getESLintCoreRule = (ruleId) => builtinRules.get(ruleId);

module.exports = getESLintCoreRule;
