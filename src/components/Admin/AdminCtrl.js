/**
 * 用户管理模块服务、控制器
 * Created by 郑树聪 on 2016/2/29.
 */
require('../Menu/MenuDirectives');
require('./AdminDirectives');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('AdminService', ['$http', function($http) {

    return {
        // 获取左侧菜单数据
        getMenu: function(){

            var url = $config.base_url + $config.api.getMenuByRole;
            return $http.get(url, {});
        },
        // 获取省份、城市、地区数据
        getAreas: function(){

            var url = $config.base_url + $config.api.getAreas;
            return $http.get(url, {});
        },
        // 更新用户信息
        updateUserInfo: function(userInfo){

            var url = $config.base_url + $config.api.updateUserInfo;
            return $http.post(url, userInfo);
        }
    };
}]);

musicApp.controller('AdminCtrl', ['$scope', '$location', '$window', '$routeParams', 'AdminService',
    function($scope, $location, $window, $routeParams, AdminService){

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
        $scope.loadMenus = function(){

            $scope.adminMenus = [];
            if($window.sessionStorage.adminMenus) {
                $scope.adminMenus = JSON.parse($window.sessionStorage.adminMenus);
            } else {
                AdminService.getMenu().success(function(data, status, headers, config) {

                    if(data.success) {
                        $scope.adminMenus = data.menus;
                        $window.sessionStorage.adminMenus = JSON.stringify(data.menus);
                    } else {
                        console.log(data.msg);
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                });
            }
        };

    }
]);

musicApp.controller('InfoCtrl', ['$scope', '$location', '$window', '$routeParams', 'AdminService',
    function($scope, $location, $window, $routeParams, AdminService){

        var areas = [];
        $scope.userInfo = JSON.parse($window.sessionStorage.userInfo);
        if($scope.userInfo.area !== '') {

            if(angular.isUndefined($window.localStorage.areas)) {
                AdminService.getAreas().success(function(data, status, headers, config) {

                    if(data.success) {
                        $window.localStorage.areas = JSON.stringify({areas: data.areas});
                        $scope.userInfo.areaName = $func.getAreaName($scope.userInfo.area, data.areas);
                    } else {
                        console.log(data.msg);
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                });
            } else {
                areas = JSON.parse($window.localStorage.areas).areas;
                $scope.userInfo.areaName = $func.getAreaName($scope.userInfo.area, areas);
            }
        }

        // 更新用户信息
        $scope.updateUserInfo = function(){

            // 格式化日期
            var birth = $scope.userInfo.birth;
            $scope.userInfo.birth = birth.getFullYear() + '-' +
                (birth.getMonth()+1 < 10 ? '0'+(birth.getMonth()+1) : birth.getMonth()+1) + '-' +
                (birth.getDate() < 10 ? '0'+birth.getDate() : birth.getDate());

            AdminService.updateUserInfo({userInfo: $scope.userInfo}).success(function(data) {

                if(data.success) {
                    $window.sessionStorage.userInfo = JSON.stringify($scope.userInfo);
                    alert('更新成功！');
                } else {
                    alert('更新失败！');
                    console.log(data.msg);
                }
            }).error(function(data) {
                alert('更新失败！');
                console.log(data.msg);
            });
        };
    }
]);
