const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development", // Set the mode to development
  entry: "./src/index.js", // Entry point for the application
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"), // Output directory
    clean: true, // Clean the output directory before emit
    publicPath: "/",
  },
  devtool: "eval-source-map",
  devServer: {
    host: "0.0.0.0", // Accept connections from any network interface
    port: 8080, // Or any open port you prefer
    allowedHosts: "all", // Accept requests from any hostname
    watchFiles: ["./src/template.html"], // Keep this line
    static: {
      directory: path.resolve(__dirname, 'dist'), // Serve static content from dist
    },
    hot: true,
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html", // Template HTML file
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};