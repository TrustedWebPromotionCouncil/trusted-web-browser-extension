const path = require("path");

// const custom = require("../config-overrides");
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],
  framework: "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    // custom.resolve.alias['webextension-polyfill'] = require.resolve(
    //     '../__mocks__/webextension-polyfill.js',
    // );
    // custom.resolve.alias['browser-polyfill'] = require.resolve(
    //     '../__mocks__/browser-polyfill.js',
    // );
    // return {
    //   ...config,
    //   resolve: { ...config.resolve, ...custom.resolve },
    // };
    // https://github.com/arackaf/customize-cra/blob/master/src/customizers/webpack.js#L314
    config.resolve.plugins = config.resolve.plugins.filter(
      (p) => p.constructor.name !== "ModuleScopePlugin"
    );
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src"),
      "webextension-polyfill": path.resolve(
        __dirname,
        "../__mocks__/webextension-polyfill.js"
      ),
      "@decentralized-identity/ion-tools": path.resolve(
        __dirname,
        "../__mocks__/@decentralized-identity/ion-tools.js"
      ),
    };
    return config;
  },
};
