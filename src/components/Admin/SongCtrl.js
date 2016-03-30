/**
 * Created by 郑树聪 on 2016/3/30.
 */
require('./AdminService');

var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 歌手列表控制器
musicApp.controller('SongCtrl', ['$scope', '$location', '$routeParams', '$log', 'AdminService', 'PageTableData',
    function($scope, $location, $routeParams, $log, AdminService, PageTableData){

        $scope.singerTypes = $config.singerTypes;
        $scope.languages = $config.languages;

        $scope.getSongsByPage = function(nextPage, pageSize, filters, keyword) {

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if(!angular.isUndefined(filters)) {
                if(!angular.isUndefined(filters.language)) {
                    params.language = filters.language;
                }
                if(!angular.isUndefined(filters.singer_id)) {
                    params.singer_id = filters.singer_id;
                }
                if(!angular.isUndefined(filters.album_id)) {
                    params.album_id = filters.album_id;
                }
            }
            if(keyword) {
                params.keyword = keyword;
            }

            AdminService.getSongsByPage(params).success(function(data) {

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