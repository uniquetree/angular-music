/**
 * Created by 郑树聪 on 2016/3/11.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;
var adminMenus = require('../config/config').adminMenus;

var router = express.Router();

var User = require('../models/User');
var Singer = require('../models/Singer');

var Db = require('../utils/Db');
var db = new Db();

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
router.post('/addSinger', function(req, res, next){

    var singerInfo = {
        singerName: req.body.singerName,
        singerInfo: req.body.singerInfo
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
// 获取歌手列表
router.post('/getSingers', function(req, res, next) {

    var pagination = {
        currPage: Number(req.body.currPage),
        pageSize: Number(req.body.pageSize),
        keyword: req.body.keyword
    };
    var singer = new Singer({}, pagination);
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
        singerName: req.body.singerName,
        singerInfo: req.body.singerInfo
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
            res.json({
                success: true
            });
        }
    });
});

module.exports = router;
