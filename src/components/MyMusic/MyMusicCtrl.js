/**
 * Created by 郑树聪 on 2016/2/29.
 */
require('../Services/PlaylistService');
var $config = require('../Common/config');

$config.musicApp.controller('MyMusicCtrl', ['$scope', '$location', '$window', '$routeParams', 'PlaylistService',
    function($scope, $location, $window, $routeParams, PlaylistService){

        $scope.isCreateMenuOpen = false;
        $scope.isCollectMenuOpen = false;

        $scope.createPlaylists = [];
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
                            if(data.playlists[i].id == $location.search('playlistId')) {
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
                            if(data.playlists[i].id == $location.search('playlistId')) {
                                $scope.locationId = data.playlists[i].id;
                                $scope.currPlaylistInfo = data.playlists[i];
                                $scope.isCreateMenuOpen = true;
                            }
                        }
                    }
                }
            });
        };

        // 菜单列表展开折叠切换
        $scope.toggleMenuOpen = function(whichMenu, isMenuOpen) {

            $scope[whichMenu] = !isMenuOpen;
        };
        $scope.changeUrl = function(createPlaylist, whichMenu) {

            $location.search('playlistId', createPlaylist.id.toString());
            $scope.locationId = createPlaylist.id;

            //$scope[whichMenu] = true;

            $scope.currPlaylistInfo = createPlaylist;
        };
    }
]);
