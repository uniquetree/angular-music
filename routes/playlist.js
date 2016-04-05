/**
 * 歌单相关接口
 * Created by 郑树聪 on 2016/4/6.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;

var router = express.Router();

var Playlist = require('../models/Playlist');

// 获取所有专辑
router.get('/filterPlayListsByPage', function(req, res) {

    var playlist = new Playlist();

});
// 获取用户创建的歌单
router.get('/getPlayListsByUserCreate', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    getPlayListsByUserId(userId, 1, res);
});
// 获取用户收藏的歌单
router.get('/getPlayListsByUserGet', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    getPlayListsByUserId(userId, 0, res);
});
// 创建歌单
router.post('/addPlaylist', function(req, res) {

    var playlistInfo = {
        playlist_name: req.body.playlist_name,
        playlist_info: req.body.playlist_info
    };
    var playlist = new Playlist(playlistInfo);
    playlist.addPlaylist(function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {
            var playlistId = results[1][0]['LAST_INSERT_ID()'];
            if(playlistId === 0) {
                res.json({
                    success: false,
                    msg: '歌单已存在'
                });
            } else {
                var userId = req.user.pid;
                playlist.addPlaylistWithUserId(userId, playlistId, 1, function(isError, results) {
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
        }
    });
});

// 获取用的歌单（创建的、收藏的）
function getPlayListsByUserId(userId, isOwner, res) {
    var playlist = new Playlist();
    playlist.getPlayListsByUserId(userId, isOwner, function(isError, results) {

        if(isError){
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                playlist: results
            });
        }
    });
}

module.exports = router;
