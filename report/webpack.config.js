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
        ? "https://prezent.sandeza.id/report/"
        : staging
        ? "https://staging-prezent.sandeza.id/report/"
        : devLive
        ? "http://192.168.5.51:3006/"
        : "http://localhost:3006/",
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3006,
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
                outputPath: "assets/file",
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
                outputPath: "assets/file", // Output direktori untuk file xlsx
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
        name: "report",
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
          "./DashboardCampaignReportPage": "./src/pages/summary/campaign/dashboardCampaignReport",
          "./DetailCampaignReportPage": "./src/pages/summary/campaign/detailCampaignReport",
          "./DashboardRewardReportPage": "./src/pages/summary/reward",
          "./DashboardDetailsReportPage": "./src/pages/details",
          "./DashboardCustomerReportPage": "./src/pages/customer/dashboardCustomerReport",
          "./DetailCustomerReportPage": "./src/pages/customer/detailCustomerReport",
          "./MaintenancePage": "./src/pages/maintenance",
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
