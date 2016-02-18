/**
 * 后台: 用户模型类
 * Created by 郑树聪 on 2016/2/16.
 */
var db = require('../config/db');

var User = function() {};

// 查找用户
User.prototype.find = function(id, callback) {
    var sql = "SELECT * FROM music_users WHERE pid =?";
    // get a connection from the pool
    db.pool.getConnection(function(err, connection) {
        if (err) {
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [id], function(err, results) {
            if (err) {
                callback(true);
                return;
            }
            callback(false, results);
        });
    });
};

// 创建用户
User.prototype.create = function(name, email, pwd, type){

};

// 更新用户信息
User.prototype.update = function(){

};

// 删除用户
User.prototype.delete = function(){

};

// 登录
User.prototype.login = function(){

};

// 登出
User.prototype.logout = function(){

};

// 注册
User.prototype.register = function(){

};

module.exports = User;
