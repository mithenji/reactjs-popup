declare module '@storybook/react-webpack5' {
  import { StorybookConfig as BaseConfig } from '@storybook/types';
  
  export interface StorybookConfig extends BaseConfig {
    babel?: (config: any) => any;
    typescript?: {
      check: boolean;
      reactDocgen: string;
      reactDocgenTypescriptOptions?: {
        compilerOptions?: {
          allowSyntheticDefaultImports?: boolean;
          esModuleInterop?: boolean;
        };
        configFile?: string;
      };
    };
  }

  export interface Preview {
    parameters?: {
      actions?: { argTypesRegex: string };
      controls?: {
        matchers?: {
          color?: RegExp;
          date?: RegExp;
        };
      };
    };
    features?: {
      storyStoreV7?: boolean;
    };
  }

  export type Meta<T> = {
    title: string;
    component: T;
    parameters?: any;
  };

  export type StoryObj<T> = {
    args?: Partial<T>;
    render?: (args: T) => JSX.Element;
  };
} 