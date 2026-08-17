'use strict';

// `ruleTester` is a RuleTester instance
const getRuleDefiner = (ruleTester) => ruleTester[Symbol.for('react.RuleTester.RuleDefiner')];

module.exports = getRuleDefiner;
