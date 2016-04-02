/**
 * 用户管理模块控制器
 * Created by 郑树聪 on 2016/2/29.
 */
require('../Menu/MenuDirectives');
require('./AdminDirectives');
require('./AdminService');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 管理中心页面控制器
musicApp.controller('AdminCtrl', ['$scope', '$location', '$window', '$routeParams', 'AdminService',
    function($scope, $location, $window, $routeParams, AdminService){

        $scope.pages = {};
        // 判断当前页的参数
        if(!angular.isUndefined($routeParams.page)) {
            $scope.pages.page = $routeParams.page;
        } else {
            $location.search('page', 'userInfo');
            $scope.pages.page = 'userInfo';
        }
        $scope.pages.pageUrl = $scope.pages.page +'.html';

        // 初始化当前用户的管理中心菜单
        $scope.loadMenus = function(){

            $scope.adminMenus = [];
            if($window.sessionStorage.adminMenus) {
                $scope.adminMenus = JSON.parse($window.sessionStorage.adminMenus);
            } else {
                AdminService.getMenu().success(function(data, status, headers, config) {

                    if(data.success) {
                        $scope.adminMenus = data.menus;
                        $window.sessionStorage.adminMenus = JSON.stringify(data.menus);
                    } else {
                        console.log(data.msg);
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                });
            }
        };

    }
]);

// 用户信息控制器
musicApp.controller('InfoCtrl', ['$scope', '$location', '$window', '$routeParams', 'AdminService',
    function($scope, $location, $window, $routeParams, AdminService){

        var areas = [];
        $scope.userInfo = JSON.parse($window.sessionStorage.userInfo);
        if($scope.userInfo.code !== '') {

            if(angular.isUndefined($window.localStorage.areas)) {
                AdminService.getAreas().success(function(data, status, headers, config) {

                    if(data.success) {
                        $window.localStorage.areas = JSON.stringify({areas: data.areas});
                        $scope.userInfo.areaName = $func.getAreaName($scope.userInfo.code, data.areas);
                    } else {
                        console.log(data.msg);
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                });
            } else {
                areas = JSON.parse($window.localStorage.areas).areas;
                $scope.userInfo.areaName = $func.getAreaName($scope.userInfo.code, areas);
            }
        }

        // 更新用户信息
        $scope.updateUserInfo = function(){

            // 格式化日期
            var birth = $scope.userInfo.birth;
            $scope.userInfo.birth = $func.formatDate(birth);

            AdminService.updateUserInfo({userInfo: $scope.userInfo}).success(function(data) {

                if(data.success) {
                    $window.sessionStorage.userInfo = JSON.stringify($scope.userInfo);
                    $scope.userInfo.birth = birth;
                    alert('更新成功！');
                } else {
                    alert('更新失败！');
                    console.log(data.msg);
                }
            }).error(function(data) {
                alert('更新失败！');
                console.log(data.msg);
            });
        };
    }
]);

// 表格分页处理控制器
musicApp.controller('PageTableCtrl', ['$scope', 'PageTableData', function($scope, PageTableData){

    PageTableData.pagination = {
        currPage: 1,
        itemsPerPage: 10,
        maxSize: 3,
        totalItems: 0
    };
    PageTableData.itemIds = [];
    PageTableData.selectItemIds = [];

    // 分页器默认参数
    $scope.pagination = PageTableData.pagination;

    /**
     * 全选事件
     * @param tableId {String} 分页表格的id
     */
    $scope.toggleSelectAll = function(tableId) {

        $scope.isSelectAllModel = !$scope.isSelectAllModel;

        if($scope.isSelectAllModel) {
            PageTableData.selectItemIds = angular.copy(PageTableData.itemIds);
            angular.element(document.getElementById(tableId)).find('input[name="item-check"]')
                .prop('checked', true).attr('isSelected', '1');
        } else {
            PageTableData.selectItemIds = [];
            angular.element(document.getElementById(tableId)).find('input[name="item-check"]')
                .prop('checked', false).removeAttr('isSelected');
        }

    };
    /**
     * 单选事件
     * @param $event {Object} 触发的事件对象
     * @param itemId {Array} 选中的项id
     */
    $scope.toggleSelect = function($event, itemId) {

        if($event.target.getAttribute('isSelected') !== '1') {
            // 未选中变为选中
            $event.target.setAttribute('isSelected', '1');
            PageTableData.selectItemIds.push(itemId);
        } else {
            // 选中变为未选中
            $event.target.removeAttribute('isSelected');
            var index = PageTableData.selectItemIds.indexOf(itemId);
            if(index !== -1){
                PageTableData.selectItemIds.splice(index, 1);
            }
        }

        if(PageTableData.selectItemIds.length === PageTableData.itemIds.length) {
            $scope.isSelectAllModel = true;
        } else {
            $scope.isSelectAllModel = false;
        }
    };

    /**
     * 页码改变时事件
     * @param getItems {Function} 页码改变时调用的方法
     * @param $scope.keyword {String} 父控制器参数，搜索关键字
     */
    $scope.pageChanged = function(getItems) {

        getItems($scope.pagination.currPage, 10, $scope.keyword);
    };

}]);

musicApp.controller('UploadMusicCtrl', ['$scope', 'FileUploader', function($scope, FileUploader){

    $scope.songInfo = {};

    $scope.uploader = new FileUploader({
        url: $config.api.uploadSongs,
        method: 'POST',
        formData: {
            singer_id: $scope.songInfo.singerId,
            album_id: $scope.songInfo.albumId
        }
    });

    // 点击选择文件触发input[type=file]标签的点击事件
    $scope.btnSelectFile = function(){
        document.querySelector('#upload-mp3').click();
    };
}]);

require('./SingerCtrl');
require('./AlbumCtrl');
require('./SongCtrl');
