/**
 * 用户管理模块服务、控制器
 * Created by 郑树聪 on 2016/2/29.
 */
require('../Menu/MenuDirectives');
require('./AdminDirectives');

var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('AdminMenuService', ['$http', function($http) {

    return {
        // 获取左侧菜单数据
        getMenu: function(){

            var url = $config.base_url + $config.api.getMenuByRole;
            return $http.get(url, {});
        }
    };
}]);

musicApp.controller('AdminCtrl', ['$scope', '$location', '$window', '$routeParams', 'AdminMenuService',
    function($scope, $location, $window, $routeParams, AdminMenuService){

        $scope.pages = {};
        // 判断当前页的参数
        if(!angular.isUndefined($routeParams.page)) {
            $scope.pages.page = $routeParams.page;
        } else {
            $location.search('page', 'userInfo');
            $scope.pages.page = 'userInfo';
        }
        $scope.pages.pageUrl = $scope.pages.page +'.html';

        // 初始化当前用户的管理中心菜单
        $scope.adminMenus = (function(){
            if($window.sessionStorage.adminMenus) {
                return JSON.parse($window.sessionStorage.adminMenus);
            } else {
                AdminMenuService.getMenu().success(function(data, status, headers, config) {

                    if(data.success) {
                        //$scope.adminMenus = data.menus;
                        $window.sessionStorage.adminMenus = JSON.stringify(data.menus);
                        return data.menus;
                    } else {
                        console.log(data.msg);
                        return [];
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                    return [];
                });
            }
        })();
    }
]);
