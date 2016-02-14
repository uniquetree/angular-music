/**
 * Created by 郑树聪 on 2016/2/13.
 */
var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    //页面入口文件配置
    entry: {
        app: './src/scripts/app.js',
        admin: './src/scripts/admin.js'
    },
    //入口文件输出配置
    output: {
        path: path.join(__dirname, 'app/scripts/'),
        publicPath: 'app/scripts/',
        filename: '[name].bundle.js',
        chunkFilename: "bundle.js"
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.css', '.json'],
        alias: {
            //angular: path.join(__dirname, 'bower_components'),

            //js: path.join(__dirname, "src/scripts"),
            //styles: path.join(__dirname, "src/styles"),
            //img: path.join(__dirname, "src/images")
        },
        root: [path.join(__dirname, 'bower_components')]
    },
    //module: {
    //    //加载器配置
    //    loaders: [
    //        {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
    //        {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
    //    ]
    //},
    //插件项
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
        ),
        // 提供全局的变量，在模块中使用无需用require引入
        new webpack.ProvidePlugin({
            //jQuery: "jquery",
            //$: "jquery",
            angular: 'angular'
        }),
        // 提出入口模块中的公用代码,生产公用代码文件,主要是Angular、jquery等框架的引用
        new CommonsChunkPlugin('commons.js', ['app', 'admin'])
    ]

};
