/**
 * 歌手路由
 * Created by 郑树聪 on 2016/4/1.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;

var router = express.Router();

var Singer = require('../models/Singer');

// 获取所有歌手的id、name
router.get('/getAllSingers', function(req, res) {

    var singer = new Singer();
    singer.findAllSingers(function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                allSingers: results
            });
        }
    });
});
// 分页获取歌手列表，关键字查找
router.get('/getSingers', function(req, res, next) {

    var pagination = {
        currPage: Number(req.query.currPage),
        pageSize: Number(req.query.pageSize)
    };
    var keyword = req.query.keyword;
    var singer = new Singer({}, pagination, keyword);
    singer.findSingers(function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                singers: results[0],
                totalItems: results[1][0].totalItems,
                currPage: pagination.currPage,
                pageSize: pagination.pageSize
            });
        }
    });
});
// 根据id获取某位歌手信息
router.get('/getSingerById', function(req, res, next) {

    var singer = new Singer({id: req.query.id});
    singer.findSingerById(function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                singer: results[0]
            });
        }
    });
});
// 添加歌手
router.post('/addSinger', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){

    var singerInfo = {
        singer_name: req.body.singer_name,
        singer_type: req.body.singer_type,
        language: req.body.language,
        singer_info: req.body.singer_info
    };
    var singer = new Singer(singerInfo);
    singer.addSinger(function(isError, results) {

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
// 更新某位歌手信息
router.post('/updateSinger', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){

    var singerInfo = {
        id: req.body.id,
        singer_name: req.body.singer_name,
        singer_type: req.body.singer_type,
        language: req.body.language,
        singer_info: req.body.singer_info
    };
    var singer = new Singer(singerInfo);
    singer.updateSinger(function(isError, results) {

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
// 删除歌手
router.post('/deleteSingers', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){

    var ids = req.body.ids;
    var singer = new Singer();
    singer.deleteSinger(ids, function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {

            // 同时删除歌手的专辑
            var album = new Album();
            album.deleteAlbumBySingerId(ids, function(isError, results) {
                if(isError) {
                    res.send(500);
                    console.log(results.message);
                } else {
                    res.json({
                        success: true
                    });
                }
            });
        }
    });
});

module.exports = router;
