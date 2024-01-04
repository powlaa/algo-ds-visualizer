const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/app.ts",
    mode: "development",
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
                loader: "ts-loader"
            },
        }]
    },
    // Set devtool to false when in production. It is usually helpful for debugging in dev mode.
    devtool: false,
    resolve: {
        extensions: [".js", ".ts", ]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Algorithm Visualizer",
            filename: "index.html",
            template: "./src/template.html",
        }),
    ],
}