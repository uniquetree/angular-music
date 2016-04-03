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

// 根据条件筛选分页查找歌曲
Song.prototype.filterSongsByPage = function(callback){

    var sql,
        count_sql,
        params,
        sql_params1 = [],
        sql_params2 = [],
        sql_filters1 = '',
        sql_filters2 = '';

    // 关键字搜索歌曲名
    if(typeof this.keyword !== 'undefined') {
        sql_filters1 += 'and s1.song_name like ? ';
        sql_filters2 = 'song_name like ? ';
        sql_params1.push(this.keyword);
        sql_params2.push(this.keyword);
    }
    // 根据歌曲语种筛选
    if(typeof this.language !== 'undefined') {
        sql_filters1 += 'and s1.language=? ';

        if(sql_filters2 !== '') {
            sql_filters2 += 'and language=? ';
        } else {
            sql_filters2 += 'language=? '
        }
        sql_params1.push(this.language);
        sql_params2.push(this.language);
    }
    // 根据singer_id查找歌曲
    if(this.singer_id !== 0) {
        sql_filters1 += 'and s1.singer_id=? ';
        if(sql_filters2 !== '') {
            sql_filters2 += 'and singer_id=? ';
        } else {
            sql_filters2 += 'singer_id=? '
        }
        sql_params1.push(this.singer_id);
        sql_params2.push(this.singer_id);
    }
    //根据album_id查找歌曲
    if(this.album_id !== 0) {
        sql_filters1 += 'and s1.album_id=? ';
        if(sql_filters2 !== '') {
            sql_filters2 += 'and album_id=? ';
        } else {
            sql_filters2 += 'album_id=? '
        }
        sql_params1.push(this.album_id);
        sql_params2.push(this.album_id);
    }

    if(sql_filters2 !== '') {
        sql_filters2 = ' where ' + sql_filters2;
    }

    params = sql_params2.concat([this.currPage*this.pageSize]);
    params = params.concat(sql_params1);
    params.push(this.pageSize);
    params = params.concat(sql_params2);

    sql = 'select s1.id, s1.song_name, s1.url, s1.publish_date, s1.listen_count, s1.like_count, s1.singer_id, s1.album_id,' +
        ' s2.singer_name, a.album_name from ' + song_tb + ' as s1 left join ' + singer_tb + ' as s2 on s1.singer_id=s2.id ' +
        'left join ' + album_tb + ' as a on s1.album_id=a.id where s1.id >= (select id from ' + song_tb + sql_filters2 +
        ' order by id limit ?, 1) ' + sql_filters1 + 'order by s1.create_time limit ?;';
    count_sql = 'select count(*) as totalItems from ' + song_tb + sql_filters2;

    db.query(sql + count_sql, params, callback);
};

// 根据id查找歌曲
Song.prototype.findSongById = function(callback){

    var sql = 'select id, song_name, url, publish_date, listen_count, like_count, singer_id, album_id from ' +
        song_tb + ' where id = ? limit 1';
    db.query(sql, [this.id], callback);
};

// 上传添加歌曲
Song.prototype.uploadSong = function(callback) {

    var create_time = new Date();
    var sql = 'insert into ' + song_tb + ' (song_name, url, publish_date, singer_id, album_id, create_time)' +
        ' values (?, ?, ?, ?, ?, ?)';
    db.query(sql, [this.song_name, this.url, this.publish_date, this.singer_id, this.album_id, create_time], callback);
};

// 编辑歌曲基本信息
Song.prototype.updateSong = function(callback){

    var sql = 'update ' + song_tb + ' set song_name=?, publish_date=?, singer_id=?, album_id=? where id = ?';
    db.query(sql, [this.song_name, this.publish_date, this.singer_id, this.album_id, this.id], callback);
};

// 删除歌曲
Song.prototype.deleteSongsByIds = function(ids, callback) {

    var sql = 'delete from ' + song_tb + ' where id in (?)';
    //sql = db.format(sql, [ids]);
    db.query(sql, [ids], callback);
};

module.exports = Song;
