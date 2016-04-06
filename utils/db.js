/**
 * Created by 郑树聪 on 2016/2/16.
 */
var mysql = require('mysql');

//Enable mysql-queues
var queues = require('mysql-queues');
const DEBUG = true;

var $config = require('../config/config');

//var env = process.env.NODE_ENV || 'development';
//if(config[env]) {
//    config = config[env];
//}

var pool = mysql.createPool($config.mysql_development);

var Db = function(){};

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

/**
 * 数据库操作类封装,多对多关系表操作（插入记录）
 * @param sqls [Array] sql语句组成的数组，两组数据，表示两组查询记录
 * @param params [Array] sql语句中参数值,组合成数组,[[],[]]
 * @param callback 查询回调函数,函数应当包括两个参数,第一个参数isError为boolean类型(判断查询是否有误),第二个results为查询结果
 */
Db.prototype.queryWithQueues = function(sqls, params, callback){

    pool.getConnection(function(err, connection) {
        // 查询有误
        if (err) {
            callback(true, err);
            return;
        }
        queues(connection, DEBUG);
        var trans = connection.startTransaction();
        trans.query(sqls[0], params[0], function (err, results) {
            if (err){
                trans.rollback();
                callback(true, err);
            } else {

                if(results[1][0]['LAST_INSERT_ID()'] === 0) {
                    trans.rollback();
                    err.message = '记录已存在';
                    callback(true, err);
                } else {
                    params[1].push(results[1][0]['LAST_INSERT_ID()']);

                    trans.query(sqls[1], params[1], function(err, results) {

                        if(err) {
                            trans.rollback();
                        } else {
                            if(results[1][0]['LAST_INSERT_ID()'] === 0) {
                                trans.rollback();
                                err.message = '记录已存在';
                                callback(true, err);
                            } else {
                                trans.commit();
                                callback(false, results);
                            }
                        }
                    });
                }
            }
        });
        trans.execute();
    });
};

Db.prototype.format = function(sql, params) {

    return mysql.format(sql, params);
};

module.exports = Db;
