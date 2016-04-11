/**
 * 音乐播放器指令
 * Created by 郑树聪 on 2016/4/11.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 音乐播放器生成指令
musicApp.directive('musicPlayer', function(){

    return {
        restrict:'EA',
        replace: true,
        templateUrl: 'app/views/Player/player.html'
    };
});
