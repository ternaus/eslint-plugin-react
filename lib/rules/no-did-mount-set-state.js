/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author Yannick Croissant
 */

import makeNoMethodSetStateRule from '../util/makeNoMethodSetStateRule.js';

/** @type {import('eslint').Rule.RuleModule} */
const exported = makeNoMethodSetStateRule('componentDidMount');

export default exported;
export { exported as 'module.exports' };
