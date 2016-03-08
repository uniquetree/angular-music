/**
 * 用户管理模块指令集
 * Created by 郑树聪 on 2016/3/8.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.directive('showMenu', function(){

    return {
        replace: true,
        template: '<ul ng-repeat="menu in adminMenus">' +
        '<li title="{{menu.name}}"><a href="{{menu.href}}">{{menu.name}}</a></li>' +
        '</ul>'
    }
});