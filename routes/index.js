var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: '基于AngularJS的在线音乐网站' });
    //res.sendfile('./app/index.html');
});

module.exports = router;
