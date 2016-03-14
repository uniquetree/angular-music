/**
 * 用户管理模块指令集
 * Created by 郑树聪 on 2016/3/8.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 菜单指令集
musicApp.directive('showAdminMenu', function(){

    return {
        replace: true,
        template: '<ul ng-repeat="menu in adminMenus">' +
        '<li title="{{menu.name}}" role="{{menu.role}}">{{menu.name}}' +
        '<ul ng-repeat="subMenu in menu.subMenus" ng-if="subMenu.length>0">' +
        '<li title="{{subMenu.name}}"><a href="{{subMenu.page}}">{{subMenu.name}}</a></li></ul>' +
        '</li></ul>'
    };
});

// 管理员指令集：管理音乐
musicApp.directive('manageMusic', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

// 超级管理员指令集：管理用户
musicApp.directive('superManage', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});