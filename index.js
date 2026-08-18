import ruleRegistry from './lib/rule-registry.js';

const allRules = Object.fromEntries(ruleRegistry.map(({ implementation, name }) => [name, implementation]));

function createRuleConfig(filter) {
  return Object.fromEntries(ruleRegistry.filter(filter).map(({ name, recommended }) => [`react/${name}`, recommended]));
}

const recommendedRules = createRuleConfig(({ recommended }) => recommended !== 'off');

const configs = { flat: Object.create(null) };

const plugin = {
  meta: {
    name: '@ternaus/eslint-plugin-react',
    version: '8.0.0-rc.3',
  },
  rules: allRules,
  configs,
};

function createFlatConfig(rules) {
  return {
    plugins: { react: plugin },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules,
  };
}

configs.flat.recommended = createFlatConfig(recommendedRules);

configs['flat/recommended'] = configs.flat.recommended;

export default plugin;
export { plugin as 'module.exports' };
