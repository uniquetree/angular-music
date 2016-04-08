/**
 * 歌单服务
 * Created by 郑树聪 on 2016/4/6.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('PlaylistService', ['$http', function($http) {

    return {
        // 获取用户创建的歌单
        getPlayListsByUserCreate: function(){

            return $http({
                method: 'GET',
                url: $config.api.getPlayListsByUserCreate
            });
        },
        // 获取用户收藏的歌单
        getPlayListsByUserCollect: function(){

            return $http({
                method: 'GET',
                url: $config.api.getPlayListsByUserCollect
            });
        },
        // 添加歌单
        addPlaylist: function(playlistInfo){

            return $http({
                method: 'POST',
                url: $config.api.addPlaylist,
                data: {
                    playlist_name: playlistInfo.playlist_name,
                    playlist_info: playlistInfo.playlist_info
                }
            });
        },
        // 更新歌单信息
        updatePlaylist: function(playlistInfo){

            return $http({
                method: 'POST',
                url: $config.api.updatePlaylist,
                data: {
                    id: playlistInfo.id,
                    playlist_name: playlistInfo.playlist_name,
                    playlist_info: playlistInfo.playlist_info
                }
            });
        },
        // 删除某张歌单(创建的、收藏的)
        deletePlaylistById: function(id){

            return $http({
                method: 'POST',
                url: $config.api.deletePlaylistById,
                data: {
                    id: id
                }
            });
        }
    };
}]);
