import type { Linter, Rule } from 'eslint';

export type FlatConfig = Linter.Config;
export type FlatConfigName = 'recommended';
export type FlatConfigAliasName = `flat/${FlatConfigName}`;

export type ReactPluginConfigs = NonNullable<Linter.Plugin['configs']> & {
  readonly recommended: Pick<FlatConfig, 'rules'>;
  readonly flat: Readonly<Record<FlatConfigName, FlatConfig>>;
} & Readonly<Record<FlatConfigAliasName, FlatConfig>>;

export interface ReactPlugin {
  readonly meta: {
    readonly name: string;
    readonly version: string;
  };
  readonly rules: Readonly<Record<string, Rule.RuleModule>>;
  readonly configs: ReactPluginConfigs;
}

declare const plugin: ReactPlugin;

export default plugin;
