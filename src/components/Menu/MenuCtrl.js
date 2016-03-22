/**
 * Created by 郑树聪 on 2016/3/16.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('MenuCtrl', ['$scope', '$location', '$window', '$routeParams',
    function($scope, $location, $window, $routeParams){

        //if(typeof $routeParams.page !== 'undefined') {
        //    $scope.page = $routeParams.page;
        //} else {
        //    $location.search('page', 'userInfo');
        //    $scope.page = 'userInfo';
        //}

        // 初始化时默认展开当前链接对应的菜单
        for(var i = 0; i < $scope.menus.length; i++){
            for(var j = 0; j < $scope.menus[i].subMenus.length; j++){
                if($scope.page === $scope.menus[i].subMenus[j].page) {
                    $scope.menus[i].isMenuOpen = true;
                    break;
                }
            }
        }

        // 菜单列表展开折叠切换
        $scope.toggleMenuOpen = function(menu) {

            menu.isMenuOpen = !menu.isMenuOpen;
        };

        // 点击菜单列表改变url
        $scope.changeUrl = function(subMenu) {

            $scope.page = subMenu.page;
            $location.search('page', subMenu.page);
        };
    }
]);
