/**
 * 歌曲路由
 * Created by 郑树聪 on 2016/4/1.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;

var router = express.Router();

var Common = require('../utils/Common');
var common = new Common();

var Song = require('../models/Song');

// 根据条件筛选分页查找歌曲
router.get('/getSongsByPage', function(req, res) {

    var songInfo = {
        language: req.query.language,
        singer_id: req.query.singer_id,
        album_id: req.query.album_id
    };
    var pagination = {
        currPage: Number(req.query.currPage) || 1,
        pageSize: Number(req.query.pageSize) || 10
    };
    var keyword = req.query.keyword;

    var song = new Song(songInfo, pagination, keyword);
    song.filterSongsByPage(function(isError, results) {
        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                songs: results[0],
                totalItems: results[1][0].totalItems,
                currPage: pagination.currPage,
                pageSize: pagination.pageSize
            });
        }
    });

});
// 根据id获取歌曲
router.get('/getSongById', function(req, res) {

    var songInfo = {
        id: req.query.id
    };
    var song = new Song(songInfo);
    song.findSongById(function(isError, result) {

        if(isError) {
            res.send(500);
            console.log(result.message);
        } else {
            res.json({
                success: true,
                song: result[0]
            })
        }
    });
});
// 编辑歌曲基本信息
router.post('/updateSong', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var songInfo = {
        id: req.body.id,
        song_name: req.body.song_name,
        url: req.body.url,
        publish_date: req.body.publish_date,
        singer_id: req.body.singer_id,
        album_id: req.body.album_id
    };
    var song = new Song(songInfo);
    song.updateSong(function(isError, result) {

        if(isError) {
            res.send(500);
            console.log(result.message);
        } else {
            res.json({
                success: true
            });
        }
    });
});
// 删除歌曲
router.post('/deleteSongsByIds', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var ids = req.body.ids;
    var song = new Song();
    song.deleteSongsByIds(ids, function(isError, result) {

        if(isError) {
            res.send(500);
            console.log(result.message);
        } else {
            res.json({
                success: true
            });
        }
    });
});
// 上传歌曲
router.post('/uploadSongs', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    common.uploadMp3(req, function(err, fields){

        if(!err) {
            var songInfo = {
                song_name: fields.name,
                url: fields.path,
                publish_date: req.body.publish_date,
                singer_id: req.body.singer_id,
                album_id: req.body.album_id
            };
            var song = new Song(songInfo);
            song.uploadSong(function(isError, result) {

                if(isError) {
                    res.send(500);
                    console.log(result.message);
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
