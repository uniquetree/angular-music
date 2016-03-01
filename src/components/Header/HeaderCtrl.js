/**
 * Created by 郑树聪 on 2016/3/1.
 */
var $config = require('../Common/config');

$config.musicApp.controller('HeaderCtrl', ['$scope', '$location', '$window',
    function($scope, $location, $window){

    }
]).controller('DropdownCtrl', function ($scope, $log) {

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
});
