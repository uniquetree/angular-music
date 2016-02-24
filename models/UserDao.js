/**
 * 后台: 用户模型类
 * Created by 郑树聪 on 2016/2/16.
 */
var Db = require('../utils/Db');
var db = new Db();

var user_tb = 'music_users';

var User = function() {
};

// 查找用户
User.prototype.findOne = function(email, callback) {

    var sql = 'SELECT * FROM ' + user_tb + ' WHERE email =?';
    db.query(sql, [email], callback);
};

// 创建用户
User.prototype.create = function(email, pwd, name, type, callback){

    var sql = 'insert into ' + user_tb + '(email, pwd, name, type) values (?, ?, ?, ?)';
    db.query(sql, [email, pwd, name, type], callback);
};

// 更新用户信息
User.prototype.update = function(){


};

// 删除用户
User.prototype.delete = function(){

};

module.exports = User;

//var test = new User();
//test.findOne();
