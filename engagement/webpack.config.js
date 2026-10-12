const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
module.exports = (_, argv) => {
  const appEnv = process.env.APP_ENV;
  const production = appEnv === "production";
  const staging = appEnv === "staging";
  const devLive = appEnv === "devLive";

  return {
    output: {
    publicPath: production
        ? "https://prezent.sandeza.id/engagement/"
        : staging
        ? "https://staging-prezent.sandeza.id/engagement/"
        : devLive
        ? "http://192.168.5.51:3003/"
        : "http://localhost:3003/",
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3003,
      historyApiFallback: true,
      allowedHosts: ["staging-prezent.sandeza.id"],
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },

    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "images/", // Output direktori untuk file gambar
              },
            },
          ],
        },
        {
          test: /\.(csv|tsv)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "assets/",
              },
            },
          ],
        },
        {
          test: /\.(xlsx)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "assets/", // Output direktori untuk file xlsx
              },
            },
          ],
        },
        {
          test: /\.(txt)$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "assets/",
              },
            },
          ],
        },
        {
          test: /\.json$/,
          loader: "json-loader",
        },
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"], // Tambahkan @babel/preset-react di sini
            },
          },
        },
      ],
    },

    optimization: {
      minimize: false,
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "engagement",
        filename: "remoteEntry.js",
        remotes: {
         prezent: production
            ? "prezent@https://prezent.sandeza.id/remoteEntry.js"
            : staging
            ? "prezent@https://staging-prezent.sandeza.id/remoteEntry.js"
            : devLive
            ? "prezent@http://192.168.5.51:3000/remoteEntry.js"
            : "prezent@http://localhost:3000/remoteEntry.js",
        },
        exposes: {
          // Tiering Level
          "./OnBoardingTieringLevelPage": "./src/pages/tieringLevel/onBoardingTieringLevel",
          "./DasboardTieringLevelPage": "./src/pages/tieringLevel/dashboardTieringLevel",
          "./AddTieringLevelPage": "./src/pages/tieringLevel/addTieringLevel",
          "./AddTierLevelPage": "./src/pages/tierLevel/addTierLevel",
          "./EditTieringLevelPage": "./src/pages/tieringLevel/editTieringLevel",
          "./EditTierLevelPage": "./src/pages/tierLevel/editTierLevel",
          "./DetailTieringLevelPage": "./src/pages/tieringLevel/detailTieringLevel",

          // Customer 360
          "./DashboardCustomerPage": "./src/pages/customer/dashboardCustomer",
          "./DetailCustomerPage": "./src/pages/customer/detailCustomer",
          "./ImportPointsPage": "./src/pages/customer/importPoints",
          "./ImportTransactionsPage": "./src/pages/customer/importTransactions",

          // Customer
          "./DasboardTierLevelPage": "./src/pages/tierLevel/dashboardTierLevel",
          "./DashboardCustomersPage": "./src/pages/customers",
          "./DashboardTransactionsPage": "./src/pages/transactions",
          "./DashboardPointsPage": "./src/pages/points",
        },
        shared: {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({
        path: `./.env.${appEnv || argv.mode}`,
      }),
    ],
  };
};
