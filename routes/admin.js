/**
 * Created by 郑树聪 on 2016/3/11.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

//var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;
var adminMenus = require('../config/config').adminMenus;

var router = express.Router();

var User = require('../models/User');
var Singer = require('../models/Singer');
var Album = require('../models/Album');
var Song = require('../models/Song');

var Db = require('../utils/Db');
var Common = require('../utils/Common');
var db = new Db();
var common = new Common();

// 根据用户类型获取管理中心侧边栏菜单
router.get('/getMenuByRole', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next) {
    var token = tokenManager.getToken(req.headers);
    if(token) {
        try {
            var decoded = jwt.verify(token, secretToken);
            var role = decoded.role;
            var menus = [];
            adminMenus.forEach(function(menu) {
                if(menu.role >= role) {
                    menu.isMenuOpen = false;
                    var subMenus = menu.subMenus;
                    menu.subMenus = [];
                    for(var i=0; i < subMenus.length; i++){
                        if (subMenus[i].role >= role) {
                            menu.subMenus.push(subMenus[i]);
                        }
                    }
                    menus.push(menu);
                }
            });
            return res.json({
                success: true,
                menus: menus
            });
        } catch(err) {
            return next();
        }
    } else {
        next();
    }
});

// 获取省份、城市、地区数据
router.get('/getAreas', function(req, res, next) {

    var sql = 'select * from nation';
    db.query(sql, [], function(isError, results){
        if(isError){
            res.send(500);
            console.log(results.message);
        } else {
            res.json({
                success: true,
                areas: results
            });
        }
    });
});

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


// 分页获取专辑列表，关键字查找
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


// 分页获取歌曲
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
// 根据筛选条件获取歌曲
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
// 上传歌曲
router.post('/uploadSong', function(req, res) {

    var songInfo = {
        song_name: req.body.song_name,
        url: req.body.url,
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
});
// 编辑歌曲基本信息
router.post('/updateSong', function(req, res) {

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
router.post('/deleteSongsByIds', function(req, res) {

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

module.exports = router;
