const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;
module.exports = (_, argv) => {
  const isProduction = argv.mode === "production";
  const devLive = process.env.APP_ENV === "devLive";

  return {
    output: {
      publicPath: isProduction
        ? "https://staging-prezent.sandeza.id/deposit/"
        : devLive
        ? "https://staging-prezent.sandeza.id/deposit/"
        : "http://localhost:3010/",
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3010,
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
        name: "deposit",
        filename: "remoteEntry.js",
        remotes: {
          prezent: isProduction
            ? "prezent@https://staging-prezent.sandeza.id/remoteEntry.js"
            : devLive
            ? "prezent@https://staging-prezent.sandeza.id/remoteEntry.js"
            : "prezent@http://localhost:3000/remoteEntry.js",
        },
        exposes: {
          "./DepositDashboardPage": "./src/pages/dashboardDeposit",
          "./OverallBalancePage": "./src/pages/overallBalance",
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
        path: `./.env.${devLive ? "devLive" : argv.mode}`,
      }),
    ],
  };
};
