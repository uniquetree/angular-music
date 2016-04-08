/**
 * Created by 郑树聪 on 2016/2/29.
 */
require('../Services/PlaylistService');
require('../Services/SongService');
var $config = require('../Common/config');
//var $func = require('../Common/Functions');

$config.musicApp.controller('MyMusicCtrl', ['$scope', '$q', '$location', '$window', '$routeParams',
    'PlaylistService', 'SongService',
    function($scope, $q, $location, $window, $routeParams, PlaylistService, SongService){

        $scope.isCreateMenuOpen = false;
        $scope.isCollectMenuOpen = false;

        // 创建的歌单列表
        $scope.createPlaylists = [];
        // 收藏的歌单列表
        $scope.collectPlaylists = [];
        // 当前选中的歌单信息
        $scope.currPlaylistInfo = {};
        // 当前选中歌单的歌曲
        $scope.currPlaylistSongs = {};

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
                    } else {
                        for(var i=0; i<data.playlists.length; i++) {
                            if(data.playlists[i].id == $routeParams.playlistId) {
                                $scope.locationId = data.playlists[i].id;
                                $scope.currPlaylistInfo = data.playlists[i];
                                $scope.isCreateMenuOpen = true;
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

            $scope.playlistSongs = [];
            SongService.getSongsByPlaylistId(newPlaylist.id).success(function(data){

                if(data.success) {
                    $scope.playlistSongs = data.playlist_songs;
                }
            });

            $location.search('playlistId', newPlaylist.id.toString());
            $scope.locationId = newPlaylist.id;

            $scope[whichMenu] = true;

            $scope.currPlaylistInfo = newPlaylist;
        };

        $scope.$watch('currPlaylistInfo.id', function(value){

            if(value) {

                SongService.getSongsByPlaylistId(value).success(function(data){

                    if(data.success) {
                        $scope.playlistSongs = data.playlist_songs;
                    } else {
                        $scope.playlistSongs = [];
                    }
                });
            }
        });
    }
]);
