/**
 * 专辑模型
 * Created by 郑树聪 on 2016/3/28.
 */
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();
var common = new Common();

var album_tb = 'albums';

var Album = function (albumInfo, pagination, keyword) {
    if(typeof albumInfo !== 'undefined') {
        this.id = albumInfo.id;
        this.albumName = albumInfo.albumName;
        this.info = albumInfo.info;
        this.publishDate = albumInfo.publishDate;
        this.singerId = albumInfo.singerId;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }

    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};

// 分页查找专辑
Album.prototype.findAlbums = function(callback){

    var sql,
        count_sql,
        params;

    if(typeof this.keyword !== 'undefined') {
        sql = 'select id, album_name, info, publish_date, singer_id from ' + album_tb + ' where id >= (' +
            'select id from ' + album_tb + ' where name like ? order by id limit ?, 1) and ' +
            'name like ? order by create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + album_tb + ' where name like ?';
        params = [this.keyword, this.currPage*this.pageSize, this.keyword, this.pageSize, this.keyword];
    } else {
        sql = 'select id, album_name, info, publish_date, singer_id from ' + album_tb + ' where id >= (' +
            'select id from ' + album_tb + ' order by id limit ?, 1) order by create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + album_tb;
        params = [this.currPage*this.pageSize, this.pageSize];
    }
    db.query(sql + count_sql, params, callback);
};

// 根据id查找某张专辑
Album.prototype.findAlbumById = function(callback){

    var sql = 'select id, album_name, info, publish_date, singer_id from ' + album_tb + ' where id = ? limit 1';
    var params = [this.id];
    db.query(sql, params, callback);
};

// 根据歌手id查找某位歌手的所有专辑
Album.prototype.findAlbumsBySingerId = function(callback){

    var sql = 'select id, album_name, info, publish_date, singer_id from ' + album_tb + ' where singer_id = ?';
    var params = [this.singerId];
    db.query(sql, params, callback);
};

// 添加一张新专辑
Album.prototype.addAlbum = function(callback) {

    var sql,
        params,
        create_time = new Date();

    sql = 'insert into ' + album_tb + '(album_name, info, publish_date, create_time, singer_id) values (?, ?, ?, ?, ?)';
    params = [this.albumName, this.info, this.publishDate, create_time, this.singerId];
    db.query(sql, params, callback);
};

// 更新某张专辑的信息
Album.prototype.updateAlbum = function(callback){

    var sql = 'update ' + album_tb + ' set album_name=?, info=?, publish_date=?, singer_id=? where id = ?';
    db.query(sql, [this.albumName, this.info, this.publishDate, this.singerId, this.id], callback);
};

// 删除专辑，ids要删除的专辑的id，数组
Album.prototype.deleteAlumsById = function(ids, callback) {

    var sql = 'delete from ' + album_tb + ' where id in (?)';
    db.query(sql, [ids], callback);
};

// 删除某歌手专辑，ids要删除的专辑的歌手id，数组
Album.prototype.deleteAlbumsBySingerId = function(ids, callback) {

    var sql = 'delete from ' + album_tb + ' where singer_id in (?)';
    var params = [ids];
    db.query(sql, params, callback);
};

module.exports = Album;
