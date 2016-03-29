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
        $scope.getAlbums = function(nextPage, pageSize, keyword){

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if(keyword) {
                params.keyword = keyword;
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
        // 回车搜索专辑
        $scope.search = function($event) {

            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                $scope.getAlbums(1, 10, $event.target.value);
            }
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
                        if($scope.albumInfo.publish_date) {
                            $scope.albumInfo.publish_date = new Date($scope.albumInfo.publish_date);
                        } else {
                            $scope.albumInfo.publish_date = new Date();
                        }
                    }
                });
            }
        };
        // 修改专辑信息
        $scope.saveAlbumInfo = function() {

            var date = $scope.albumInfo.publish_date;
            $scope.albumInfo.publish_date = $func.formatDate(date);

            if($scope.isAddAlbum) {

                AdminService.addAlbum($scope.albumInfo).success(function(data){
                    if(data.success) {
                        alert('添加成功');
                        $location.search('subPage', 'albumList');
                    }
                });
            } else {

                AdminService.updateAlbum($scope.albumInfo).success(function(data){
                    if(data.success){
                        $scope.albumInfo.publish_date = date;
                        alert('更新成功');
                    }
                });
            }
        };
        // 删除单个歌手
        $scope.deleteAlumsById = function(id){

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
            AdminService.deleteAlumsById(ids).success(function(data) {

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
