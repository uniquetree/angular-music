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

        var progressWidth = 700;

        $scope.player = new Player();
        if(MusicData.lists.length > 0) {
            $scope.player.controllPlay(MusicData.index);
        }
        // 双击播放列表音乐播放
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
        //播放时间
        Audio.addEventListener('timeupdate', function(){
            $scope.$apply($scope.surplusBar());
        });
        //缓冲时间
        Audio.addEventListener('canplay', function(){
            $scope.$apply($scope.bufferBar());
        });

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
