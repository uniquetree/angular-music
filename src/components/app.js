/**
 * Created by 郑树聪 on 2016/2/14.
 */

//'use strict';

var $config = require('./Common/config');

/**
 * 处理用户认证
 */
$config.musicApp.factory('AuthenticationService', function(){

    var auth = {
        isAuthenticated: false,
        isAdmin: false
    };
    return auth;
});

$config.musicApp.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        response: function (response) {
            if (response !== null && response.status === 200 &&
                $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        responseError: function(rejection) {
            if (rejection !== null && rejection.status === 401 &&
                ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("/login");
            }

            return $q.reject(rejection);
        }
    };
});

// 配置拦截器
$config.musicApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

$config.musicApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        // 首页,发现音乐
        .when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        // 登录页
        .when("/login", {
            templateUrl: 'app/views/login.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        // 注册页
        .when('/register', {
            templateUrl: 'app/views/register.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        // 未登录提示页
        .when('/unLogin', {
            templateUrl: 'app/views/unLogin.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        // 我的音乐
        .when('/myMusic', {
            templateUrl: 'app/views/myMusic.html',
            controller: 'MyMusicCtrl',
            access: { requiredLogin: true }
        })
        // 管理中心
        .when('/admin', {
            templateUrl: 'app/views/admin.html',
            controller: 'AdminCtrl',
            access: { requiredLogin: true }
        })
        .otherwise({
            redirectTo: "/",
            access: { requiredLogin: false }
        });

}]);

$config.musicApp.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

        // 未登录,跳转到登录页
        if (nextRoute !== null && nextRoute.access !== null && nextRoute.access.requiredLogin &&
            !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            $location.path("/unLogin");
        }
    });
});

// 加载页面angular控制器组件
require('./Common/MainCtrl');
require('./Header/HeaderCtrl');
require('./User/UserCtrl');
require('./MyMusic/MyMusicCtrl');
require('./Admin/AdminCtrl');

module.exports = $config.musicApp;
