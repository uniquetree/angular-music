var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// 设置模板渲染引擎及路径
app.set('views', path.join(__dirname, 'app/views'));
app.engine('html', require("ejs").__express);
app.set('view engine', 'html');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置静态资源访问路径
app.use('/app', express.static(path.join(__dirname, 'app')));
//app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

// 路由配置
var routes = require('./routes/index'),
    routesUser = require('./routes/user'),
    routesAdmin = require('./routes/admin'),
    routesSinger = require('./routes/singer'),
    routesAlbum = require('./routes/album'),
    routesSong = require('./routes/song'),
    routesPlaylist = require('./routes/playlist');
app.use('/', routes);
app.use('/api/user', routesUser);
app.use('/api/admin', routesAdmin);
app.use('/api/singer', routesSinger);
app.use('/api/album', routesAlbum);
app.use('/api/song', routesSong);
app.use('/api/playlist', routesPlaylist);

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
        res.render('Templates/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('Templates/error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
