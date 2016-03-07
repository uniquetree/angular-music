/**
 * 顶部header导航栏模块指令集
 * Created by 郑树聪 on 2016/3/6.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 未登录时显示登录、注册盒子
musicApp.directive('loginBox', function(){

    return {
        replace: true,
        template: '<ul class="login-box clearfix">' +
        '<li class="login"><a href="/#/login"><i class="fa fa-sign-in"></i> 登录</a></li>' +
        '<li class="register"><a href="/#/register"><i class="fa fa-user-plus"></i> 注册</a></li>' +
        '</ul>'
    };
});

// 用户登录后再导航显示的用户登录盒
musicApp.directive('userInfoBox', function(){

    return {
        replace: true,
        template: '<ul class="nav navbar-nav user-info"><li class="dropdown">' +
        '<a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown"' +
        ' title="{{userInfo.username}}">{{userInfo.username}}<b class="caret"></b></a>' +
        '<ul class="dropdown-menu">' +
        '<li><a href="#/"><i class="fa fa-user"></i>我的主页</a></li>' +
        '<li><a href="#/"><i class="fa fa-cog"></i>个人设置</a></li>' +
        '<li ng-click="logout()"><a href="javascript:void(0)"><i class="fa fa-sign-out"></i>退出</a></li>' +
        '</ul></li></ul>'
    };
});
