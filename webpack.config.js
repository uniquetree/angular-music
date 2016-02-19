/**
 * Created by 郑树聪 on 2016/2/13.
 */
var path = require('path');
var webpack = require('webpack');

module.exports = {
    //页面入口文件配置
    entry: {
        app: './src/components/app.js',
        vendor: './src/components/vendor.js'
    },
    //入口文件输出配置
    output: {
        path: path.join(__dirname, 'app/'),
        publicPath: './app/',
        filename: '[name].bundle.js',
        chunkFilename: '[chunkhash].bundle.js'
    },
    //其它解决方案配置
    resolve: {
        extensions: ['', '.js', '.css', 'scss', '.json'],
        alias: {
            //js: path.join(__dirname, "src/scripts"),
            //styles: path.join(__dirname, "src/styles"),
            img: path.join(__dirname, "src/images")
        },
        root: [path.join(__dirname, 'bower_components')]
    },
    module: {
        //加载器配置
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            {test: /\.less$/, loader: 'style!css!less?sourceMap'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            //bootstrap
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=fonts/[name].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]'},
        ]
    },
    //插件项
    plugins: [
        // webpack配合bower
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
        ),
        // 提供全局的变量，在模块中使用无需用require引入
        new webpack.ProvidePlugin({
            //$: 'jquery',
            //jQuery: 'jquery',
            //"window.jQuery": "jquery"
        }),
        // 提出入口模块中的公用代码,生产公用代码文件,主要是Angular、jquery等插件框架的引用
        //new webpack.optimize.CommonsChunkPlugin('common.js')
    ]
};
