var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/**
 * 用户注册
 */
router.route('/register').get(function(req, res) {

}).post(function(req, res){
    var email = req.params.email;
    var pwd = req.params.pwd;
    var user = new User();
    user.create(email)
});

/**
 * 用户登录
 */
//router.get('/login', function(req, res){
//
//});

/**
 * 用户登出
 */
router.post('/logout', function(req, res){

});

/**
 * 获取用户信息
 */
router.get('/get',function(req,res){
    var userid = req.query.userid;
    var user = new User();
    user.find(userid,function(err,result){
        if(err){
            res.send('not found');
        }
        res.send(result.length === 1 ? result[0]:result);
    });
});

module.exports = router;
