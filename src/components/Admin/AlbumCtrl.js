/**
 * 专辑列表控制器
 * Created by 郑树聪 on 2016/3/28.
 */
require('./AdminService');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('AlbumCtrl', ['$scope', '$location', '$routeParams', '$log', 'AdminService', 'PageTableData',
    function($scope, $location, $routeParams, $log, AdminService, PageTableData){

        if(!angular.isUndefined($routeParams.subPage)) {
            if($routeParams.subPage === 'albumList') {
                $scope.subPageUrl = 'albumList.html';
                $scope.breadcrumbs = [
                    {name: '专辑列表', href: false}
                ];
            } else {
                $scope.subPageUrl = $routeParams.subPage + '.html';
                var subPageName = '添加专辑';
                if(!angular.isUndefined($routeParams.albumId)) {
                    subPageName = '修改专辑信息';
                }
                $scope.breadcrumbs = [
                    {name: '专辑列表', href: '#/admin?page=albums&subPage=albumList'},
                    {name: subPageName, href: false}
                ];
            }
        } else {
            $location.search('subPage', 'albumList');
            $scope.subPageUrl = 'albumList.html';
            $scope.breadcrumbs = [
                {name: '专辑列表', href: false}
            ];
        }

        // 获取歌手列表数据
        $scope.getAlbums = function(nextPage, pageSize){

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if($scope.keyword) {
                params.keyword = $scope.keyword;
            }

            AdminService.getAlbums(params).success(function(data) {

                if(data.success) {
                    $scope.albums = data.albums;
                    for(var i=0; i<data.albums.length; i++) {
                        PageTableData.itemIds.push(data.albums[i].id);
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

        $scope.albumInfo = {};
        // 操作歌手：判断是添加歌手还是编辑歌手
        $scope.albumHandle = function() {
            $scope.isAddAlbum = true;
            if(!angular.isUndefined($routeParams.albumId)) {
                $scope.isAddAlbum = false;
                var id = $routeParams.albumId;
                AdminService.getAlbumById(id).success(function(data){

                    if(data.success) {
                        $scope.albumInfo = data.album;
                    }
                });
            }
        };
        // 修改歌手信息
        $scope.saveAlbumInfo = function() {

            if($scope.isAddAlbum) {

                AdminService.addAlbum($scope.albumInfo).success(function(data){
                    if(data.success) {
                        alert('添加成功');
                        $location.path('#/admin?page=albums&subPage=albumList');
                    }
                });
            } else {

                AdminService.updateAlbum($scope.albumInfo).success(function(data){
                    if(data.success) {
                        alert('更新成功');
                    }
                });
            }
        };
        // 删除单个歌手
        $scope.deleteAlbum = function(id){

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
            AdminService.deleteAlbums(ids).success(function(data) {

                if(data.success) {
                    alert('删除成功');
                    $scope.getAlbums();
                }
            });
        };
        // 跳转到某位歌手主页
        $scope.goToAlbumPage = function(id) {

            $location.path('/album?albumId=' + id);
        };
    }
]);
