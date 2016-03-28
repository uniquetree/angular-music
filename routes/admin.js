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

// 添加歌手
router.post('/addSinger', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){

    var singerInfo = {
        name: req.body.name,
        info: req.body.info
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
router.post('/getSingerById', function(req, res, next) {

    var singer = new Singer({id: req.body.id});
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
// 更新某位歌手信息
router.post('/updateSinger', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){

    var singerInfo = {
        id: req.body.id,
        name: req.body.name,
        info: req.body.info
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
router.post('/getAlbums', function(req, res) {

});
// 根据id获取专辑信息
router.post('/getAlbumById', function(req, res){

});
// 获取某位歌手的专辑
router.post('/getAlbumBySingerId', function(req, res){

});
router.post('/addAlbum', function(req, res) {

});
router.post('/updateAlbum', function(req, res) {

});
// 根据id删除专辑
router.post('/deleteAlums', function(req, res) {

    var ids = req.body.ids;
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
});

module.exports = router;
