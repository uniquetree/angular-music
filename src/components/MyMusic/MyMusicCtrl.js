/**
 * Created by 郑树聪 on 2016/2/29.
 */
require('../Services/PlaylistService');
require('../Services/SongService');
var $config = require('../Common/config');
//var $func = require('../Common/Functions');

var musicApp = $config.musicApp;

musicApp.controller('MyMusicCtrl', ['$scope', '$q', '$location', '$window', '$routeParams', '$uibModal',
    'PlaylistService', 'SongService',
    function($scope, $q, $location, $window, $routeParams, $uibModal, PlaylistService, SongService){

        // 判断歌单菜单是否展开的
        $scope.isCreateMenuOpen = false;
        $scope.isCollectMenuOpen = false;

        $scope.isOwner = true;

        // 创建的歌单列表
        $scope.createPlaylists = [];
        // 收藏的歌单列表
        $scope.collectPlaylists = [];
        // 当前选中的歌单信息
        $scope.currPlaylistInfo = {};
        // 当前选中歌单的歌曲
        $scope.currPlaylistSongs = [];

        // 加载歌单（创建的、收藏的）
        $scope.loadPlaylists = function(){

            PlaylistService.getPlayListsByUserCreate().success(function(data) {

                if(data.success) {

                    $scope.createPlaylists = data.playlists;
                    if(angular.isUndefined($routeParams.playlistId) || $routeParams.playlistId === '') {
                        $location.search('playlistId', data.playlists[0].id.toString());
                        $scope.locationId = data.playlists[0].id;
                        $scope.currPlaylistInfo = data.playlists[0];
                        $scope.isCreateMenuOpen = true;
                        $scope.isOwner = true;
                    } else {
                        for(var i=0; i<data.playlists.length; i++) {
                            if(data.playlists[i].id == $routeParams.playlistId) {
                                $scope.locationId = data.playlists[i].id;
                                $scope.currPlaylistInfo = data.playlists[i];
                                $scope.isCreateMenuOpen = true;
                                $scope.isOwner = true;
                            }
                        }
                    }
                }
            });

            PlaylistService.getPlayListsByUserCollect().success(function(data) {

                if(data.success) {

                    $scope.collectPlaylists = data.playlists;
                    if(!angular.isUndefined($routeParams.playlistId) || $routeParams.playlistId !== '') {

                        for(var i=0; i<data.playlists.length; i++) {
                            if(data.playlists[i].id == $routeParams.playlistId) {
                                $scope.locationId = data.playlists[i].id;
                                $scope.currPlaylistInfo = data.playlists[i];
                                $scope.isCollectMenuOpen = true;
                                $scope.isOwner = false;
                            }
                        }
                    }
                }
            });
        };

        // 菜单列表展开折叠切换
        $scope.toggleMenuOpen = function(whichMenu) {

            $scope[whichMenu] = !$scope[whichMenu];
        };
        // 点击列表改变url参数
        $scope.changeUrl = function(newPlaylist, whichMenu) {

            if($scope.currPlaylistInfo.id !== newPlaylist.id) {
                $scope.currPlaylistSongs = [];
                SongService.getSongsByPlaylistId(newPlaylist.id).success(function(data){

                    if(data.success) {
                        $scope.currPlaylistSongs = data.playlist_songs;
                    }
                });

                $location.search('playlistId', newPlaylist.id.toString());
                $scope.locationId = newPlaylist.id;

                $scope[whichMenu] = true;
                if(whichMenu === 'isCollectMenuOpen') {
                    $scope.isOwner = false;
                } else {
                    $scope.isOwner = true;
                }

                $scope.currPlaylistInfo = newPlaylist;
            }
        };
        /**
         * 点击弹窗新建/修改歌单信息
         * @param isCreate [Boolean] 判断是创建歌单还是修改，true为新建（默认值）
         * @param playlist [Object] 当前编辑的歌单对象
         */
        $scope.open = function ($event, isCreate, playlist) {

            $event.stopPropagation();

            if(angular.isUndefined(isCreate)) {
                isCreate = true;
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'myModalContent.html',
                controller: function ($scope, $uibModalInstance) {

                    $scope.playlist = playlist;
                    $scope.ok = function () {
                        $uibModalInstance.close($scope.playlist);
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('取消');
                    };
                }
            });
            modalInstance.result.then(function (playlist) {
                if(isCreate) {

                    PlaylistService.addPlaylist(playlist).success(function(data) {
                        if(data.success){
                            window.location.reload();
                        }
                    });
                } else {
                    PlaylistService.updatePlaylist(playlist).success(function(data) {

                        if(data.success) {
                            window.location.reload();
                        }
                    });
                }
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };
        /**
         * 点击，删除自建歌单或者取消收藏歌单
         * @param playlistId [Number] 要删除的歌单id
         */
        $scope.deletePlaylist = function($event, playlistId) {

            $event.stopPropagation();

            PlaylistService.deletePlaylistById(playlistId).success(function(data) {

                if(data.success) {
                    window.location.reload();
                } else {
                    console.log(data.message);
                    alert('删除失败！');
                }
            }).error(function(data) {
                console.log(data.message);
                alert('删除失败！');
            });
        };
        /**
         * 从自建歌单中取消某首收藏歌曲
         * @param playlistId [Number] 歌单id
         * @param songId [Number] 歌曲id
         */
        $scope.cancelCollectSong = function(playlistId, songId) {

            SongService.cancelCollectSong(playlistId, songId).success(function(data) {

                if(data.success) {
                    window.location.reload();
                } else {
                    console.log(data.msg);
                    alert('取消收藏有误!');
                }
            });
        };
        // 监控当前显示歌单的状态，若歌单改变则重新请求
        $scope.$watch('currPlaylistInfo.id', function(value){

            if(value) {

                SongService.getSongsByPlaylistId(value).success(function(data){

                    if(data.success) {
                        $scope.currPlaylistSongs = data.playlist_songs;
                    } else {
                        $scope.currPlaylistSongs = [];
                    }
                });
            }
        });
    }
]);
