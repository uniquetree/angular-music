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

router.post('/updateUserInfo', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){

    var userInfo = req.body.userInfo;
    if(typeof userInfo.password === 'undefined') {
        var token = tokenManager.getToken(req.headers);
        if(token) {
            try {
                var decoded = jwt.verify(token, secretToken);
                userInfo.password = decoded.password;
            } catch(err) {
                return next();
            }
        } else {
            next();
        }
    }
    var user = new User(userInfo);
    var oldEmail = userInfo.email;
    user.update(userInfo.email, function(isError, results) {
        if(isError){
            res.send(500);
        } else {
            res.json({
                success: true
            });
        }
    });
});

module.exports = router;
