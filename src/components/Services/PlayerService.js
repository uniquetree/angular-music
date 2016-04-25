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

    //var lists = [
    //    {
    //        album_id: 1,
    //        album_name: "我本人",
    //        id: 1,
    //        like_count: 0,
    //        listen_count: 0,
    //        publish_date: "2012-01-01T00:00:00.000Z",
    //        singer_id: 1,
    //        singer_name: "吴雨霏",
    //        song_img: "http://localhost:3000/app/resources/images/29c6d9f1-c3f6-49e9-a6d0-7c55694a4e75.jpeg",
    //        song_name: "生命树",
    //        url: "http://localhost:3000/app/resources/music/e74f0f75-1c55-454e-8a6a-4f076a03239e.mp3"
    //    },
    //    {
    //        album_id: 6,
    //        album_name: '绅士',
    //        id: 6,
    //        like_count: 0,
    //        listen_count: 0,
    //        publish_date: "2016-04-04T16:34:27.000Z",
    //        singer_id: 5,
    //        singer_name: '薛之谦',
    //        song_img: "http://localhost:3000/app/resources/images/e1e57819-748c-4c49-b48c-5848ebc79b8f.jpeg",
    //        song_name: "绅士",
    //        url: "http://localhost:3000/app/resources/music/ed8884cb-8145-4e5a-a723-450186e0bca5.mp3"
    //    }
    //];

    return {
        // 播放列表
        lists: [],
        // 正在播放的歌曲的下标位置，默认0
        index: 0,
        // 播放器当前播放模式,列表循环:'loop',随机播放:'random',单曲循环:'repeat',默认'list'
        playMode: 'loop',
        playingMusic: {}
    };
});
// 播放器
musicApp.factory('Player', ['$rootScope', 'MusicData', 'Audio', function($rootScope, MusicData, Audio) {
    // 正在播放的歌曲信息
    var Player = function(playing){
        this.playing = playing || false;
    };
    Player.prototype.controllPlay = function(index){
        MusicData.playingMusic = MusicData.lists[index];
        MusicData.index = index;
        this.setAudioSrc(index);
        this.play();
        this.playing = true;
        // 向下广播更新音乐播放列表
        $rootScope.$broadcast('updatePlayingMusic');
    };
    // 设置播放器audio标签的src
    Player.prototype.setAudioSrc = function(index){
        Audio.src = MusicData.lists[index].url;
    };
    // 播放
    Player.prototype.play = function() {
        if(this.playing) this.stop();
        Audio.play(); //h5 audio api
        this.playing = true; //显示暂停按钮
    };
    // 暂停
    Player.prototype.stop = function() {
        if(this.playing) Audio.pause();
        this.playing = false;//显示播放按钮
    };
    // 上一首
    Player.prototype.prev = function() {
        var index = MusicData.index;
        switch (MusicData.playMode){
            case 'random':
                index = parseInt(MusicData.lists.length * Math.random());
                // 如果随机歌曲和当前的歌曲相同，则跳到下一首
                if(index === MusicData.index) ++index;
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
                if(index === MusicData.index) ++index;
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
