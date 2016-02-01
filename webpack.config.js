var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context: path.resolve('app'),
	entry: ["./app"],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: "bundle.js"
	},
	
	plugins: [
        new HtmlWebpackPlugin()
		//new ExtractTextPlugin('styles.css')	
	],
	devServer:{
		contentBase: 'public'
	},

	module: {
		// preLoaders: [
		// 	{
		// 		test: /\.js$/,
		// 		exclude: 'node_modules',
		// 		loader: 'jshint-loader'
		// 	}
		// ],
		loaders: [
			{
				test: /\.ts$/,
                exclude: /node_modules/,
				//include: path.resolve(__dirname, 'app'),
				loader: "ts-loader"
			}
		]
	},

	resolve: {
		extensions: ['', '.js', '.ts']
	}
}