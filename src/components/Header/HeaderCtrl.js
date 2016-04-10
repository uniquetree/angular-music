/**
 * 顶部header导航栏控制器
 * Created by 郑树聪 on 2016/3/1.
 */
require('./HeaderDirectives');

var $config = require('../Common/config');

$config.musicApp.controller('HeaderCtrl', ['$scope', '$location', '$window', '$state', 'AuthenticationService',
    function($scope, $location, $window, $state, AuthenticationService){

        // 导航栏选项
        $scope.items = [
            {id: '1', name: '发现音乐', state: 'home'},
            {id: '2', name: '我的音乐', state: 'myMusic'},
            {id: '3', name: '管理中心', state: 'admin'}
        ];
        $scope.subNavbarItems = [
            //{name: '最新音乐', state: '#/discover'},
            {name: '排行榜', state: 'home.topList'},
            {name: '歌单', state: 'home.playlist'},
            {name: '歌手', state: 'home.singer'}
        ];
        $scope.isHome = true;
        $scope.isActive = function(state) {
            if($state.includes(state)) {
                var reg = /^home/;
                if(!reg.test(state)) {
                    $scope.isHome = false;
                }
                return true;
            }
            return false;
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
