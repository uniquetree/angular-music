/**
 * Created by 郑树聪 on 2016/2/14.
 */

//'use strict';

// 定义musicApp应用
var musicApp = angular.module('musicApp', ['ngRoute', 'ui.bootstrap']);

musicApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        // 首页
        .when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'LoginController'
        })
        // 后台管理首页
        .when('/admin', {
            templateUrl: 'app/views/admin.html',
            controller: 'adminCtrl'
        })
        // 登录页
        .when("/login", {
            templateUrl: 'app/views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'app/views/signup.html',
            controller: 'signupCtrl'
        })
        .otherwise({
            redirectTo: "/"
        });

    //启动HTML5模式的，URL中不会包括一个#号
    //不启动时,用来区别是AngularJS管理的路径还是WebServer管理的路径
    //$locationProvider.html5Mode(true);
}]);

// 加载angular控制器
musicApp.controller('LoginController', require('./login/LoginController.js'));

module.exports = musicApp;
