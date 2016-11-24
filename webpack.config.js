/**
 * Created by Administrator on 2016/10/13.
 */
var webpack = require('webpack');
var path = require('path');
module.exports ={
    devtool: 'sourcemap',
    entry: [__dirname + '/client/main.js'],
    output: {
        path: __dirname + '/public/js',
        filename: 'bundle.js'
    },
    module: {//在配置文件里添加JSON loader
        loaders: [
            {
                test: /\.json$/,
                loader: "json"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',//在webpack的module部分的loaders里进行配置即可
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: "style!css!autoprefixer-loader?{browsers:['last 2 version','firefox 15']}"
            },
            {
                test: /\.scss$/,
                loader: "style!css!autoprefixer-loader?{browsers:['last 2 version','firefox 15']}!sass"
            },
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
                loader: "url?"
            }
        ]
    }
}

