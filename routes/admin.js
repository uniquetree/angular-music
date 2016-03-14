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

var menu = require('../models/Menu');

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

module.exports = router;
