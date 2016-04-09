/**
 * 歌手相关服务
 * Created by 郑树聪 on 2016/4/9.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('SingerService', ['$http', function($http) {

    return {
        // 获取获取所有歌手的id、name
        getAllSingers: function(){

            return $http({
                method: 'GET',
                url: $config.api.getAllSingers
            });
        },
        // 获取歌手列表
        getSingers: function(pagination){

            return $http({
                method: 'GET',
                url: $config.api.getSingers,
                params: {
                    currPage: pagination.currPage,
                    pageSize: pagination.pageSize,
                    keyword: pagination.keyword
                }
            });
        },
        // 根据id获取某位歌手信息
        getSingerById: function(id){

            return $http({
                method: 'GET',
                url: $config.api.getSingerById,
                params: {
                    id: id
                }
            });
        },
        addSinger: function(singer){

            return $http({
                method: 'POST',
                url: $config.api.addSinger,
                data: {
                    singer_name: singer.singer_name,
                    singer_type: singer.singer_type,
                    language: singer.language,
                    singer_info: singer.singer_info
                }
            });
        },
        updateSinger: function(singer) {

            return $http({
                method: 'POST',
                url: $config.api.updateSinger,
                data: {
                    id: singer.id,
                    singer_name: singer.singer_name,
                    singer_type: singer.singer_type,
                    language: singer.language,
                    singer_info: singer.singer_info
                }
            });
        },
        deleteSingers: function(ids){

            return $http({
                method: 'POST',
                url: $config.api.deleteSingers,
                data: {
                    ids: ids
                }
            });
        }
    };
}]);
