/**
 * Created by 郑树聪 on 2016/3/1.
 */
var $config = require('../Common/config');

$config.musicApp.controller('HeaderCtrl', ['$scope', '$location', '$window',
    function($scope, $location, $window){
        $scope.load = function() {
            var url = $location.url();
            var urlReg = /^[\/|\/myMusic|\/admin]/;
            var subNav = angular.element(document.querySelector('#m-sub-nav'));
            subNav.find('li').removeClass('active');
            if(url.match(urlReg)[0] === '/'){
                subNav.find('li:first-child').addClass('active');
            } else if(url.match(urlReg)[0] === '/myMusic') {
                subNav.find('li:nth-child(2)').addClass('active');
            } else if(url.match(urlReg)[0] === '/admin') {
                subNav.find('li:nth-child(3)').addClass('active');
            }
        };
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
