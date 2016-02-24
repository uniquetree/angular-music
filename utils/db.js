/**
 * Created by 郑树聪 on 2016/2/16.
 */
var mysql = require('mysql');
var config = require('../config/config');

//var env = process.env.NODE_ENV || 'development';
//if(config[env]) {
//    config = config[env];
//}

var pool = mysql.createPool(config.development);

var Db = function(){
};

/**
 * 数据库操作类封装
 * @param sql string sql语句
 * @param params array sql语句中参数值,组合成数组
 * @param callback 查询回调函数,函数应当包括两个参数,第一个参数isError为boolean类型(判断查询是否有误),第二个results为查询结果
 */
Db.prototype.query = function(sql, params, callback){

    pool.getConnection(function(err, connection) {
        // 查询有误
        if (err) {
            callback(true, err);
            return;
        }
        // make the query
        connection.query(sql, params, function (err, results) {
            if (err) {
                callback(true, err);
                return;
            }
            callback(false, results);
        });
    });
};

module.exports = Db;
