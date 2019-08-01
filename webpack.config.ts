import path from "path";
import webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sass from "sass";
import { VueLoaderPlugin } from "vue-loader";

const devMode = process.env.NODE_ENV !== "production";

const config: webpack.Configuration = {
    // ugly as hell.
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "styles",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: { },
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: { },
            },

            // https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
            {
                test: /\.scss$/,
                loader: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./dist/bundle.css",
                            hmr: devMode,
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            implementation: sass,
                        },
                    },
                ],
            },
            {
                test: /.html$/,
                loader: "vue-template-loader",
                exclude: /index.html/,
                options: { },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js", ".vue", ".json"],
        alias: {
            "vue$": "vue/dist/vue.esm.js",
        }
    },
    // documentation: https://webpack.js.org/configuration/dev-server/
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        hot: true,
    },
    performance: {
        hints: "warning",
    },
    devtool: "#eval-source-map",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "build.js"
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: "[id].css",
        }),
    ],
};


export default config;
if (!devMode) {
    module.exports.devtool = "#source-map";
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "production",
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            parallel: {
                cache: true,
                workers: 3,
            },
            sourceMap: true,
            compress: {
                warnings: false,
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        })
    ]);
}
