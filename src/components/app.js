/**
 * Created by 郑树聪 on 2016/2/14.
 */

//'use strict';

var $config = require('./Common/config');

$config.musicApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
}]);

/**
 * 用户认证服务
 */
$config.musicApp.factory('AuthenticationService', function(){

    var auth = {
        isAuthenticated: false,
        isAdmin: false
    };
    return auth;
});

/**
 * http请求拦截器，在请求头增加验证
 */
$config.musicApp.factory('TokenInterceptor', function ($rootScope, $q, $window, $location, AuthenticationService) {
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
                $window.sessionStorage.clear();
                AuthenticationService.isAuthenticated = false;
                $rootScope.prevUrl = $location.url();
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
            templateUrl: 'app/views/Home/home.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        .when('/discover:subPage', {
            templateUrl: 'app/views/Home/home.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        // 登录页
        .when("/login", {
            templateUrl: 'app/views/User/login.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        // 注册页
        .when('/register', {
            templateUrl: 'app/views/User/register.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        // 我的音乐
        .when('/myMusic', {
            templateUrl: 'app/views/MyMusic/myMusic.html',
            controller: 'MyMusicCtrl',
            reloadOnSearch: false,
            access: { requiredLogin: true },
            ignoreLoadingBar: true
        })
        // 管理中心
        .when('/admin', {
            templateUrl: 'app/views/Admin/admin.html',
            controller: 'AdminCtrl',
            //reloadOnSearch: false,
            access: { requiredLogin: true },
            ignoreLoadingBar: true
        })
        // 歌手主页
        .when('/singer', {
            templateUrl: 'app/views/Home/home.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        .otherwise({
            redirectTo: "/",
            access: { requiredLogin: false }
        });
}]);

$config.musicApp.run(function($rootScope, $location, $window, AuthenticationService) {

    $rootScope.defaultSongImg = $config.default_song_img;

    // 监听路由变化，进行相应处理
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

        // 未登录,跳转到登录页
        if (nextRoute !== null && !angular.isUndefined(nextRoute.access) && nextRoute.access !== null &&
            nextRoute.access.requiredLogin && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            // 未登录时将原先要跳转到的url的存到全局变量prevUrl
            $rootScope.prevUrl = nextRoute.originalPath;
            $location.path("/login");
        }
    });
});

// 加载页面angular控制器组件
require('./Common/MainCtrl');
require('./Header/HeaderCtrl');
require('./User/UserCtrl');
require('./MyMusic/MyMusicCtrl');
require('./Admin/AdminCtrl');
