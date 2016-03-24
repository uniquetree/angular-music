/**
 * Created by 郑树聪 on 2016/3/24.
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
