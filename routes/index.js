var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    res.sendfile('../app/index.html');
});

/* GET admin home page. */
router.get('/admin', function(req, res, next) {
    res.sendfile('../app/admin.html');
});

module.exports = router;
