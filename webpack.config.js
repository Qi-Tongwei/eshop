
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

//环境变量的配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

var getHtmlConfig = function(name,title){ // 获取html-webpack-plugin参数的方法
    return {
            template : './src/view/' + name + '.html',
            filename : 'view/' + name + '.html',
            title : title,
            favicon : './favicon.ico',
            inject : true, // 注入方式自动注入不需要手动引入
            hash : true,
            chunks : ['common' , name] // 需要打包的模块。
    };
};

var config = { // webpack config
     entry : {
            'common' : ['./src/page/common/index.js'],
     	'index' : ['./src/page/index/index.js'],
             'list' : ['./src/page/list/index.js'],
             'detail' : ['./src/page/detail/index.js'],
             'cart' : ['./src/page/cart/index.js'],
             'order-confirm' : ['./src/page/order-confirm/index.js'],
             'order-list' : ['./src/page/order-list/index.js'],
             'order-detail' : ['./src/page/order-detail/index.js'],
             'payment' : ['./src/page/payment/index.js'],
     	'user-login' : ['./src/page/user-login/index.js'],
             'user-register' : ['./src/page/user-register/index.js'],
             'user-pass-reset' : ['./src/page/user-pass-reset/index.js'],
             'user-center' : ['./src/page/user-center/index.js'],
             'user-center-update' : ['./src/page/user-center-update/index.js'],
             'user-pass-update' : ['./src/page/user-pass-update/index.js'],
             'result' : ['./src/page/result/index.js'],
             'about' : ['./src/page/about/index.js'],
     },

     output : {
        // webpack高版本只支持绝对路径，所以这里改成绝对路径
         path :  __dirname + '/dist/',
         // 文件引用路径，线上环境则改变原来的dist的本地引用的路径
         publicPath : 'dev' === WEBPACK_ENV ? '/dist/' : '//s.happymmall.com/eshop/dist/', 
         // 将编译后的JS文件归类到js文件夹下，编译后的文件名按照源文件的名字命名
         filename :  'js/[name].js', 
     },
     // 可以将外部的变量或者模块加载进来
     externals : { 
     	'jquery' : 'window.jQuery'
     },
    // webpack处理CSS，并且单独打包
     module : {
        loaders : [
            { test : /\.css$/, loader : ExtractTextPlugin.extract("style-loader","css-loader")},
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]' },
            { 
                test : /\.string$/, 
                loader : 'html-loader',
                query : {
                    minimize : true,
                    removeAttributeQuotes : false
                }
            }
        ]
    },

    resolve : {
        alias : {
            // __dirname表示当前根目录
            node_modules : __dirname + '/node_modules',
            util : __dirname + '/src/util', 
            page : __dirname + '/src/page',
            service : __dirname + '/src/service',
            image : __dirname + '/src/image',
        }
    },
    // plungins是webpack的插件，在安装完webpack的插件后，
    // plugins关键字部分添加该插件的一个实例（plugins是一个数组）。
     plugins : [ 
             // 提取公共模块。
     	new webpack.optimize.CommonsChunkPlugin({ 
                 // 文件名
                name : 'common',
                // path关键字已经给定了输出文件的目录，
                //所以common新生成的文件根路径还是在dist下。
     	   filename : 'js/base.js' 
     	}),
            //单独打包CSS，[name]是一个变量，值为源文件的名字。
            new ExtractTextPlugin("css/[name].css"), 

            // html模板打包处理
            new HtmlWebpackPlugin(getHtmlConfig('index','首页')),
            new HtmlWebpackPlugin(getHtmlConfig('list','商品列表')),
            new HtmlWebpackPlugin(getHtmlConfig('detail','商品详情')),
            new HtmlWebpackPlugin(getHtmlConfig('cart','购物车')),
            new HtmlWebpackPlugin(getHtmlConfig('order-confirm','订单确认')),
            new HtmlWebpackPlugin(getHtmlConfig('order-list','订单列表')),
            new HtmlWebpackPlugin(getHtmlConfig('order-detail','订单列表')),
            new HtmlWebpackPlugin(getHtmlConfig('payment','订单支付')),
            new HtmlWebpackPlugin(getHtmlConfig('user-login','用户登录')),
            new HtmlWebpackPlugin(getHtmlConfig('user-register','用户注册')),
            new HtmlWebpackPlugin(getHtmlConfig('user-pass-reset','找回密码')),
            new HtmlWebpackPlugin(getHtmlConfig('result','操作结果')),
            new HtmlWebpackPlugin(getHtmlConfig('user-center','个人中心')),
            new HtmlWebpackPlugin(getHtmlConfig('user-center-update','修改个人信息')),
            new HtmlWebpackPlugin(getHtmlConfig('user-pass-update','修改密码')),
            new HtmlWebpackPlugin(getHtmlConfig('about','关于MMall'))
     ]
 };

// 开发环境下增加如下的client
if('dev' === WEBPACK_ENV){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

 module.exports = config;