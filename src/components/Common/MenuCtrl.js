/**
 * Created by 郑树聪 on 2016/3/16.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.controller('MenuCtrl', ['$scope', '$location', '$window',
    function($scope, $location, $window){

        $scope.toggleMenuOpen = function(menu) {

            menu.isMenuOpen = !menu.isMenuOpen;
        };
    }
]);
