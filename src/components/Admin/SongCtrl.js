/**
 * Created by 郑树聪 on 2016/3/30.
 */
require('./AdminService');
require('../Services/SongService');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 歌手列表控制器
musicApp.controller('SongCtrl', ['$scope', '$location', '$routeParams', '$log', 'SongService', 'PageTableData',
    function($scope, $location, $routeParams, $log, SongService, PageTableData){

        $scope.singerTypes = $config.singerTypes;
        $scope.languages = $config.languages;

        $scope.getSongsByPage = function(nextPage, pageSize, params) {

            var apiParams = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if(!angular.isUndefined(params)) {
                if(!angular.isUndefined(params.language)) {
                    apiParams.language = params.language;
                }
                if(!angular.isUndefined(params.singer_id)) {
                    apiParams.singer_id = params.singer_id;
                }
                if(!angular.isUndefined(params.album_id)) {
                    apiParams.album_id = params.album_id;
                }
            }
            if($scope.keyword) {
                apiParams.keyword = $scope.keyword;
            }

            SongService.getSongsByPage(apiParams).success(function(data) {

                if(data.success) {

                    for(var i=0; i<data.songs.length; i++) {
                        data.songs[i].publish_date = $func.formatDate(data.songs[i].publish_date);
                        PageTableData.itemIds.push(data.songs[i].id);
                    }
                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                    $scope.songs = data.songs;
                } else {
                    console.log(data.message);
                }
            }).error(function(data) {
                console.log(data.message);
            });
        };
    }
]);