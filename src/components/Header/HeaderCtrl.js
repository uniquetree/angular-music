/**
 * 顶部header导航栏控制器
 * Created by 郑树聪 on 2016/3/1.
 */
require('./HeaderDirectives');

var $config = require('../Common/config');

$config.musicApp.controller('HeaderCtrl', ['$scope', '$location', '$window', 'AuthenticationService',
    function($scope, $location, $window, AuthenticationService){

        // 导航栏选项
        $scope.items = [
            {id: '1', name: '发现音乐', state: 'home'},
            {id: '2', name: '我的音乐', state: 'myMusic'},
            {id: '3', name: '管理中心', state: 'admin'}
        ];
        $scope.subNavbarItems = [
            //{name: '最新音乐', state: '#/discover'},
            {name: '排行榜', state: 'toplists'},
            {name: '歌单', state: 'playlists'},
            {name: '歌手', state: 'singers'}
        ];
        $scope.isActive = function(currUrl) {
            var href = '#' + $location.url();
            var patt = new RegExp(currUrl);
            if(href !== '#/' && currUrl ==='#/') {
                return false;
            }
            return patt.test(href);
        };
        // 判断是否首页
        $scope.isHome = function(){
            var reg = new RegExp('/discover');
            var path = $location.url();
            return path === '/' || reg.test(path);
        };

        // 判断是否登录
        $scope.isLogin = AuthenticationService.isAuthenticated;
        // 判断是否是管理员
        $scope.isAdmin = AuthenticationService.isAdmin;

        if($scope.isLogin && $window.sessionStorage.getItem('userInfo')) {
            $scope.userInfo = JSON.parse($window.sessionStorage.getItem('userInfo'));
        }
    }
]);
