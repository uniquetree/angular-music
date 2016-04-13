/**
 * 专辑路由
 * Created by 郑树聪 on 2016/4/1.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;

var router = express.Router();

var Album = require('../models/Album');

// 获取所有专辑
router.get('/getAllAlbums', function(req, res) {

    var album = new Album();
    album.getAllAlbums(function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                albums: results
            })
        }
    });
});
// 分页获取专辑列表,可关键字搜索（模糊匹配专辑名）
router.get('/getAlbums', function(req, res) {

    var pagination = {
        currPage: Number(req.query.currPage),
        pageSize: Number(req.query.pageSize)
    };
    var keyword = req.query.keyword;
    var album = new Album({}, pagination, keyword);
    album.findAlbums(function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                albums: results[0],
                totalItems: results[1][0].totalItems,
                currPage: pagination.currPage,
                pageSize: pagination.pageSize
            });
        }
    });
});
// 根据id获取专辑信息
router.get('/getAlbumById', function(req, res){

    var album = new Album({id: req.query.id});
    album.findAlbumById(function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                album: results[0]
            });
        }
    });
});
// 获取某位歌手的专辑
router.get('/getAlbumsBySingerId', function(req, res){

    var album = new Album({singer_id: req.query.singer_id});
    album.findAlbumsBySingerId(function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                albums: results
            });
        }
    });
});
// 添加专辑
router.post('/addAlbum', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var albumInfo = {
        album_name: req.body.album_name,
        album_info: req.body.album_info,
        publish_date: req.body.publish_date,
        singer_id: req.body.singer_id
    };
    var album = new Album(albumInfo);
    album.addAlbum(function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true
            });
        }
    });
});
// 更新专辑信息
router.post('/updateAlbum', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var albumInfo = {
        id: req.body.id,
        album_name: req.body.album_name,
        album_info: req.body.album_info,
        publish_date: req.body.publish_date,
        singer_id: req.body.singer_id
    };
    var album = new Album(albumInfo);
    album.updateAlbum(function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true
            });
        }
    });
});
// 根据id删除专辑
router.post('/deleteAlumsById', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var ids = req.body.ids;
    // 同时删除歌手的专辑
    var album = new Album();
    album.deleteAlumsById(ids, function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true
            });
        }
    });
});
// 根据歌手id删除专辑
router.post('/deleteAlbumsBySingerId', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var singerIds = req.body.singerIds;
    // 同时删除歌手的专辑
    var album = new Album();
    album.deleteAlbumsBySingerId(singerIds, function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true
            });
        }
    });
});

module.exports = router;
