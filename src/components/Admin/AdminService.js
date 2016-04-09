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

            return $http.get($config.api.getMenuByRole, {});
        },
        // 获取省份、城市、地区数据
        getAreas: function(){

            return $http.get($config.api.getAreas, {});
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
