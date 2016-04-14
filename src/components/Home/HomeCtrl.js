/**
 * Created by 郑树聪 on 2016/4/15.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('HomeCtrl', ['$scope', '$state', '$stateParams', 'PageTableData', 'SongService', 'SingerService',
    'AlbumService', 'PlaylistService',
    function($scope, $state, $stateParams, PageTableData, SongService, SingerService, AlbumService, PlaylistService){


        $scope.getPlaylists = function() {

        };

        $scope.getSingers = function() {

        };
    }
]);