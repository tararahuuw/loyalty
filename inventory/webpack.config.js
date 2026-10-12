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
        ? "https://prezent.sandeza.id/inventory/"
        : staging
        ? "https://staging-prezent.sandeza.id/inventory/"
        : devLive
        ? "http://192.168.5.51:3004/"
        : "http://localhost:3004/",
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3004,
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
        name: "inventory",
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
          "./Inventory": "./src/bootstrap",
          // Store
          "./StoreDashboardPage": "./src/pages/store/dashboardStore",
          "./AddStorePage": "./src/pages/store/addStore",
          "./EditStorePage": "./src/pages/store/editStore",
          "./DetailStorePage": "./src/pages/store/detailStore",

          // Category
          "./CategoryDashboardPage": "./src/components/category/CategorySection/CategorySection",
          "./AddCategoryPage": "./src/pages/product/addCategory",

          // Specification
          "./SpecificationDashboardPage": "./src/components/specification/SpecificationSection/SpecificationSection",

          // Product
          "./ProductDashboardPage": "./src/components/product/ProductSection/ProductSection",
          "./DetailProductPage": "./src/pages/product/detailProduct",
          "./AddProductPage": "./src/pages/product/addProduct",
          "./EditProductPage": "./src/pages/product/editProduct",

          // Payment Method
          "./PaymentMethodDashboardPage": "./src/pages/paymentMethod/dashboardPaymentMethod",
          "./DetailPaymentMethodPage": "./src/pages/paymentMethod/detailPaymentMethod",
          "./AddPaymentMethodPage": "./src/pages/paymentMethod/addPaymentMethod",
          "./EditPaymentMethodPage": "./src/pages/paymentMethod/editPaymentMethod",
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
