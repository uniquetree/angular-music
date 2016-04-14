/**
 * Created by 郑树聪 on 2016/4/13.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('SearchCtrl', ['$scope', '$state', '$stateParams', 'PageTableData', 'SongService', 'SingerService',
    'AlbumService', 'PlaylistService',
    function($scope, $state, $stateParams, PageTableData, SongService, SingerService, AlbumService, PlaylistService){

        // 搜索选项tab页签
        $scope.tabs = [
            {type: 0, name: '单曲', content: 'search.song.html'},
            {type: 1, name: '歌手', content: 'search.singer.html'},
            {type: 2, name: '专辑', content: 'search.album.html'},
            {type: 3, name: '歌单', content: 'search.playlist.html'}
        ];

        var type = Number($stateParams.type) || 0;
        $scope.activeTab = $scope.tabs[type];
        $scope.activeTab.type = type;

        $scope.keyword = $stateParams.keyword || '';

        $scope.changeTab = function(type) {
            $scope.activeTab = $scope.tabs[type];
            $scope.activeTab.type = type;
            $state.go('search', {keyword: $scope.keyword, type: type});
        };

        $scope.search = function($event) {

            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13 || $event.type === 'click') {
                $scope.doSearch(PageTableData.pagination.currPage, PageTableData.pagination.itemsPerPage,
                    $scope.activeTab.type);
            }
        };

        $scope.$watch('activeTab.type', function(value) {

            if(!angular.isUndefined(value)) {
                // 每页显示的条目数
                PageTableData.pagination.itemsPerPage = 20;
                $scope.doSearch(PageTableData.pagination.currPage, PageTableData.pagination.itemsPerPage,
                    value);
            }
        });

        // 按照选择筛选
        $scope.doSearch = function (nextPage, pageSize, type) {
            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 20
            };
            if($scope.keyword !== '') {
                params.keyword = $scope.keyword;
            } else {
                return;
            }
            switch(type) {
                case 0:
                    searchSongs(params);
                    break;
                case 1:
                    searchSingers(params);
                    break;
                case 2:
                    searchAlbums(params);
                    break;
                case 3:
                    searchPlaylists(params);
                    break;
            }
        };
        // 关键词搜索歌曲
        function searchSongs(filters) {

            SongService.getSongsByPage(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.songs;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '首单曲';

                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                }
            });
        }
        // 关键词搜索歌曲
        function searchSingers(filters) {

            SingerService.getSingers(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.singers;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '个歌手';

                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                }
            });
        }
        // 关键词搜索专辑
        function searchAlbums(filters) {

            AlbumService.getAlbums(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.albums;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '张专辑';

                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                }
            });
        }
        // 关键词搜索歌单
        function searchPlaylists(filters) {

            PlaylistService.filterPlayListsByPage(filters).success(function(data) {

                if(data.success) {
                    $scope.results = data.playlists;
                    $scope.pageSize = data.pageSize;

                    $scope.totalItemsTips = '张歌单';

                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                }
            });
        }
    }
]);