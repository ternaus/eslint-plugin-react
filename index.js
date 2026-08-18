import ruleRegistry from './lib/rule-registry.js';

const allRules = Object.fromEntries(ruleRegistry.map(({ implementation, name }) => [name, implementation]));

function createRuleConfig(filter) {
  return Object.fromEntries(ruleRegistry.filter(filter).map(({ name, recommended }) => [`react/${name}`, recommended]));
}

const recommendedRules = createRuleConfig(({ recommended }) => recommended !== 'off');
const allRuleConfig = createRuleConfig(() => true);

const configs = { flat: Object.create(null) };

const plugin = {
  meta: {
    name: '@ternaus/eslint-plugin-react',
    version: '8.0.0-rc.0',
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
configs.flat.all = createFlatConfig(Object.fromEntries(Object.keys(allRuleConfig).map((name) => [name, 'error'])));
configs.flat['jsx-runtime'] = createFlatConfig({});

configs['flat/recommended'] = configs.flat.recommended;
configs['flat/all'] = configs.flat.all;
configs['flat/jsx-runtime'] = configs.flat['jsx-runtime'];

export default plugin;
export { plugin as 'module.exports' };
