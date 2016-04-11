/**
 * 播放器相关服务功能
 * Created by 郑树聪 on 2016/4/11.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

//Audio Service
musicApp.factory('Audio', ['$document', function($document) {
    var audio = $document[0].createElement('audio');
    return audio;
}]);
// 播放列表数据
musicApp.factory('MusicData', function() {

    return {
        // 播放列表
        lists: [
            {
                album_id: 20,
                album_name: "我本人",
                id: 6,
                like_count: 0,
                listen_count: 0,
                publish_date: "2012-01-01T00:00:00.000Z",
                singer_id: 25,
                singer_name: "吴雨霏",
                song_img: "http://localhost:3000/app/resources/images/dac0a779-38f2-4b9d-a1fb-955ebc647247.jpeg",
                song_name: "生命树",
                url: "http://localhost:3000/app/resources/music/8864bf39-2a0f-4f7f-909d-326eca044c6c.mp3"
            },
            {
                album_id: 0,
                album_name: null,
                id: 1,
                like_count: 0,
                listen_count: 0,
                publish_date: "2016-04-04T16:34:27.000Z",
                singer_id: 0,
                singer_name: null,
                song_img: "http://localhost:3000/app/resources/images/dac0a779-38f2-4b9d-a1fb-955ebc647247.jpeg",
                song_name: "你瞒我瞒",
                url: "http://localhost:3000/app/resources/music/00d2bb18-34f9-4357-82a8-c4080af5e931.mp3"
            }
        ],
        // 正在播放的歌曲的下标位置，默认0
        index: 0,
        // 播放器当前播放模式,列表循环:'list',随机播放:'random',单曲循环:'repeat',默认'list'
        playMode: 'list'
    };
});
// 播放器
musicApp.factory('Player', ['$rootScope', 'MusicData', 'Audio', function($rootScope, MusicData, Audio) {

    // 正在播放的歌曲信息
    $rootScope.playingMusic = {};

    var Player = function(playing){
        this.playing = playing || false;
    };

    Player.prototype.controllPlay = function(index){

        $rootScope.playingMusic = MusicData.lists[index];

        MusicData.index = index;
        this.setAudioSrc(index);
        this.play();
        this.playing = true;
    };
    // 设置播放器audio标签的src
    Player.prototype.setAudioSrc = function(index){
        var src = MusicData.lists[index].url;
        Audio.src = src;
    };
    // 播放
    Player.prototype.play = function() {
        if(this.playing) {
            this.stop();
        }
        Audio.play(); //h5 audio api
        this.playing = true; //显示暂停按钮
    };
    // 暂停
    Player.prototype.stop = function() {
        if(this.playing) {
            Audio.pause();
        }
        this.playing = false;//显示播放按钮
    };
    // 上一首
    Player.prototype.prev = function() {

        var index = MusicData.index;
        switch (MusicData.playMode){
            case 'random':
                index = parseInt(MusicData.lists.length * Math.random());
                // 如果随机歌曲和当前的歌曲相同，则跳到下一首
                if(index === MusicData.index) {
                    ++index;
                }
                break;
            case 'repeat':
                index = MusicData.index;
                break;
            default:
                if(MusicData.index === 0) {
                    index = MusicData.lists.length-1;
                } else {
                    --index;
                }
                break;
        }
        this.controllPlay(index);
    };
    // 下一首
    Player.prototype.next = function() {

        var index = MusicData.index;
        switch (MusicData.playMode){
            case 'random':
                index = parseInt(MusicData.lists.length * Math.random());
                // 如果随机歌曲和当前的歌曲相同，则跳到下一首
                if(index === MusicData.index) {
                    ++index;
                }
                break;
            case 'repeat':
                index = MusicData.index;
                break;
            default:
                if(MusicData.index === MusicData.lists.length -1 ){
                    index = 0;
                } else {
                    ++index;
                }
                break;
        }
        this.controllPlay(index);
    };

    return Player;
}]);
