/**
 * 歌曲路由
 * Created by 郑树聪 on 2016/4/1.
 */
var Q = require('q');
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;

var router = express.Router();

var common = require('../utils/Common');

var Singer = require('../models/Singer');
var Album = require('../models/Album');
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
// 获取某张歌单歌曲
router.get('/getSongsByPlaylistId', function(req, res) {

    var playlistId = req.query.playlistId;
    var song = new Song();
    song.getSongsByPlaylistId(playlistId, function(isError, results) {

        if(isError){
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                playlist_songs: results
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

    var owner_pid = req.user.pid;

    var promise = common.uploadMp3(req);
    promise.then(function(fields) {
        return common.getMp3Tags(fields);
    }).then(function(tags){

        var songInfo = {
            song_name: tags.name,
            url: tags.url,
            size: tags.size,
            publish_date: tags.year ? new Date(tags.year): null,
            song_img: tags.song_img,
            language: tags.language,
            singer_id: tags.singer_id,
            album_id: tags.album_id,
            owner_pid: owner_pid
        };
        //若未传歌手id且mp3文件的id3标签歌手名不为空，则新建歌手，否则直接添加歌曲，歌手idhe专辑id都设置默认未知0
        if((typeof tags.singer_id === 'undefined' || tags.singer_id === 'undefined') && tags.tag_singer_name) {

            var singerInfo = {
                singer_name: tags.tag_singer_name,
                language: tags.language,
                singer_info: '默认歌手信息'
            };
            // 添加歌手
            return singerPromise('addSinger', singerInfo).then(function(){

                // 查找新建的歌手的id
                return singerPromise('findSingerIdByFilters', singerInfo).then(function(data){

                    songInfo.singer_id = data[0].id;
                    // 若若未传专辑id且mp3文件的id3标签专辑名不为空，则新建标签，否则直接添加歌曲，专辑id设置默认未知0
                    if((typeof tags.album_id === 'undefined' || tags.album_id === 'undefined') && tags.tag_album_name) {
                        var albumInfo = {
                            singer_id: data[0].id,
                            album_name: tags.tag_album_name,
                            publish_date: tags.year ? new Date(tags.year): null
                        };
                        // 添加专辑
                        return albumPromise('addAlbum', albumInfo).then(function(result) {

                            if(result[1][0]['LAST_INSERT_ID()'] !== 0) {
                                songInfo.album_id = result[1][0]['LAST_INSERT_ID()'];
                                return songPromise('uploadSong', songInfo);
                            } else {
                                return albumPromise('findAlbumIdByFilters', albumInfo).then(function(data){

                                    songInfo.album_id = data[0].id;
                                    // 添加歌曲
                                    return songPromise('uploadSong', songInfo);
                                });
                            }
                        });
                    } else {
                        return songPromise('uploadSong', songInfo);
                    }
                });
            });
        } else {

            return songPromise('uploadSong', songInfo);
        }
    }).then(function(data) {

        res.json({
            success: true
        })
    }, function(err) {
        res.sendStatus(500);
        console.log(err);
    });
});
// 收藏歌曲到歌单
router.post('/collectSong', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    if(typeof req.body.playlistId === 'undefined' || typeof req.body.songId === 'undefined') {
        res.json({
            success: false,
            msg: '缺少专辑id或歌曲id'
        });
        return;
    }

    var userId = req.user.pid;
    var playlistInfo = {
        id: req.body.playlistId
    };
    common.checkPlaylistIsOwner(userId, playlistInfo).then(function(isOwner) {
        // 若是用户自建歌单则收藏
        if(isOwner === 1) {
            var songInfo = {
                id: req.body.songId
            };
            var song = new Song(songInfo);
            song.collectSong(playlistInfo.id, function(isError, results) {

                if(isError) {
                    res.sendStatus(500);
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
                msg: '该歌单并非由用户自建'
            });
        }
    }, function(error) {
        res.sendStatus(500);
        console.log(error);
    });
});
// 取消收藏歌曲到歌单
router.post('/cancelCollectSong', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res) {

    if(typeof req.body.playlistId === 'undefined' || typeof req.body.songId === 'undefined') {
        res.json({
            success: false,
            msg: '缺少专辑id或歌曲id'
        });
        return;
    }

    var userId = req.user.pid;
    var playlistInfo = {
        id: req.body.playlistId
    };
    common.checkPlaylistIsOwner(userId, playlistInfo).then(function(isOwner) {
        // 若是用户自建歌单则收藏
        if(isOwner === 1) {
            var songInfo = {
                id: req.body.songId
            };
            var song = new Song(songInfo);
            song.cancelCollectSong(playlistInfo.id, function(isError, results) {

                if(isError) {
                    res.sendStatus(500);
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
                msg: '该歌单并非由用户自建'
            });
        }
    }, function(error) {
        res.sendStatus(500);
        console.log(error);
    });
});

module.exports = router;


function singerPromise(action, singerInfo, callback) {

    var deferred = Q.defer();
    var singer = new Singer(singerInfo);
    singer[action](function(isError, result) {

        if (isError) {
            deferred.reject(result.message);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise.nodeify(callback);
}

function albumPromise(action, albumInfo, callback) {

    var deferred = Q.defer();
    var album = new Album(albumInfo);
    album[action](function(isError, result) {

        if (isError) {
            deferred.reject(result.message);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise.nodeify(callback);
}

function songPromise(action, songInfo, callback) {

    var deferred = Q.defer();
    var song = new Song(songInfo);
    song[action](function(isError, result) {

        if (isError) {
            deferred.reject(result.message);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise.nodeify(callback);
}
