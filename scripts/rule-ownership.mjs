import biomeCompatibilityConfig from 'eslint-config-biome';

const biomeOwnedRules = Object.entries(biomeCompatibilityConfig.rules)
  .filter(([, setting]) => setting === 0 || setting === 'off')
  .map(([rule]) => rule)
  .sort((left, right) => left.localeCompare(right));

export const BIOME_OWNED_ESLINT_RULES = Object.freeze(biomeOwnedRules);

const biomeOwnedRuleSet = new Set(BIOME_OWNED_ESLINT_RULES);

export function residualEslintConfig(config) {
  if (!config.rules) return config;

  return {
    ...config,
    rules: Object.fromEntries(
      Object.entries(config.rules)
        .filter(([rule]) => !biomeOwnedRuleSet.has(rule))
        .map(([rule, setting]) => {
          const severity = Array.isArray(setting) ? setting[0] : setting;
          if (severity === 0 || severity === 'off') return [rule, setting];
          return [rule, Array.isArray(setting) ? ['error', ...setting.slice(1)] : 'error'];
        }),
    ),
  };
}
