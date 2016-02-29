/**
 * Created by 郑树聪 on 2016/2/14.
 */

//'use strict';

var $config = require('./Config/config');

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

$config.musicApp.factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                config.body.access_token = $window.sessionStorage.token;
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
                $location.path("/");
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
        // 首页
        .when('/', {
            templateUrl: 'app/views/home.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        // 后台管理首页
        .when('/admin', {
            templateUrl: 'app/views/admin.html',
            controller: 'adminCtrl',
            access: { requiredLogin: true }
        })
        // 登录页
        .when("/login", {
            templateUrl: 'app/views/login.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        .when('/register', {
            templateUrl: 'app/views/register.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false }
        })
        .otherwise({
            redirectTo: "/",
            access: { requiredLogin: false }
        });

}]);

$config.musicApp.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

        if (nextRoute !== null && nextRoute.access !== null && nextRoute.access.requiredLogin &&
            !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            $location.path("/");
        }
    });
});

// 加载angular页面组件
require('./User/UserCtrl');

module.exports = $config.musicApp;
