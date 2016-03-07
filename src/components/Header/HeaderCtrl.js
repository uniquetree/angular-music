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
            {id: '1', name: '发现音乐', href: '#/'},
            {id: '2', name: '我的音乐', href: '#/myMusic'},
            {id: '3', name: '管理中心', href: '#/admin'}
        ];
        $scope.selected = '1';
        $scope.isActive = function(id, currUrl) {
            var href = '#' + $location.url();
            //return (id === $scope.selected || currUrl === href);
            return currUrl === href;
        };
        $scope.changeUrl = function(id, currUrl) {
            //var prevUrl = $window.sessionStorage.getItem('prevUrl');
            //var href = '#' + $location.url();
            $window.sessionStorage.setItem('prevUrl', currUrl);
            //if(currUrl === href || currUrl === prevUrl) {
            //    $scope.selected = id;
            //}
            $scope.selected = id;
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
