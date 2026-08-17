/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */

import makeNoMethodSetStateRule from '../util/makeNoMethodSetStateRule.js';

/** @type {import('eslint').Rule.RuleModule} */
const exported = makeNoMethodSetStateRule('componentWillUpdate', () => true);

export default exported;
export { exported as 'module.exports' };
