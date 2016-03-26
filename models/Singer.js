/**
 * Created by 郑树聪 on 2016/3/26.
 */
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();
var common = new Common();

var singer_tb = 'singers';

var Singer = function (singerInfo, pagination) {
    if(typeof singerInfo !== 'undefined') {
        this.id = singerInfo.id;
        this.singerName = singerInfo.singerName;
        this.singerInfo = singerInfo.singerInfo;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
        this.keyword = pagination.keyword || '';
    }
};

// 查找singers
Singer.prototype.findSingers = function(callback){

    var sql = 'select id, name, info from ' + singer_tb + ' where id >= (' +
        'select id from ' + singer_tb + ' order by id limit ?, 1) order by create_time limit ?;';
    var count_sql = 'select count(*) as totalItems from ' + singer_tb + '';
    db.query(sql + count_sql, [this.currPage*this.pageSize, this.pageSize], callback);
};

// 查找某位singer
Singer.prototype.findSingerById = function(callback){

    var sql = 'select id, name, info from ' + singer_tb + ' where id = ?';
    db.query(sql, [this.id], callback);
};

// 添加歌手
Singer.prototype.addSinger = function(callback) {

    var create_time = new Date();
    var sql = 'insert into ' + singer_tb + '(name, info, create_time) values (?, ?, ?)';
    db.query(sql, [this.singerName, this.singerInfo, create_time], callback);
};

// 更新某位singer的信息
Singer.prototype.updateSinger = function(callback){

    var sql = 'update ' + singer_tb + ' set name=?, info=? where id = ?';
    db.query(sql, [this.singerName, this.singerInfo, this.id], callback);
};

// 删除歌手
// ids要删除的歌手的id，数组
Singer.prototype.deleteSinger = function(ids, callback) {

    var sql = 'delete from ' + singer_tb + ' where id in (?)';
    //sql = db.format(sql, [ids]);
    db.query(sql, [ids], callback);
};

module.exports = Singer;
