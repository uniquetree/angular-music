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

var btoa = require('btoa');
var Common = require('../utils/Common');
var common = new Common();

var Playlist = require('../models/Playlist');

// 分页获取所有歌单
router.get('/filterPlayListsByPage', function(req, res) {

    var playlist = new Playlist();

});
// 获取用户创建的歌单
router.get('/getPlayListsByUserCreate', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    getPlayListsByUserId(userId, 1, res);
});
// 获取用户收藏的歌单
router.get('/getPlayListsByUserCollect', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    getPlayListsByUserId(userId, 0, res);
});
// 创建歌单
router.post('/addPlaylist', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    var playlistInfo = {
        playlist_name: req.body.playlist_name,
        playlist_info: req.body.playlist_info
    };
    var playlist = new Playlist(playlistInfo);
    playlist.addPlaylist(userId, function(isError, results) {

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
// 更新歌单信息
router.post('/updatePlaylist', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    var playlistInfo = {
        id: req.body.id,
        playlist_name: req.body.playlist_name,
        playlist_info: req.body.playlist_info
    };
    var playlist = new Playlist(playlistInfo);

    playlist.checkPlaylistIsOwner(userId, function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {

            var isOwner = 0;
            if(results.length > 0) {
                isOwner = results[0].is_owner;
            }
            if(isOwner === 1) {
                playlist.updatePlaylist(function(isError, results) {

                    if(isError) {
                        res.send(500);
                        console.log(results.message);
                    } else {
                        res.json({
                            success: true
                        });
                    }
                });
            } else {
                res.json({
                    success: false,
                    msg: '该歌单并非由此用户创建'
                });
            }
        }
    });
});
// 删除歌单
router.post('/deletePlaylistById', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    var userId = req.user.pid;
    var playlistInfo = {
        id: req.body.id
    };
    var playlist = new Playlist(playlistInfo);
    playlist.checkPlaylistIsOwner(userId, function(isError, results) {

        if(isError) {
            res.send(500);
            console.log(results.message);
        } else {

            var isOwner = 0;
            if(results.length > 0) {
                isOwner = results[0].is_owner;
            }
            playlist.deletePlaylistById(isOwner, userId, function(isError, results) {

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


// 获取用户的歌单（创建的、收藏的）
function getPlayListsByUserId(userId, isOwner, res) {
    var playlist = new Playlist();
    playlist.getPlayListsByUserId(userId, isOwner, function(isError, results) {

        if(isError){
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                playlists: results
            });
        }
    });
}
