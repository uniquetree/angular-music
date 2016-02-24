/**
 * 接口路由
 * Created by 郑树聪 on 2016/2/18.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/User');
var music = require('../models/Music');

router.post('/login', function(req, res, next) {

    var user = new User();
    var email = req.body.email;                //获取post上来的data数据中email的值
    user.findOne(email, function(isError, results){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(isError){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
        }else if(!results){                                 //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            res.send(404);                            //    状态码返回404
        }else{
            if(req.body.upwd != results.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = '密码错误';
                res.send(404);
                res.send({
                    succuss: 'false',
                    msg: '密码错误'
                });
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = results;
                res.send(200);
            }
        }
    });
});

module.exports = router;
