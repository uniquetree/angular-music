/**
 * 后台: 音乐模型类
 * Created by 郑树聪 on 2016/2/25.
 */
var config = require('../config/config');
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();

var song_tb = config.tableName.song_tb;

var Song = function (songInfo, pagination, keyword) {
    if(typeof songInfo !== 'undefined') {
        this.id = songInfo.id;
        this.name = songInfo.name;
        this.songInfo = songInfo.info;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }

    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};

// 查找singers
Song.prototype.findSongs = function(callback){

    var sql = '',
        count_sql,
        params;

    if(typeof this.keyword !== 'undefined') {
        sql = 'select id, name, info from ' + song_tb + ' where id >= (' +
            'select id from ' + song_tb + ' where name like ? order by id limit ?, 1)' +
            ' and name like ? order by create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + song_tb + ' where name like ?';
        params = [this.keyword, this.currPage*this.pageSize, this.keyword, this.pageSize, this.keyword];
    } else {
        sql = 'select id, name, info from ' + song_tb + ' where id >= (' +
            'select id from ' + song_tb + ' order by id limit ?, 1) order by create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + song_tb;
        params = [this.currPage*this.pageSize, this.pageSize];
    }
    db.query(sql + count_sql, params, callback);
};

// 查找某位singer
Song.prototype.findSongById = function(callback){

    var sql = 'select id, name, info from ' + song_tb + ' where id = ? limit 1';
    db.query(sql, [this.id], callback);
};

// 添加歌手
Song.prototype.addSong = function(callback) {

    var create_time = new Date();
    var sql = 'insert into ' + song_tb + ' (name, info, create_time) values (?, ?, ?)';
    db.query(sql, [this.name, this.info, create_time], callback);
};

// 更新某位singer的信息
Song.prototype.updateSong = function(callback){

    var sql = 'update ' + song_tb + ' set name=?, info=? where id = ?';
    db.query(sql, [this.name, this.info, this.id], callback);
};

// 删除歌手
// ids要删除的歌手的id，数组
Song.prototype.deleteSong = function(ids, callback) {

    var sql = 'delete from ' + song_tb + ' where id in (?)';
    //sql = db.format(sql, [ids]);
    db.query(sql, [ids], callback);
};

module.exports = Song;
