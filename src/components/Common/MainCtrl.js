/**
 * Created by 郑树聪 on 2016/3/4.
 */
var $config = require('../Common/config');

$config.musicApp.controller('MainCtrl', ['$scope', '$location', '$window',
    function($scope, $location, $window){
        //$scope.$on('$viewContentLoaded', function(){
        //    var url = $location.url();
        //    var urlReg = /^[\/|\/myMusic|\/admin]/;
        //    var subNav = document.querySelector('#m-sub-nav').
        //    subNav.find('li').removeClass('active');
        //    if(url.match(urlReg) === '/'){
        //        subNav.find('li:first-child').addClass('active');
        //    } else if(url.match(urlReg) === '/myMusic') {
        //        subNav.find('li:nth-child(2)').addClass('active');
        //    } else if(url.match(urlReg) === '/admin') {
        //        subNav.find('li:nth-child(3)').addClass('active');
        //    }
        //});
    }
]);
