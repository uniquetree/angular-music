/**
 * 用户管理模块服务、控制器
 * Created by 郑树聪 on 2016/2/29.
 */
require('./AdminDirectives');

var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.factory('AdminMenuService', ['$http', function($http) {

    return {
        getMenu: function(){

            var url = $config.base_url + $config.api.getMenuByRole;
            return $http.get(url, {});
        }
    };
}]);

musicApp.controller('AdminCtrl', ['$scope', '$location', '$window', 'AdminMenuService',
    function($scope, $location, $window, AdminMenuService){

        // 初始化当前用户的管理中心菜单
        $scope.loadMenus = function(){

            $scope.adminMenus = [];

            AdminMenuService.getMenu().success(function(data, status, headers, config) {

                if(data.success) {
                    $scope.adminMenus = data.menus;
                } else {
                    console.log(data.msg);
                }
            }).error(function(data, status, headers, config){

                console.log(data.msg);
            });
        };

        $scope.loadContent = function(){

            var page = $location.url().split('?')[1].split('=')[1];

        };
    }
]);
