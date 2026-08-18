import ruleRegistry from '../rule-registry.js';

const rules = Object.fromEntries(ruleRegistry.map(({ implementation, name }) => [name, implementation]));

export default rules;
export { rules as 'module.exports' };
