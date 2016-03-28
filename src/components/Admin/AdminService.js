/**
 * 用户管理模块服务
 * Created by 郑树聪 on 2016/3/27.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心相关服务
musicApp.factory('AdminService', ['$http', function($http) {

    return {
        // 获取左侧菜单数据
        getMenu: function(){

            var url = $config.base_url + $config.api.getMenuByRole;
            return $http.get(url, {});
        },
        // 获取省份、城市、地区数据
        getAreas: function(){

            var url = $config.base_url + $config.api.getAreas;
            return $http.get(url, {});
        },
        // 更新用户信息
        updateUserInfo: function(userInfo){

            var url = $config.base_url + $config.api.updateUserInfo;
            return $http.post(url, userInfo);
        },

        // 获取歌手列表
        getSingers: function(pagination){

            var url = $config.base_url + $config.api.getSingers;
            return $http({
                method: 'GET',
                url: url,
                params: {
                    currPage: pagination.currPage,
                    pageSize: pagination.pageSize,
                    keyword: pagination.keyword
                }
            });
        },
        // 根据id获取某位歌手信息
        getSingerById: function(id){

            var url = $config.base_url + $config.api.getSingerById;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    id: id
                }
            });
        },
        addSinger: function(singer){

            var url = $config.base_url + $config.api.addSinger;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    name: singer.name,
                    info: singer.info
                }
            });
        },
        updateSinger: function(singer) {

            var url = $config.base_url + $config.api.updateSinger;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    id: singer.id,
                    name: singer.name,
                    info: singer.info
                }
            });
        },
        deleteSingers: function(ids){

            var url = $config.base_url + $config.api.deleteSingers;
            return $http({
                method: 'POST',
                url: url,
                data: {
                    ids: ids
                }
            });
        }
    };
}]);

/**
 * 分页表格（全选功能）数据共享服务
 * @param pagination {Object} 分页器参数
 * @param itemIds {Array} 当前页的选项id
 * @param selectItemIds {Array} 选中的项id
 */
musicApp.factory('PageTableData', function(){

    return {
        pagination: {
            currPage: 1,
            itemsPerPage: 10,
            maxSize: 3,
            totalItems: 0
        },
        itemIds: [],
        selectItemIds: []
    };
});
