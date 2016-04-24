/**
 * 播放器组件
 * Created by 郑树聪 on 2016/2/18.
 */
require('../Services/PlayerService');
require('./PlayerDirectives');

var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 播放器控制器
musicApp.controller('PlayerCtrl', ['$rootScope', '$scope', '$document', '$window', '$interval', '$state', 'MusicData', 'Audio', 'Player',
    function($rootScope, $scope, $document, $window, $interval, $state, MusicData, Audio, Player){

        $scope.MusicData = MusicData;
        $scope.playMode = MusicData.playMode;
        $scope.player = new Player();
        if(MusicData.lists.length > 0) $scope.player.controllPlay(MusicData.index);
        $scope.playingMusic = MusicData.playingMusic;

        // 从播放列表删除某首歌曲歌曲
        $scope.delFormMusicLists = function(index) {

            MusicData.lists.splice(index, 1);
        };
        // 清空播放列表
        $scope.clearMusicLists = function() {

            MusicData.lists = [];
        };

        $rootScope.$on('updateMusicList', function() {
            $scope.MusicData = MusicData;
            $scope.player = new Player();
            if(MusicData.lists.length > 0) $scope.player.controllPlay(MusicData.index);
        });
        $rootScope.$on('updatePlayingMusic', function() {
            $scope.playingMusic = MusicData.playingMusic;
        });

        var progressWidth = 680;
        // 双击播放列表某首音乐播放
        $scope.isSelected = function(){
            $scope.player.controllPlay(this.$index);
        };
        $scope.duration = '00:00';
        $scope.currentTime = '00:00';
        //音乐剩余时间
        $scope.surplusBar = function() {
            if(!isNaN(Audio.duration)) {
                $scope.duration = formatTime(Audio.duration);
                $scope.currentTime = formatTime(Audio.currentTime);
                //播放进度条
                var progressValue = Audio.currentTime/Audio.duration*progressWidth;
                $scope.surplusWidth = 'width:' + parseInt(progressValue) + 'px';
            }
        };
        //缓冲进度条
        $scope.bufferBar = function() {
            bufferTimer = $interval(function() {
                var bufferIndex = Audio.buffered.length;
                if (bufferIndex > 0 && !angular.isUndefined(Audio.buffered)) {
                    var bufferValue = Audio.buffered.end(bufferIndex-1)/Audio.duration*progressWidth;
                    $scope.bufferWidth = 'width:' + parseInt(bufferValue) + 'px';
                    if (Math.abs(Audio.duration - Audio.buffered.end(bufferIndex-1)) <1) {
                        $scope.bufferWidth = 'width: ' + progressWidth + 'px';
                        clearInterval(bufferTimer);
                    }
                }
            }, 1000);
        };
        // 播放器进度条控制
        $scope.adjustPorgress = function(event) {
            event = window.event || event;
            var progressX = event.clientX - $document[0].querySelector('#music-progress').getBoundingClientRect().left;
            Audio.currentTime = parseInt(progressX/progressWidth*Audio.duration);
            Audio.removeEventListener('canplay', $scope.bufferBar);
        };
        // 改变播放循环模式
        $scope.changePlayMode = function(playMode) {
            var playModes = ['loop', 'random', 'repeat'];
            var index = playModes.indexOf(playMode);
            if(index === playModes.length-1) {
                index = 0;
            } else {
                ++index;
            }
            MusicData.playMode = playModes[index];
            $scope.playMode = MusicData.playMode;
        };
        //控制音量
        $scope.volStyle = 'height: 50px';
        Audio.volume = 0.5;
        $scope.muted = true;    //声音是否播放
        //调整音量
        $scope.adjustVolume = function(ev){
            var event = window.event || ev;
            var volumeY = $document[0].querySelector('#play-vol').getBoundingClientRect().bottom - event.clientY;
            Audio.volume = (volumeY/100).toFixed(2);
            $scope.volStyle = "height:" + volumeY + 'px';
            if(volumeY === 0) {
                Audio.muted = true;
                $scope.muted = false;
            } else {
                Audio.muted = false;
                $scope.muted = true;
            }
        };

        // 监听播放时间更新事件
        Audio.addEventListener('timeupdate', function(){
            $scope.$apply($scope.surplusBar());
        });
        // 缓冲时间
        Audio.addEventListener('canplay', function(){
            $scope.$apply($scope.bufferBar());
        });
        // 监听播放结束事件，播放下一首
        Audio.addEventListener('ended', function() {
            $scope.player.next();
        });

        // 格式化歌曲时间
        function formatTime(time) {
            var timeMin = parseInt(time/60);
            var timeSecond = parseInt(time%60);
            if(timeSecond < 10 ) {
                timeSecond = '0'+timeSecond;
            }
            return timeMin + ':' + timeSecond;
        }
    }
]);
