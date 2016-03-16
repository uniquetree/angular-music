/**
 * 用户管理模块指令集
 * Created by 郑树聪 on 2016/3/8.
 */
require('../Common/MenuCtrl');

var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 菜单指令集
musicApp.directive('showAdminMenu', function(){

    return {
        replace: true,
        template: '<ul class="nav nav-pills nav-stacked menu">' +
        '<li ng-repeat="menu in adminMenus" title="{{menu.name}}">' +
        '<a ng-click="toggleMenuOpen(menu)"><i class="fa fa-{{menu.icon}}"></i>{{menu.name}}' +
        '<i class="fa pull-right" ng-class="{true: \'fa-chevron-down\', false: \'fa-chevron-right\'}[menu.isMenuOpen]"></i>' +
        '</a>' +
        '<ul class="nav nav-pills nav-stacked sub-menu" ng-class="{false: \'hidden\'}[menu.isMenuOpen]" ng-if="menu.subMenus.length>0">' +
        '<li ng-repeat="subMenu in menu.subMenus" title="{{subMenu.name}}">' +
        '<a href="#/admin?page={{subMenu.page}}"><i class="fa fa-{{subMenu.icon}}"></i>{{subMenu.name}}</a></li></ul>' +
        '</li></ul>',
        controller: 'MenuCtrl'
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