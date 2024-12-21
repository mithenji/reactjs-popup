import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-docs",
    "@storybook/addon-actions",
    "@storybook/addon-webpack5-compiler-babel",
    "@chromatic-com/storybook"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {},
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
  }
};

export default config; 