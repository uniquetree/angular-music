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
 * @param username [String] 用户名
 * @param email [String] 邮箱,[必须项]
 * @param password [String] 密码,[必须项]
 * @param img [String] 头像路径
 * @param area [String] 地区
 * @param brith [String] 出身日期
 * @param sex 性别,默认0
 * @param status 用户类型,默认2
 * @param info [String] 简介
 */
var User = function(username, email, password, img, area, brith, sex, type, info) {
    this.username = username || '';
    this.email = email;
    this.password = password;
    this.img = img || null;
    this.area = area || null;
    this.brith = brith || null;
    this.sex = sex || 0;
    this.type = type || 2;
    this.info = info || '';
};

/**
 * 查找用户,用于登录验证
 * @param email {String} 用户邮箱
 * @param callback {Function} 回调函数
 */
User.prototype.findOne = function(callback) {

    var sql = 'select * from ' + user_tb + ' where email=?';
    db.query(sql, [this.email], callback);
};

/**
 * 注册用户
 * @param user {Object} 用户对象,需包含username, email, password, status
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

    var sql = 'update ' + user_tb + 'set username=?, email=?, password=?, img=?, area=?, brith=?, sex=?' +
        'type=? where email=?';
    db.query(sql, [this.username, this.email, this.password, this.img, this.area, this.birth,
        this.sex, this.type, oldEmail], callback);
};

// 删除用户
User.prototype.delete = function(){

};

module.exports = User;

//var test = new User();
//test.findOne();
