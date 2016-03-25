/**
 * 后台: 用户模型类
 * Created by 郑树聪 on 2016/2/16.
 */
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();
var common = new Common();


var user_tb = 'music_users';

/**
 * 用户对象模型类
 * @param userInfo [Object] 用户信息
 * userInfo.username [String] 用户名
 * userInfo.email [String] 邮箱,[必须项]
 * userInfo.password [String] 密码
 * userInfo.code [String] 地区代码
 * userInfo.brith [String] 出身日期
 * userInfo.sex [Number] 性别,默认0
 * userInfo.status [Number] 用户类型,默认2
 * userInfo.info [String] 简介
 * userInfo.img [String] 头像路径
 */
var User = function(userInfo) {
    this.username = userInfo.username || '';
    this.email = userInfo.email;
    this.password = userInfo.password;
    this.code = userInfo.code || null;
    this.birth = userInfo.birth || null;
    this.sex = userInfo.sex || 0;
    this.role = (typeof userInfo.role !== 'undefined')? userInfo.role : 2;
    this.info = userInfo.info || '';
    this.img = userInfo.img || null;
};

/**
 * 查找用户,用于登录验证
 * @param callback {Function} 回调函数
 */
User.prototype.findOne = function(callback) {

    var sql = 'select * from ' + user_tb + ' where email=?';
    db.query(sql, [this.email], callback);
};

/**
 * 注册用户
 * @param callback {Function} 回调函数
 */
User.prototype.create = function(callback){

    var registered_time = common.getCurrentTime();
    var sql = 'insert into ' + user_tb + '(username, email, password, type, registered_time) values (?, ?, ?, ?, ?)';
    db.query(sql, [this.username, this.email, this.password, this.type, registered_time], callback);
};

/**
 * 根据邮箱更新某一用户信息
 * @param oldEmail {String} 用户原先邮箱
 * @param callback {Function} 回调函数
 */
User.prototype.update = function(oldEmail, callback){

    var sql = 'update ' + user_tb + ' set username=?, email=?, password=?, img=?, code=?, birth=?, sex=?, ' +
        'role=?, info=? where email=?';
    db.query(sql, [this.username, this.email, this.password, this.img, this.code, this.birth,
        this.sex, this.role, this.info, oldEmail], callback);
};

// 删除用户
User.prototype.delete = function(){

};

module.exports = User;
