/**
 * 用户管理模块指令集
 * Created by 郑树聪 on 2016/3/8.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 展示个人信息
musicApp.directive('userInfoShow', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

// 编辑个人资料
musicApp.directive('userInfoEdit', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

// 管理员指令：歌手列表
musicApp.directive('singers', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

musicApp.directive('albums', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

musicApp.directive('songs', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

musicApp.directive('uploadMusic', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});

musicApp.directive('users', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});


musicApp.directive('admins', function(){

    return {
        replace: true,
        template: '<div></div>'
    };
});


musicApp.directive('supAdmins', function(){

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