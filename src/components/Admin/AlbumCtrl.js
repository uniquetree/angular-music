/**
 * 专辑列表控制器
 * Created by 郑树聪 on 2016/3/28.
 */
require('./AdminService');
require('../Services/AlbumService');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('AlbumCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$log', 'AlbumService', 'PageTableData',
    function($rootScope, $scope, $location, $routeParams, $log, AlbumService, PageTableData){

        // 获取歌手列表数据
        $scope.getAlbums = function(nextPage, pageSize, keyword){

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if(keyword) {
                params.keyword = keyword;
            }

            AlbumService.getAlbums(params).success(function(data) {

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
        // 修改专辑信息
        $scope.saveAlbumInfo = function() {

            var date = $scope.albumInfo.publish_date;
            $scope.albumInfo.publish_date = $func.formatDate(date);

            if($scope.isAddAlbum) {

                AlbumService.addAlbum($scope.albumInfo).success(function(data){
                    if(data.success) {
                        alert('添加成功');
                        $location.search('subPage', 'albumList');
                    }
                });
            } else {

                AlbumService.updateAlbum($scope.albumInfo).success(function(data){
                    if(data.success){
                        $scope.albumInfo.publish_date = date;
                        alert('更新成功');
                    }
                });
            }
        };
        // 删除单张专辑
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
            AlbumService.deleteAlumsById(ids).success(function(data) {

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

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            if(toState.name === 'admin.albums.addAlbum') {
                $scope.breadcrumbs = [
                    {name: '专辑列表', state: 'admin.albums.albumList'},
                    {name: '添加专辑', state: false}
                ];
            } else if(toState.name === 'admin.albums.editAlbum') {
                $scope.breadcrumbs = [
                    {name: '专辑列表', state: 'admin.albums.albumList'},
                    {name: '修改专辑信息', state: false}
                ];

                var id = toParams.albumId;
                AlbumService.getAlbumById(id).success(function(data){

                    if(data.success) {
                        $scope.albumInfo = data.album;
                        if($scope.albumInfo.publish_date) {
                            $scope.albumInfo.publish_date = new Date($scope.albumInfo.publish_date);
                        } else {
                            $scope.albumInfo.publish_date = new Date();
                        }
                    }
                });

            } else {
                $scope.breadcrumbs = [
                    {name: '专辑列表', state: false}
                ];
            }
        });
    }
]);
