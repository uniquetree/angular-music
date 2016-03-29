/**
 * 后台歌手singer模型
 * Created by 郑树聪 on 2016/3/26.
 */
var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();

var singer_tb = 'singers';

var Singer = function (singerInfo, pagination, keyword) {
    if(typeof singerInfo !== 'undefined') {
        this.id = singerInfo.id;
        this.singer_name = singerInfo.singer_name;
        this.singer_info = singerInfo.singer_info;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }

    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};

Singer.prototype.findAllSingers = function(callback) {

    var sql = 'select id, singer_name from ' + singer_tb;
    db.query(sql, [], callback);
};

// 查找singers
Singer.prototype.findSingers = function(callback){

    var sql = '',
        count_sql,
        params;

    if(typeof this.keyword !== 'undefined') {
        sql = 'select id, singer_name, singer_info from ' + singer_tb + ' where id >= (' +
            'select id from ' + singer_tb + ' where singer_name like ? order by id limit ?, 1)' +
            ' and singer_name like ? order by create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + singer_tb + ' where singer_name like ?';
        params = [this.keyword, this.currPage*this.pageSize, this.keyword, this.pageSize, this.keyword];
    } else {
        sql = 'select id, singer_name, singer_info from ' + singer_tb + ' where id >= (' +
            'select id from ' + singer_tb + ' order by id limit ?, 1) order by create_time limit ?;';
        count_sql = 'select count(*) as totalItems from ' + singer_tb;
        params = [this.currPage*this.pageSize, this.pageSize];
    }
    db.query(sql + count_sql, params, callback);
};

// 查找某位singer
Singer.prototype.findSingerById = function(callback){

    var sql = 'select id, singer_name, singer_info from ' + singer_tb + ' where id = ? limit 1';
    db.query(sql, [this.id], callback);
};

// 添加歌手
Singer.prototype.addSinger = function(callback) {

    var create_time = new Date();
    var sql = 'insert into ' + singer_tb + ' (singer_name, singer_info, create_time) values (?, ?, ?)';
    db.query(sql, [this.singer_name, this.singer_info, create_time], callback);
};

// 更新某位singer的信息
Singer.prototype.updateSinger = function(callback){

    var sql = 'update ' + singer_tb + ' set singer_name=?, singer_info=? where id = ?';
    db.query(sql, [this.singer_name, this.singer_info, this.id], callback);
};

// 删除歌手
// ids要删除的歌手的id，数组
Singer.prototype.deleteSinger = function(ids, callback) {

    var sql = 'delete from ' + singer_tb + ' where id in (?)';
    //sql = db.format(sql, [ids]);
    db.query(sql, [ids], callback);
};

module.exports = Singer;
