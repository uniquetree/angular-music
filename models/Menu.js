/**
 * 后台: 菜单模型类
 * Created by 郑树聪 on 2016/2/25.
 */
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();
var common = new Common();

var menu_tb = 'music_menu';
var sub_menu_tb = 'music_sub_menu';

var Menu = function (type) {
    this.menu = [];
    this.type = type;
};

Menu.prototype.findMenus = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

module.exports = Menu;
