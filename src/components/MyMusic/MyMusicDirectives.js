/**
 * Created by 郑树聪 on 2016/4/6.
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
        template: '<div></div>',
        controller: function($scope) {

        }
    };
});
