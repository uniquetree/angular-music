var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var ejs = require('ejs');

var routes = require('./routes/index');
var user = require('./routes/user');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'bower_components')));

//设置当站内路径(req.path)不包括 /api 时，都转发到 AngularJS的ng-app(index.html)
//app.use(function (req, res) {
//    console.log(req.path);
//    if(req.path.indexOf('/api') >= 0){
//        res.send("server text");
//
//    }else{ //angular启动页
//        //res.sendfile('app/index.html');
//        res.render('index');
//    }
//});

// 路由配置
app.use('/', routes);
app.use('/user', user);
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('views/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('views/error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
