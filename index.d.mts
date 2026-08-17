import type { Linter, Rule } from 'eslint';

export type FlatConfig = Linter.Config;
export type FlatConfigName = 'all' | 'jsx-runtime' | 'recommended';

export interface ReactPlugin {
  readonly meta: {
    readonly name: string;
    readonly version: string;
  };
  readonly rules: Readonly<Record<string, Rule.RuleModule>>;
  readonly deprecatedRules: Readonly<Record<string, Rule.RuleModule>>;
  readonly configs: {
    readonly flat: Readonly<Record<FlatConfigName, FlatConfig>>;
  };
}

declare const plugin: ReactPlugin;

export default plugin;
