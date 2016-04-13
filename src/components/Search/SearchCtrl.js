/**
 * Created by 郑树聪 on 2016/4/13.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('SearchCtrl', ['$scope', '$state', '$stateParams', 'SongService', 'SingerService', 'AlbumService',
    'PlaylistService',
    function($scope, $state, $stateParams, SongService, SingerService, AlbumService, PlaylistService){

        var filters = {
            currPage: 1,
            pageSize: 20
        };

        $scope.keyword = $stateParams.keyword || '';
        $scope.active = Number($stateParams.type) || 0;
        $scope.$watch('active', function(value) {

            if(value) {
                if($scope.keyword !== '') {
                    filters.keyword = $scope.keyword;
                    switch(value) {
                        case 1:
                            searchSingers(filters);
                            break;
                        case 2:
                            searchAlbums(filters);
                            break;
                        case 3:
                            searchPlaylists(filters);
                            break;
                        default:
                            searchSongs(filters);
                            break;
                    }
                }
            }
        });

        $scope.search = function($event) {

            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13 && keyword !== '') {
                switch($scope.active) {
                    case 1:
                        searchSingers(filters);
                        break;
                    case 2:
                        searchAlbums(filters);
                        break;
                    case 3:
                        searchPlaylists(filters);
                        break;
                    default:
                        searchSongs(filters);
                        break;
                }
            }
        };

        $scope.changeSearchType = function(newType) {
            //if(Number($stateParams.type) !== 0) {
            //    newType = Number($stateParams.type);
            //}
            $scope.active = newType;
            $state.go('search', {keyword: $scope.keyword, type: newType});
        };

        // 关键词搜索歌曲
        function searchSongs(filters) {

            SongService.getSongsByPage(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.songs;
                    $scope.totalItems = data.totalItems;
                    $scope.currPage = data.currPage;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '首单曲';
                }
            });
        }
        // 关键词搜索歌曲
        function searchSingers(filters) {

            SingerService.getSingers(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.singers;
                    $scope.totalItems = data.totalItems;
                    $scope.currPage = data.currPage;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '个歌手';
                }
            });
        }
        // 关键词搜索专辑
        function searchAlbums(filters) {

            AlbumService.getAlbums(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.albums;
                    $scope.totalItems = data.totalItems;
                    $scope.currPage = data.currPage;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '张专辑';
                }
            });
        }
        // 关键词搜索歌单
        function searchPlaylists(filters) {

            PlaylistService.filterPlayListsByPage(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.playlists;
                    $scope.totalItems = data.totalItems;
                    $scope.currPage = data.currPage;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '张歌单';
                }
            });
        }
    }
]);