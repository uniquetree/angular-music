/**
 * Created by 郑树聪 on 2016/4/8.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('SongService', ['$http', function($http) {

    return {
        // 分页获取所有歌曲
        getSongsByPage: function(filters) {

            return $http({
                method: 'GET',
                url: $config.api.getSongsByPage,
                params: {
                    language: filters.language,
                    singer_id: filters.singer_id,
                    album_id: filters.album_id,
                    currPage: filters.currPage,
                    pageSize: filters.pageSize,
                    keyword: filters.keyword
                }
            });
        },
        // 根据歌曲id获取歌曲信息
        getSongById: function(id) {

            return $http({
                method: 'GET',
                url: $config.api.getSongById,
                params: {
                    id: id
                }
            });
        },
        // 根据歌单id获取歌单歌曲
        getSongsByPlaylistId: function(id) {

            return $http({
                method: 'GET',
                url: $config.api.getSongsByPlaylistId,
                params: {
                    playlistId: id
                }
            });
        },
        // 更新歌曲信息
        updateSong: function(songInfo) {

            return $http({
                method: 'POST',
                url: $config.api.updateSong,
                data: {
                    id: songInfo.id,
                    song_name: songInfo.song_name,
                    url: songInfo.url,
                    publish_date: songInfo.publish_date,
                    singer_id: songInfo.singer_id,
                    album_id: songInfo.album_id
                }
            });
        },
        // 根据数组id删除歌曲
        deleteSongsByIds: function(ids) {

            return $http({
                method: 'POST',
                url: $config.api.deleteSongsByIds,
                data: {
                    ids: ids
                }
            });
        },
        // 收藏某首歌曲到自建歌单
        collectSong: function(playlistId, songId) {

            return $http({
                method: 'POST',
                url: $config.api.collectSong,
                data: {
                    playlistId: playlistId,
                    songId: songId
                }
            });
        },
        // 从自建歌单中取消某首收藏歌曲
        cancelCollectSong: function(playlistId, songId) {

            return $http({
                method: 'POST',
                url: $config.api.cancelCollectSong,
                data: {
                    playlistId: playlistId,
                    songId: songId
                }
            });
        }
    };
}]);
