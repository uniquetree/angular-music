/**
 * 左侧菜单栏生成指令
 * Created by 郑树聪 on 2016/3/21.
 */
require('../Menu/MenuCtrl');

var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 显示菜单
musicApp.directive('showAdminMenu', function(){

    return {
        restrict:'EA',
        scope: {
            menus: '=',
            pages: '='
        },
        replace: true,
        templateUrl: 'app/views/Menu/menuTpl.html',
        controller: 'MenuCtrl'
    };
});
