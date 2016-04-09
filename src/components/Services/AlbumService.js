/**
 * 专辑相关服务
 * Created by 郑树聪 on 2016/4/9.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('AlbumService', ['$http', function($http) {

    return {
        // 获取所有专辑的id和name
        getAllAlbums: function(){

            return $http({
                method: 'GET',
                url: $config.api.getAllAlbums
            });
        },
        getAlbums: function(pagination){

            return $http({
                method: 'GET',
                url: $config.api.getAlbums,
                params: {
                    currPage: pagination.currPage,
                    pageSize: pagination.pageSize,
                    keyword: pagination.keyword
                }
            });
        },
        getAlbumById: function(id){

            return $http({
                method: 'GET',
                url: $config.api.getAlbumById,
                params: {
                    id: id
                }
            });
        },
        getAlbumsBySingerId: function(singerId){

            return $http({
                method: 'GET',
                url: $config.api.getAlbumsBySingerId,
                params: {
                    singer_id: singerId
                }
            });
        },
        addAlbum: function(albumInfo){

            return $http({
                method: 'POST',
                url: $config.api.addAlbum,
                data: {
                    album_name: albumInfo.album_name,
                    album_info: albumInfo.album_info,
                    publish_date: albumInfo.publish_date,
                    singer_id: albumInfo.singer_id
                }
            });
        },
        updateAlbum: function(albumInfo){

            return $http({
                method: 'POST',
                url: $config.api.updateAlbum,
                data: {
                    id: albumInfo.id,
                    album_name: albumInfo.album_name,
                    album_info: albumInfo.album_info,
                    publish_date: albumInfo.publish_date,
                    singer_id: albumInfo.singer_id
                }
            });
        },
        /**
         * 根据id删除专辑
         * @param ids {Array} 要删除的项
         */
        deleteAlumsById: function(ids){

            return $http({
                method: 'POST',
                url: $config.api.deleteAlumsById,
                data: {
                    ids: ids
                }
            });
        },
        /**
         * 根据歌手id删除专辑
         * @param singerIds {Array} 要删除专辑的歌手id
         */
        deleteAlbumsBySingerId: function(singerIds){

            return $http({
                method: 'POST',
                url: $config.api.deleteAlbumsBySingerId,
                data: {
                    singerIds: singerIds
                }
            });
        }
    };
}]);
