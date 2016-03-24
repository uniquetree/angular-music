/**
 * 用户管理模块指令集
 * Created by 郑树聪 on 2016/3/8.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.directive('datePicker', function(){

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            date: '='
        },
        template: '<div class="form-group clearfix birth">' +
            '<label class="pull-left">生日：</label>' +
            '<div class="input-group pull-left"><span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
            '<input type="text" class="form-control" ng-click="open()" uib-datepicker-popup ng-model="date" ' +
            'is-open="opened" datepicker-options="dateOptions" on-open-focus="false" show-button-bar="false" /></div></div>',
        link: function($scope, elem, attrs) {

            if(!$scope.date) {
                $scope.date = new Date();
            } else {
                $scope.date = new Date($scope.date);
            }

            $scope.opened = false;
            $scope.dateOptions = {
                dateDisabled: disabled,
                maxDate: new Date(),
                startingDay: 1,
                showWeeks: false
            };

            $scope.open = function(){
                $scope.opened = true;
            };

            function disabled(data) {
                var date = data.date,
                    mode = data.mode;
                return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
            }
        }
    };
});

// 地区选择
musicApp.directive('citySelect', ['$window', 'AdminService', function($window, AdminService){

    return {
        replace: true,
        restrict: 'EA',
        scope: {
            area: '='
        },
        template: '<div class="form-group clearfix area"><label class="pull-left">地区：</label>' +
            '<div class="input-group pull-left">' +
            '<select class="form-control" ng-model="province" ng-options="province.province for province in provinces">' +
            '<option value="">-- 省份 --</option></select>' +
            '<select class="form-control" ng-model="city" ng-options="city.city for city in cities">' +
            '<option value="">-- 城市 --</option></select>' +
            '<select class="form-control" ng-model="district" ng-options="district.district for district in districts">' +
            '<option value="">-- 地区 --</option></select></div></div>',
        link: function($scope, elem, attrs) {

            if(angular.isUndefined($window.localStorage.areas)) {
                AdminService.getAreas().success(function(data, status, headers, config) {

                    if(data.success) {
                        $window.localStorage.areas = JSON.stringify({areas: data.areas});
                        $scope.areas = data.areas;
                        $scope.provinces = initProvinces(data.areas);

                    } else {
                        console.log(data.msg);
                    }
                }).error(function(data, status, headers, config){

                    console.log(data.msg);
                });
            } else {
                var areas = JSON.parse($window.localStorage.areas).areas;
                $scope.areas = areas;
                $scope.provinces = initProvinces(areas);
            }

            $scope.$watch('province', function (value) {

                $scope.cities = [];
                if(value){
                    if(value.city !== '') {
                        $scope.cities.push(value);
                    } else {
                        for(var i=0; i < $scope.areas.length; i++){
                            if($scope.areas[i].parent === value.id){
                                $scope.cities.push($scope.areas[i]);
                            }
                        }
                    }

                    $scope.area = value.code;
                }
            });

            $scope.$watch('city', function (value) {

                $scope.districts = [];

                if(value) {
                    for(var i=0; i < $scope.areas.length; i++){
                        if($scope.areas[i].parent === value.id){
                            $scope.districts.push($scope.areas[i]);
                        }
                    }
                    $scope.area = value.code;
                }
            });

            $scope.$watch('district', function (value) {

                if(value){
                    $scope.area = value.code;
                }
            });

            function initProvinces(areas) {
                var provinces = [];

                for(var i=0; i<areas.length; i++){
                    if(areas[i].id !== 1 && areas[i].province !== ''){
                        provinces.push(areas[i]);
                    }
                }

                return provinces;
            }
        }
    };
}]);
