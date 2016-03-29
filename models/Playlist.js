/**
 * 后台: 菜单模型类
 * Created by 郑树聪 on 2016/2/25.
 */
var config = require('../config/config');
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();
var common = new Common();

var playlist_tb = config.tableName.playlist_tb;

var Playlist = function (type) {
    this.menu = [];
    this.type = type;
};

Playlist.prototype.findPlaylists = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

Playlist.prototype.findPlaylistsBySingerId = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

Playlist.prototype.addPlaylist = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

Playlist.prototype.deletePlaylistByIds = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

module.exports = Playlist;
