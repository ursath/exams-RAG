import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

export default {
	devServer: {
		historyApiFallback: true,
		hot: true,
		open: true,
		port: 3000,
		static: {
			directory: path.join(process.cwd(), "public"),
		},
	},
	entry: "./src/index.tsx",
	mode: "development",
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.(ts|tsx)$/,
				use: "ts-loader",
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
		],
	},
	output: {
		clean: true,
		filename: "bundle.js",
		path: path.resolve(process.cwd(), "public/dist"),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx"],
	},
};
