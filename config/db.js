/**
 * Created by 郑树聪 on 2016/2/16.
 */
var mysql = require('mysql');
var config = require('./config');

//var env = process.env.NODE_ENV || 'development';
//if(config[env]) {
//    config = config[env];
//}

var pool = mysql.createPool(config.development);

exports.pool = pool;
