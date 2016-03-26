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
        },
        // 获取歌手列表
        getSingers: function(pagination){

            var url = $config.base_url + $config.api.getSingers;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    currPage: pagination.currPage,
                    pageSize: pagination.pageSize
                }
            });
        },
        // 根据id获取某位歌手信息
        getSingerById: function(id){

            var url = $config.base_url + $config.api.getSingerById;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    id: id
                }
            });
        },
        addSinger: function(singer){

            var url = $config.base_url + $config.api.addSinger;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    singerName: singer.name,
                    singerInfo: singer.info
                }
            });
        },
        updateSinger: function(singer) {

            var url = $config.base_url + $config.api.updateSinger;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    id: singer.id,
                    singerName: singer.name,
                    singerInfo: singer.info
                }
            });
        },
        deleteSingers: function(ids){

            var url = $config.base_url + $config.api.deleteSingers;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    ids: ids
                }
            });
        }
    };
}]);

// 管理中心页面控制器
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

// 用户信息控制器
musicApp.controller('InfoCtrl', ['$scope', '$location', '$window', '$routeParams', 'AdminService',
    function($scope, $location, $window, $routeParams, AdminService){

        var areas = [];
        $scope.userInfo = JSON.parse($window.sessionStorage.userInfo);
        if($scope.userInfo.code !== '') {

            if(angular.isUndefined($window.localStorage.areas)) {
                AdminService.getAreas().success(function(data, status, headers, config) {

                    if(data.success) {
                        $window.localStorage.areas = JSON.stringify({areas: data.areas});
                        $scope.userInfo.areaName = $func.getAreaName($scope.userInfo.code, data.areas);
                    } else {
                        console.log(data.msg);
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                });
            } else {
                areas = JSON.parse($window.localStorage.areas).areas;
                $scope.userInfo.areaName = $func.getAreaName($scope.userInfo.code, areas);
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

// 歌手列表控制器
musicApp.controller('SingerCtrl', ['$scope', '$location', '$window', '$routeParams', '$log', 'AdminService',
    function($scope, $location, $window, $routeParams, $log, AdminService){

        if(!angular.isUndefined($routeParams.subPage)) {
            if($routeParams.subPage === 'singerList') {
                $scope.subPageUrl = 'singerList.html';
                $scope.breadcrumbs = [
                    {name: '歌手列表', href: false}
                ];
            } else {
                $scope.subPageUrl = $routeParams.subPage + '.html';
                var subPageName = '添加歌手';
                if(!angular.isUndefined($routeParams.singerId)) {
                    subPageName = '修改歌手信息';
                }
                $scope.breadcrumbs = [
                    {name: '歌手列表', href: '#/admin?page=singers&subPage=singerList'},
                    {name: subPageName, href: false}
                ];
            }
        } else {
            $location.search('subPage', 'singerList');
            $scope.subPageUrl = 'singerList.html';
            $scope.breadcrumbs = [
                {name: '歌手列表', href: false}
            ];
        }

        // 分页器默认参数
        $scope.pagination = {
            currPage: 1,
            itemsPerPage: 10,
            maxSize: 3,
            totalItems: 0
        };

        // 获取歌手列表数据
        $scope.getSingers = function(nextPage, pageSize, keyword){

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if(keyword) {
                params.keyword = keyword;
            }

            AdminService.getSingers(params).success(function(data) {

                if(data.success) {
                    $scope.singers = data.singers;
                    $scope.pagination.totalItems = data.totalItems;
                    $scope.pagination.currPage = data.currPage;
                } else {
                    console.log(data.msg);
                }
            }).error(function(data) {
                console.log(data.msg);
            });
        };
        // 页码改变时事件
        $scope.pageChanged = function() {
            //$log.log('Page changed to: ' + $scope.pagination.currPage);
            $scope.getSingers($scope.pagination.currPage, 10, $scope.keyword);
        };

        $scope.singerInfo = {};
        $scope.singerHandle = function() {
            $scope.isAddSinger = true;
            if(!angular.isUndefined($routeParams.singerId)) {
                $scope.isAddSinger = false;
                var id = $routeParams.singerId;
                AdminService.getSingerById(id).success(function(data){

                    if(data.success) {
                        $scope.singerInfo = data.singer;
                    }
                });
            }
        };
        // 修改歌手信息
        $scope.saveSingerInfo = function() {

            if($scope.isAddSinger) {

                AdminService.addSinger($scope.singerInfo).success(function(data){
                    if(data.success) {
                        alert('添加成功');
                        $location.path('#/admin?page=singers&subPage=singerList');
                    }
                });
            } else {

                AdminService.updateSinger($scope.singerInfo).success(function(data){
                    if(data.success) {
                        alert('更新成功');
                    }
                });
            }
        };
        $scope.deleteSinger = function(id){

            var ids = [];
            if(angular.isArray(id)) {
                ids = id;
            } else {
                ids.push(id);
            }
            AdminService.deleteSingers(ids).success(function(data) {

                if(data.success) {
                    alert('删除成功');
                    $location.path('#/admin?page=singers&subPage=singerList');
                }
            });
        };
    }
]);
