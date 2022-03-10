var path = require("path");
const {
  override,
  overrideDevServer,
  disableChunk,
  addBabelPlugins,
  addWebpackAlias,
  addWebpackModuleRule,
  addWebpackPlugin,
} = require("customize-cra");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const REACT_APP_EXTENSION_OBSERVABLE_HOST = process.env.REACT_APP_EXTENSION_OBSERVABLE_HOST;
const REACT_APP_TRACE_APP_HOST = process.env.REACT_APP_TRACE_APP_HOST;

const multipleEntry = require("react-app-rewire-multiple-entry")([
  {
    // Webpack extra entry
    entry: "src/tab/tab.tsx",
    // HTML template used in plugin HtmlWebpackPlugin
    template: "public/tab.html",
    // The file to write the HTML to. You can specify a subdirectory
    outPath: "tab.html",
    // Visit: http[s]://localhost:12222/entry/standard.html
  },
]);

// https://dev.to/jamalx31/use-create-react-app-to-develop-a-chrome-extension-14ld
const copyPlugin = new CopyPlugin({
  patterns: [
    // copy assets
    {
      from: "public",
      globOptions: {
        ignore: ["**/*.html"],
      },
      transform: (content, path) => {
        if (path.endsWith(".json") || path.endsWith(".js")) {
          const modifiedOnce = content.toString().replace(/\$__REACT_APP_EXTENSION_OBSERVABLE_HOST__/g, REACT_APP_EXTENSION_OBSERVABLE_HOST);
          const modifiedTwice = modifiedOnce.toString().replace(/\$__REACT_APP_TRACE_APP_HOST__/g, REACT_APP_TRACE_APP_HOST);
          return modifiedTwice;
        } else {
          return content;
        }
      },
    },
  ],
});

const devServerConfig = () => (config) => {
  return {
    ...config,
    // webpackDevService doesn't write the files to desk
    // so we need to tell it to do so so we can load the
    // extension with chrome
    writeToDisk: true,
  };
};

const babelPlugins = () => {
  let plugins = [
    "@babel/plugin-proposal-logical-assignment-operators",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
  ];
  return plugins;
};

module.exports = {
  webpack: override(
    multipleEntry.addMultiEntry,
    ...addBabelPlugins(...babelPlugins()),
    addWebpackPlugin(copyPlugin),
    // addBundleVisualizer()
    disableChunk(),
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
    }),
    addWebpackModuleRule({
      test: /\.js$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            plugins: [
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-logical-assignment-operators",
              "@babel/plugin-proposal-nullish-coalescing-operator",
            ],
          },
        },
      ],
      exclude: {
        include: /node_modules/,
        exclude: /node_modules\/@decentralized-identity|did-jwt\//,
      },
    }),
    // Allow to import files with `.data-uri.png` suffix as uris.
    // c.f. https://stackoverflow.com/a/61711482/7726839
    addWebpackModuleRule({
      test: /\.data-uri.(png|jpg)$/,
      use: {
        loader: 'url-loader',
        options: {
          encoding: 'base64'
        },
      },
    })
  ),
  // CRAのデフォルト設定を一部上書き
  // https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/utils/createJestConfig.js#L51
  // https://github.com/timarney/react-app-rewired#extended-configuration-options
  jest: function (config) {
    config.transformIgnorePatterns = [
      "/node_modules/(?!(@datasign)/)",
      "^.+\\\\.module\\\\.(css|sass|scss)$",
    ];
    return config;
  },
  devServer: overrideDevServer(devServerConfig()),
};
// module.exports = {
//   webpack: function (config, env) {
//     multipleEntry.addMultiEntry(config);
//     return config;
//   },
// };
// module.exports = {
//   webpack: function (config, env) {
//     // ビルドするファイルを追加
//     // config.entry = {
//     //   main: path.resolve("src/popup/index.tsx"),
//     //   tab: path.resolve("src/tab/index.tsx"),
//     // };
//
//     // ファイル名にhashが含まれないようにする
//     // config.output.path = path.resolve("dist");
//     // config.output.filename = "js/[name].js";
//
//     // // 画像ファイルは必ずJSに含めるようにし、svgもその対象にする
//     // config.module.rules[2].oneOf[0].options.limit = true;
//     // config.module.rules[2].oneOf[0].test.push(/\.svg$/);
//     //
//     // // mini-css-extract-pluginの設定にstyle-loaderを上書きすることでcssをjsに含める
//     // config.module.rules[2].oneOf[3].use[0] = {
//     //   loader: require.resolve("style-loader"),
//     // };
//     // config.plugins.push(
//     //   new HtmlWebpackPlugin({
//     //     filename: "popup.html",
//     //     template: "public/popup.html",
//     //     chunks: ["main"],
//     //     hash: true,
//     //   })
//     // );
//
//     return override(
//       // chunk化しない
//       disableChunk()
//     )(config, env);
//   },
// };
