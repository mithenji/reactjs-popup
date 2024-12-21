import type { Preview } from "@storybook/react-webpack5";

interface Parameters {
  controls: {
    matchers: {
      color: RegExp;
      date: RegExp;
    };
  };
  docs: {
    autodocs: boolean;
  };
}

const parameters: Parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
  docs: {
    autodocs: true,
  },
};

const preview: Preview = {
  parameters,
  features: {
    storyStoreV7: true,
  },
};

export default preview; 