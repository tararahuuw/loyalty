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
        ? "https://prezent.sandeza.id/"
        : staging
        ? "https://staging-prezent.sandeza.id/"
        : devLive
        ? "http://192.168.5.51:3000/"
        : "http://localhost:3000/",
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].js",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    },

    devServer: {
      port: 3000,
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
          test: /\.js$|jsx/,
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
        name: "prezent",
        filename: "remoteEntry.js",
        remotes: {
          account: production
            ? "account@https://prezent.sandeza.id/account/remoteEntry.js"
            : staging
            ? "account@https://staging-prezent.sandeza.id/account/remoteEntry.js"
            : devLive
            ? "account@http://192.168.5.51:3001/remoteEntry.js"
            : "account@http://localhost:3001/remoteEntry.js",
          campaign: production
            ? "campaign@https://prezent.sandeza.id/campaign/remoteEntry.js"
            : staging
            ? "campaign@https://staging-prezent.sandeza.id/campaign/remoteEntry.js"
            : devLive
            ? "campaign@http://192.168.5.51:3002/remoteEntry.js"
            : "campaign@http://localhost:3002/remoteEntry.js",
          engagement: production
            ? "engagement@https://prezent.sandeza.id/engagement/remoteEntry.js"
            : staging
            ? "engagement@https://staging-prezent.sandeza.id/engagement/remoteEntry.js"
            : devLive
            ? "engagement@http://192.168.5.51:3003/remoteEntry.js"
            : "engagement@http://localhost:3003/remoteEntry.js",
          inventory: production
            ? "inventory@https://prezent.sandeza.id/inventory/remoteEntry.js"
            : staging
            ? "inventory@https://staging-prezent.sandeza.id/inventory/remoteEntry.js"
            : devLive
            ? "inventory@http://192.168.5.51:3004/remoteEntry.js"
            : "inventory@http://localhost:3004/remoteEntry.js",
          redeem: production
            ? "redeem@https://prezent.sandeza.id/redeem/remoteEntry.js"
            : staging
            ? "redeem@https://staging-prezent.sandeza.id/redeem/remoteEntry.js"
            : devLive
            ? "redeem@http://192.168.5.51:3005/remoteEntry.js"
            : "redeem@http://localhost:3005/remoteEntry.js",
          report: production
            ? "report@https://prezent.sandeza.id/report/remoteEntry.js"
            : staging
            ? "report@https://staging-prezent.sandeza.id/report/remoteEntry.js"
            : devLive
            ? "report@http://192.168.5.51:3006/remoteEntry.js"
            : "report@http://localhost:3006/remoteEntry.js",
          reward: production
            ? "reward@https://prezent.sandeza.id/reward/remoteEntry.js"
            : staging
            ? "reward@https://staging-prezent.sandeza.id/reward/remoteEntry.js"
            : devLive
            ? "reward@http://192.168.5.51:3007/remoteEntry.js"
            : "reward@http://localhost:3007/remoteEntry.js",
          settings: production
            ? "settings@https://prezent.sandeza.id/settings/remoteEntry.js"
            : staging
            ? "settings@https://staging-prezent.sandeza.id/settings/remoteEntry.js"
            : devLive
            ? "settings@http://192.168.5.51:3008/remoteEntry.js"
            : "settings@http://localhost:3008/remoteEntry.js",
        },
        exposes: {
          "./Loyalty": "./src/bootstrap",
          "./CustomDateTimePicker": "./src/components/shared/CustomDateTimePicker/CustomDateTimePicker.js",
          "./ToolTip": "./src/components/shared/ToolTip/ToolTip.js",
          "./DropdownPhone": "./src/components/shared/DropdownPhone/DropdownPhone.js",
          "./Description": "./src/components/shared/Description/Description.js",
          "./DangerButton": "./src/components/shared/DangerButton/DangerButton.js",
          "./TextInput": "./src/components/shared/TextInput/TextInput.js",
          "./DatePicker": "./src/components/shared/DatePicker/DatePicker.js",
          "./CheckBox": "./src/components/shared/CheckBox/CheckBox.js",
          "./TextEditor": "./src/components/shared/TextEditor/TextEditor.js",
          "./TextInputMask": "./src/components/shared/TextInputMask/TextInputMask.js",
          "./DropDownSearch": "./src/components/shared/DropDownSearch/DropDownSearch.js",
          "./TextArea": "./src/components/shared/TextArea/TextArea.js",
          "./FilterDropdownMixed": "./src/components/shared/FilterDropdownMixed/FilterDropdownMixed.js",
          "./RadioButton": "./src/components/shared/RadioButton/RadioButton.js",
          "./DataTable": "./src/components/shared/DataTable/DataTable.js",
          "./DateTimePicker": "./src/components/shared/DateTimePicker/DateTimePicker.js",
          "./PhoneLayout": "./src/components/shared/CustomPhone/CustomPhone.js",
          "./LoadingModal": "./src/components/shared/LoadingModal/LoadingModal.js",
          "./ResultModal": "./src/components/shared/ResultModal/ResultModal.js",
          "./StateModal": "./src/components/shared/StateModal/StateModal.js",
          "./LandingPageSelectComponent":
            "./src/components/shared/LandingPageSelectComponent/LandingPageSelectComponent.js",
          "./LandingPageAddressInput": "./src/components/shared/LandingPageAddressInput/LandingPageAddressInput.js",
          "./LandingPageSmallTabBar": "./src/components/shared/LandingPageSmallTabBar/LandingPageSmallTabBar.js",
          "./LandingPageAddressItemList":
            "./src/components/shared/LandingPageAddressItemList/LandingPageAddressItemList.js",
          "./SearchDropDown": "./src/components/shared/SearchDropDown/SearchDropDown.js",
          "./FilterDropDown": "./src/components/shared/FilterDropDown/FilterDropDown.js",
          "./Modal": "./src/components/shared/Modal/Modal.js",
          "./useFetch": "./src/hooks/useFetch.js",
          "./useDisclosure": "./src/hooks/useDisclosure.js",
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
