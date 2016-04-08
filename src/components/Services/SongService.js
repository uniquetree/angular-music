/**
 * Created by 郑树聪 on 2016/4/8.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('SongService', ['$http', function($http) {

    return {
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
        getSongById: function(id) {

            return $http({
                method: 'GET',
                url: $config.api.getSongById,
                params: {
                    id: id
                }
            });
        },
        getSongsByPlaylistId: function(id) {

            return $http({
                method: 'GET',
                url: $config.api.getSongsByPlaylistId,
                params: {
                    playlistId: id
                }
            });
        },
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
        deleteSongsByIds: function(ids) {

            return $http({
                method: 'POST',
                url: $config.api.deleteSongsByIds,
                data: {
                    ids: ids
                }
            });
        }
    };
}]);
