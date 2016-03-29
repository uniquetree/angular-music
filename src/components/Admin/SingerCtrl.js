/**
 * Created by 郑树聪 on 2016/3/28.
 */

require('./AdminService');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 歌手列表控制器
musicApp.controller('SingerCtrl', ['$scope', '$location', '$routeParams', '$log', 'AdminService', 'PageTableData',
    function($scope, $location, $routeParams, $log, AdminService, PageTableData){

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

        // 获取歌手列表数据
        $scope.getSingers = function(nextPage, pageSize){

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if($scope.keyword) {
                params.keyword = $scope.keyword;
            }

            AdminService.getSingers(params).success(function(data) {

                if(data.success) {
                    $scope.singers = data.singers;

                    for(var i=0; i<data.singers.length; i++) {
                        PageTableData.itemIds.push(data.singers[i].id);
                    }
                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                } else {
                    console.log(data.msg);
                }
            }).error(function(data) {
                console.log(data.msg);
            });
        };

        $scope.singerInfo = {};
        // 操作歌手：判断是添加歌手还是编辑歌手
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
        // 删除单个歌手
        $scope.deleteSinger = function(id){

            if(angular.isUndefined(id)) {
                id = PageTableData.selectItemIds;
            }

            var ids = [];
            if(angular.isArray(id)) {
                if (id.length > 0){
                    ids = id;
                } else {
                    alert('请先勾选要删除的项！');
                    return;
                }
            } else {
                ids.push(id);
            }
            AdminService.deleteSingers(ids).success(function(data) {

                if(data.success) {
                    alert('删除成功');
                    $scope.getSingers();
                }
            });
        };
        // 跳转到某位歌手主页
        $scope.goToSingerPage = function(id) {

            $location.path('/singer?singerId=' + id);
        };
    }
]);