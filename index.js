import allRules from './lib/rules/index.js';

const ERROR = 'error';
const OFF = 'off';

function withoutDeprecatedRules(rules) {
  return Object.fromEntries(Object.entries(rules).filter(([, rule]) => !rule.meta.deprecated));
}

function asErrorConfig(rules) {
  return Object.fromEntries(Object.keys(rules).map((name) => [`react/${name}`, ERROR]));
}

const activeRules = withoutDeprecatedRules(allRules);
const deprecatedRules = Object.fromEntries(Object.entries(allRules).filter(([, rule]) => rule.meta.deprecated));

const recommendedRules = {
  'react/display-name': ERROR,
  'react/jsx-key': ERROR,
  'react/jsx-no-comment-textnodes': ERROR,
  'react/jsx-no-duplicate-props': ERROR,
  'react/jsx-no-target-blank': ERROR,
  'react/jsx-no-undef': ERROR,
  'react/jsx-uses-react': ERROR,
  'react/jsx-uses-vars': ERROR,
  'react/no-children-prop': ERROR,
  'react/no-danger-with-children': ERROR,
  'react/no-deprecated': ERROR,
  'react/no-direct-mutation-state': ERROR,
  'react/no-find-dom-node': ERROR,
  'react/no-is-mounted': ERROR,
  'react/no-render-return-value': ERROR,
  'react/no-string-refs': ERROR,
  'react/no-unescaped-entities': ERROR,
  'react/no-unknown-property': ERROR,
  'react/no-unsafe': OFF,
  'react/prop-types': ERROR,
  'react/react-in-jsx-scope': ERROR,
  'react/require-render-return': ERROR,
};

const configs = { flat: Object.create(null) };

const plugin = {
  meta: {
    name: '@ternaus/eslint-plugin-react',
    version: '8.0.0-alpha.0',
  },
  deprecatedRules,
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
configs.flat.all = createFlatConfig(asErrorConfig(activeRules));
configs.flat['jsx-runtime'] = createFlatConfig({
  'react/jsx-uses-react': OFF,
  'react/react-in-jsx-scope': OFF,
});

configs['flat/recommended'] = configs.flat.recommended;
configs['flat/all'] = configs.flat.all;
configs['flat/jsx-runtime'] = configs.flat['jsx-runtime'];

export default plugin;
export { plugin as 'module.exports' };
