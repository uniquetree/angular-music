/**
 * Created by 郑树聪 on 2016/4/25.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('MainCtrl', ['$rootScope', '$scope', '$location', '$window', '$state', 'MusicData',
    function($rootScope, $scope, $location, $window, $state, MusicData){
        // 跳转到歌手主页
        $scope.goSinger = function(singerId) {

        };
        // 跳转到歌单主页
        $scope.goPlaylist = function(playlistId) {

        };

        // 替换播放列表
        $scope.updateMusicLists = function(songs) {

            MusicData.lists = songs;
            $rootScope.$broadcast('updateMusicList');
        };
        // 添加歌曲到播放列表
        $scope.addMusicLists = function(song) {

            MusicData.lists.push(song);

            // 向下广播更新音乐播放列表
            $rootScope.$broadcast('updateMusicList');
        };

        // 收藏歌曲（一首或多首）
        $scope.collectMusic = function(songs) {

            var ids = [];
            if(angular.isArray(songs)) {
                for(var i=0; i < songs.length; i++) {
                    ids.push(songs[i].id);
                }
            } else {
                ids.push(songs.id);
            }
        };
    }
]);
