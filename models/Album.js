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
    if(typeof album !== 'undefined') {
        this.id = album.id;
        this.albumName = albumInfo.albumName;
        this.albumInfo = albumInfo.albumInfo;
    }

    if(typeof pagination !== 'undefined') {
        this.currPage = (pagination.currPage-1) || 0;
        this.pageSize = pagination.pageSize || 10;
    }

    if(typeof keyword !== 'undefined' && keyword !== '') {
        this.keyword = '%' + keyword + '%';
    }
};
