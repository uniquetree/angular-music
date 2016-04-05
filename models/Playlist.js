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
var playlist_user_tb = config.tableName.playlist_user_tb;

var Playlist = function (playlistInfo) {
    if(typeof songInfo !== 'undefined') {
        this.id = playlistInfo.id;
        this.playlist_name = playlistInfo.playlist_name;
        this.playlist_info = playlistInfo.playlist_info;
    }
};

/**
 * 获取用户创建/收藏的歌单
 * @param userId [Number] 用户id
 * @param isOwner [Number] 判断歌单与用户的关系，0：收藏的，1：创建的
 * @param callback
 */
Playlist.prototype.getPlayListsByUserId = function(userId, isOwner, callback) {

    var sql = 'select p.id, p.playlist_name, p.playlist_info, p.like_count, p.play_count, p.create_date from ' + playlist_tb +
        ' as p right join (select playlist_id from ' + playlist_user_tb + ' where user_id=? and is_owner=?) as pu on' +
        ' p.id = pu.playlist_id';
    db.query(sql, [userId, isOwner], callback);
};

Playlist.prototype.findPlaylists = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

Playlist.prototype.filterPlayListsByPage = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

Playlist.prototype.addPlaylist = function(callback){

    var sql = 'insert ignore into ' + playlist_tb + ' (playlist_name, playlist_info) values (?, ?)';
    var params = [this.playlist_name, this.playlist_info];
    var lastest_id_sql = 'select LAST_INSERT_ID()';
    db.query(sql + lastest_id_sql, params, callback);
};

Playlist.prototype.addPlaylistWithUserId = function(userId, playlistId, isOwner, callback){

    var sql = 'insert ignore into ' + playlist_user_tb + ' (user_id, playlist_id, is_owner) values (?, ?, ?)';
    var params = [userId, playlistId, isOwner];
    db.query(sql, params, callback);
};

Playlist.prototype.deletePlaylistByIds = function(callback){

    var sql = 'select id, name, href, sub_menu_id from ' + menu_tb + 'where type=?';
    db.query(sql, [this.type], callback);
};

module.exports = Playlist;
