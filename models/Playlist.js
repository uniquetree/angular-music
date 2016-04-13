/**
 * 后台: 菜单模型类
 * Created by 郑树聪 on 2016/2/25.
 */
var config = require('../config/config');
var Db = require('../utils/Db');
var db = new Db();
var common = require('../utils/Common');

var playlist_tb = config.tableName.playlist_tb;
var playlist_user_tb = config.tableName.playlist_user_tb;
var playlist_song_tb = config.tableName.playlist_song_tb;
var song_tb = config.tableName.song_tb;
var user_tb = config.tableName.user_tb;

var Playlist = function (playlistInfo, pagination, keyword) {
    if(typeof playlistInfo !== 'undefined') {
        this.id = playlistInfo.id;
        this.playlist_name = playlistInfo.playlist_name;
        this.playlist_info = playlistInfo.playlist_info;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }

    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};

/**
 * 分页获取歌单,此方法还可以实现关键字查询
 * @param orderBy [Boolean] 判断排序方式，true:按照点赞数和播放数排序,false:按照添加时间排序
 */
Playlist.prototype.filterPlayListsByPage = function(orderByWhich, callback) {

    var orderBy = '';
    if(orderByWhich) {
        orderBy = 'p.like_count and p.play_count';
    } else {
        orderBy = 'p.create_time';
    }

    var filters = '';
    var subFilters = '';
    if(typeof this.keyword !== 'undefined') {
        subFilters = ' where playlist_name like "' + this.keyword + '"';
        filters = 'and p.playlist_name like "' + this.keyword + '"';
    }

    var sql = 'select p.id, p.playlist_name, p.playlist_info, p.like_count, p.play_count, p.create_time, u.username,' +
        ' (select s.song_img from ' + song_tb + ' as s right join ' + playlist_song_tb + ' as ps on s.id=ps.song_id' +
        ' where ps.playlist_id=p.id order by s.create_time desc limit 1) as first_mp3_img,' +
        ' u.pid as user_id from ' + playlist_tb + ' as p left join ' + playlist_user_tb + ' as pu on p.id=pu.playlist_id' +
        ' left join ' + user_tb + ' as u on pu.user_id=u.pid where p.id >= (select id from ' + playlist_tb + subFilters
        +' order by id limit ?,1) ' + filters + ' order by ' + orderBy + ' limit ?;';
    var count_sql = 'select count(*) as totalItems from ' + playlist_tb + subFilters;
    var params = [this.pageSize*this.currPage, this.pageSize];
    db.query(sql+count_sql, params, callback);
};

/**
 * 获取用户创建/收藏的歌单
 * @param userId [Number] 用户id
 * @param isOwner [Number] 判断歌单与用户的关系，0：收藏的，1：创建的
 * @param callback
 */
Playlist.prototype.getPlayListsByUserId = function(userId, isOwner, callback) {

    var sql = 'select p.id, p.playlist_name, p.playlist_info, p.like_count, p.play_count, p.create_time, ' +
        '(select count(*) from ' + playlist_song_tb + ' as ps where ps.playlist_id=p.id) as song_count, ' +
        '(select s.song_img from ' + song_tb + ' as s right join ' + playlist_song_tb + ' as ps on s.id=ps.song_id' +
        ' where ps.playlist_id=p.id order by s.create_time desc limit 1) as first_mp3_img' +
        ' from ' + playlist_tb + ' as p right join (select playlist_id from ' + playlist_user_tb +
        ' where user_id=? and is_owner=?) as pu on p.id = pu.playlist_id';
    db.query(sql, [userId, isOwner], callback);
};
// 添加歌单，同时在歌单和用户关系表添加记录
Playlist.prototype.addPlaylist = function(userId, callback){

    var create_time = common.getCurrentTime();
    var sqls = [],
        params = [];

    var lastest_id_sql = 'select LAST_INSERT_ID()';
    var sql1 = 'insert ignore into ' + playlist_tb + ' (playlist_name, playlist_info, create_time) values (?, ?, ?);';
    sqls.push(sql1+lastest_id_sql);
    params.push([this.playlist_name, this.playlist_info, create_time]);

    var sql2 = 'insert ignore into ' + playlist_user_tb + ' (user_id, playlist_id) values (?, ?);';
    sqls.push(sql2+lastest_id_sql);
    params.push([userId]);
    db.queryWithQueues(sqls, params, callback);
};
// 验证歌单是创建的还是收藏的
Playlist.prototype.checkPlaylistIsOwner = function(userId, callback) {

    var check_sql = 'select is_owner from ' + playlist_user_tb + ' where playlist_id=? and user_id=?';
    db.query(check_sql, [this.id, userId], callback);
};
// 更新歌单信息
Playlist.prototype.updatePlaylist = function(callback) {

    var sql = 'update ignore ' + playlist_tb + ' set playlist_name=?, playlist_info=? where id = ?',
        params = [this.playlist_name, this.playlist_info, this.id];
    db.query(sql, params, callback);
};
// 删除歌单,isOwner===1时删除创建，否则删除收藏的
Playlist.prototype.deletePlaylistById = function(isOwner, userId, callback){

    var sql = '',
        params = [];
    if(isOwner === 1) {
        var delete_playlist_sql = 'delete from ' + playlist_tb + ' where id=?;',
            delete_playlist_user_sql = 'delete from ' + playlist_user_tb + ' where playlist_id=? and user_id=?';
        sql = delete_playlist_sql+delete_playlist_user_sql;
        params = [this.id, this.id, userId];
    } else {
        sql = 'delete from ' + playlist_user_tb + ' where playlist_id=? and user_id=?';
        params = [this.id, userId];
    }

    db.query(sql, params, callback);
};

module.exports = Playlist;
