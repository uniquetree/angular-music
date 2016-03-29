/**
 * 后台: 音乐模型类
 * Created by 郑树聪 on 2016/2/25.
 */
var config = require('../config/config');
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();

var song_tb = config.tableName.song_tb;
var singer_tb = config.tableName.singer_tb;
var album_tb = config.tableName.album_tb;

var Song = function (songInfo, pagination, keyword) {
    if(typeof songInfo !== 'undefined') {
        this.id = songInfo.id;
        this.song_name = songInfo.song_name;
        this.url = songInfo.url;
        this.publish_date = songInfo.publish_date;
        this.listen_count = songInfo.listen_count;
        this.like_count = songInfo.like_count;
        this.singer_id = songInfo.singer_id || 0;
        this.album_id = songInfo.album_id || 0;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }

    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};

// 分页查找歌曲
Song.prototype.findSongsByPage = function(callback){

    var sql = '',
        count_sql,
        params;

    if(typeof this.keyword !== 'undefined') {
        sql = 'select s1.id, s1.song_name, s1.url, s1.publish_date, s1.listen_count, s1.like_count, s1.singer_id, s1.album_id,' +
            ' s2.singer_name, a.album_name from ' + song_tb + ' as s1 left join ' + singer_tb + ' as s2 on s1.singer_id=s2.id ' +
            'left join' + album_tb + ' as a on s1.album_id=a.id where s1.id >= (select id from ' + song_tb + ' where' +
            ' song_name like ? order by id limit ?, 1) and s1.song_name like ? order by s1.create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + song_tb + ' where song_name like ?';
        params = [this.keyword, this.currPage*this.pageSize, this.keyword, this.pageSize, this.keyword];
    } else {
        sql = 'select s1.id, s1.song_name, s1.url, s1.publish_date, s1.listen_count, s1.like_count, s1.singer_id, s1.album_id,' +
            ' s2.singer_name, a.album_name from ' + song_tb + ' as s1 left join ' + singer_tb + ' as s2 on s1.singer_id=s2.id ' +
            'left join' + album_tb + ' as a on s1.album_id=a.id where s1.id >= (select id from ' + song_tb + ' where' +
            ' order by id limit ?, 1) order by s1.create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + song_tb;
        params = [this.currPage*this.pageSize, this.pageSize];
    }
    db.query(sql + count_sql, params, callback);
};


// 根据条件筛选歌手
Song.prototype.findAllSongsByFilters = function(callback) {

    var filters = ' where ',
        params = [];

    if(typeof this.singer_type !== 'undefined') {
        filters += 'singer_type=?';
        params.push(this.singer_type);
    }
    if(typeof this.language !== 'undefined') {
        filters += 'language=?';
        params.push(this.language)
    }

    var sql = 'select id, song_name, url, publish_date, listen_count, like_count from ' + song_tb + filters;
    db.query(sql, params, callback);
};

// 根据id查找歌曲
Song.prototype.findSongById = function(callback){

    var sql = 'select id, song_name, url, publish_date, listen_count, like_count, singer_id, album_id from ' +
        song_tb + ' where id = ? limit 1';
    db.query(sql, [this.id], callback);
};

// 根据singer_id查找歌曲
Song.prototype.findSongsBySingerId = function(callback){

    var sql = 'select id, song_name, url, publish_date, listen_count, like_count, singer_id, album_id from ' +
        song_tb + ' where singer_id = ?';
    db.query(sql, [this.singer_id], callback);
};

// 根据album_id查找歌曲
Song.prototype.findSongsByAlbumId = function(callback){

    var sql = 'select id, song_name, url, publish_date, listen_count, like_count, singer_id, album_id from ' +
        song_tb + ' where album_id = ?';
    db.query(sql, [this.album_id], callback);
};

// 添加歌曲
Song.prototype.addSong = function(callback) {

    var create_time = new Date();
    var sql = 'insert into ' + song_tb + ' (song_name, url, publish_date, singer_id, album_id, create_time)' +
        ' values (?, ?, ?, ?, ?, ?)';
    db.query(sql, [this.song_name, this.url, this.publish_date, this.singer_id, this.album_id, create_time], callback);
};

// 编辑歌曲基本信息
Song.prototype.updateSong = function(callback){

    var sql = 'update ' + song_tb + ' set song_name=?, url=?, publish_date=?, singer_id=?, album_id=? where id = ?';
    db.query(sql, [this.song_name, this.url, this.publish_date, this.singer_id, this.album_id, this.id], callback);
};

// 删除歌曲
Song.prototype.deleteSong = function(ids, callback) {

    var sql = 'delete from ' + song_tb + ' where id in (?)';
    //sql = db.format(sql, [ids]);
    db.query(sql, [ids], callback);
};

module.exports = Song;
