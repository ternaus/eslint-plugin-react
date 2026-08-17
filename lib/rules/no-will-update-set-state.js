/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */

import makeNoMethodSetStateRule from '../util/makeNoMethodSetStateRule.js';
import requiredModule0 from '../util/version.js';

const testReactVersion = requiredModule0.testReactVersion;

/** @type {import('eslint').Rule.RuleModule} */
const exported = makeNoMethodSetStateRule('componentWillUpdate', (context) => testReactVersion(context, '>= 16.3.0'));

export default exported;
export { exported as 'module.exports' };
