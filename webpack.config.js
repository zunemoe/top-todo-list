const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isLocalhost = env && env.localhost;
  const isNetwork = env && env.network;
  const isProduction = env && env.production;

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.js", // Entry point for the application
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"), // Output directory
      clean: true, // Clean the output directory before emit
      publicPath: isProduction ? "/top-todo-list/" : "/",
    },
    devtool: isProduction ? "source-map" : "eval-source-map",
    devServer: {
      host: isNetwork ? "0.0.0.0" : "localhost",
      port: 8080, // Or any open port you prefer
      allowedHosts: "all", // Accept requests from any hostname
      compress: true, // Enable gzip compression
      historyApiFallback: true, // Fallback to index.html for SPA routing
      client: {
        overlay: {
          errors: true, // Show errors in the overlay
          warnings: false, // Do not show warnings in the overlay
        },
      },
      // Ensure proper headers for mobile
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },
      watchFiles: ["./src/template.html"], // Keep this line
      static: {
        directory: path.resolve(__dirname, "dist"), // Serve static content from dist
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
};
