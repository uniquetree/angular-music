/**
 * Created by 郑树聪 on 2016/2/14.
 */

//'use strict';

var $config = require('./Common/config');

var musicApp = $config.musicApp;

musicApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
}]);

/**
 * 用户认证服务
 */
musicApp.factory('AuthenticationService', function(){

    var auth = {
        isAuthenticated: false,
        isAdmin: false
    };
    return auth;
});
/**
 * http请求拦截器，在请求头增加验证
 */
musicApp.factory('TokenInterceptor', function ($rootScope, $q, $window, $location, AuthenticationService) {
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
musicApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

musicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/admin', '/admin/userInfo');
    $urlRouterProvider.when('/admin/singers', '/admin/singers/singerList');
    $urlRouterProvider.when('/admin/albums', '/admin/albums/albumList');
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: '',
            templateUrl: 'app/views/Home/home.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        .state('home.topList', {
            url: '/',
            templateUrl: 'app/views/Home/views/home.topList.html',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        .state('home.playlist', {
            url: '/playlist',
            templateUrl: 'app/views/Home/views/home.playlist.html',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        .state('home.singer', {
            url: '/singer',
            templateUrl: 'app/views/Home/views/home.singer.html',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })

        .state('register', {
            url: '/register',
            templateUrl: 'app/views/User/register.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })
        .state('login', {
            url: '/login',
            templateUrl: 'app/views/User/login.html',
            controller: 'UserCtrl',
            access: { requiredLogin: false },
            ignoreLoadingBar: true
        })

        .state('myMusic', {
            url: '/myMusic',
            templateUrl: 'app/views/MyMusic/myMusic.html',
            controller: 'MyMusicCtrl',
            reloadOnSearch: false,
            access: { requiredLogin: true },
            ignoreLoadingBar: true
        })

        .state('admin', {
            url: '/admin',
            templateUrl: 'app/views/Admin/admin.html',
            controller: 'AdminCtrl',
            //reloadOnSearch: false,
            access: { requiredLogin: true },
            ignoreLoadingBar: true
        })

        .state('admin.userInfo', {
            url: '/userInfo',
            templateUrl: 'app/views/Admin/views/admin.userInfo.html',
            access: { requiredLogin: true }
        })
        .state('admin.editInfo', {
            url: '/editInfo',
            templateUrl: 'app/views/Admin/views/admin.editInfo.html',
            access: { requiredLogin: true }
        })

        .state('admin.singers', {
            url: '/singers',
            templateUrl: 'app/views/Admin/views/admin.singers.html',
            access: { requiredLogin: true }
        })
        .state('admin.singers.singerList', {
            url: '/singerList',
            templateUrl: 'app/views/Admin/views/admin.singers.singerList.html',
            access: { requiredLogin: true }
        })
        .state('admin.singers.addSinger', {
            url: '/addSinger',
            templateUrl: 'app/views/Admin/views/admin.singers.singerHandle.html',
            access: { requiredLogin: true }
        })
        .state('admin.singers.editSinger', {
            url: '/editSinger/:singerId',
            templateUrl: 'app/views/Admin/views/admin.singers.singerHandle.html',
            access: { requiredLogin: true }
        })

        .state('admin.albums', {
            url: '/albums',
            templateUrl: 'app/views/Admin/views/admin.albums.html',
            access: { requiredLogin: true }
        })
        .state('admin.albums.albumList', {
            url: '/albumList',
            templateUrl: 'app/views/Admin/views/admin.albums.albumList.html',
            access: { requiredLogin: true }
        })
        .state('admin.albums.addAlbum', {
            url: '/addAlbum',
            templateUrl: 'app/views/Admin/views/admin.albums.albumHandle.html',
            access: { requiredLogin: true }
        })
        .state('admin.albums.editAlbum', {
            url: '/editAlbum/:albumId',
            templateUrl: 'app/views/Admin/views/admin.albums.albumHandle.html',
            access: { requiredLogin: true }
        })

        .state('admin.songs', {
            url: '/songs',
            templateUrl: 'app/views/Admin/views/admin.songs.html',
            access: { requiredLogin: true }
        })

        .state('admin.uploadMusic', {
            url: '/uploadMusic',
            templateUrl: 'app/views/Admin/views/admin.uploadMusic.html',
            access: { requiredLogin: true }
        })

        .state('admin.users', {
            url: '/users',
            templateUrl: 'users.html',
            access: { requiredLogin: true }
        })
        .state('admin.admins', {
            url: '/admins',
            templateUrl: 'admins.html',
            access: { requiredLogin: true }
        });
}]);

musicApp.run(function($rootScope, $state, $location, $window, AuthenticationService) {

    $rootScope.defaultSongImg = $config.default_song_img;

    // 监听路由变化，进行相应处理
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

        // 未登录,跳转到登录页
        if (toState !== null && !angular.isUndefined(toState.access) && toState.access !== null &&
            toState.access.requiredLogin && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {

            event.preventDefault();
            // 未登录时将原先要跳转到的url的存到全局变量prevUrl
            $rootScope.prevUrl = toState.url;
            $state.go('login');
        }
    });
});

// 加载页面angular控制器组件
require('./Header/HeaderCtrl');
require('./User/UserCtrl');
require('./MyMusic/MyMusicCtrl');
require('./Admin/AdminCtrl');
