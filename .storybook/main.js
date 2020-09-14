const babel = require("@babel/core");

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  babel: (config) => {
    const babelConfig = babel.loadPartialConfig({
      configFile: require.resolve('../.babelrc.js'),
    });
    if (!babelConfig) {
      throw new Error('Failed to load Babel config');
    }
    return {
      ...config,
      ...babelConfig.options,
    };
  },
}