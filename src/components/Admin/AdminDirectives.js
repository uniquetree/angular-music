/**
 * 用户管理模块指令集
 * Created by 郑树聪 on 2016/3/8.
 */
var $func = require('../Common/Functions');
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.directive('datePicker', function(){

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            date: '=',
            label: '@'
        },
        template: '<div class="form-group clearfix select-date">' +
            '<label class="pull-left">{{label}}：</label>' +
            '<div class="input-group pull-left"><span class="input-group-addon"><i class="fa fa-calendar"></i></span>' +
            '<input type="text" class="form-control" ng-click="open()" uib-datepicker-popup ng-model="date" ' +
            'is-open="opened" datepicker-options="dateOptions" on-open-focus="false" show-button-bar="false" /></div></div>',
        link: function($scope, elem, attrs) {

            if(angular.isUndefined($scope.date)) {
                $scope.date = new Date();
            } else {
                $scope.date = new Date($scope.date);
            }

            $scope.dateOptions = {
                dateDisabled: disabled,
                maxDate: new Date(),
                startingDay: 1,
                showWeeks: false
            };

            $scope.opened = false;

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
            code: '='
        },
        template: '<div class="form-group clearfix area"><label class="pull-left">地区：</label>' +
            '<div class="input-group pull-left">' +
            '<select class="form-control" ng-model="provinceCode" ng-options="province.code as province.province for province in provinces">' +
            '<option value="">-- 省份 --</option></select>' +
            '<select class="form-control" ng-model="cityCode" ng-options="city.code as city.city for city in cities">' +
            '<option value="">-- 城市 --</option></select>' +
            '<select class="form-control" ng-model="districtCode" ng-options="district.code as district.district for district in districts">' +
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

            if($scope.code) {
                var areaName = $func.getAreaName($scope.code, $scope.areas);
                $scope.provinceCode = areaName.provinceCode;
                $scope.cityCode = areaName.cityCode;
                $scope.districtCode = areaName.districtCode;
            }

            // 监控省份选中
            $scope.$watch('provinceCode', function (value) {

                $scope.cities = [];
                if(value){
                    var thisProvince =getAreaByCode(value);
                    // 初始化城市下拉选项
                    if(thisProvince.city !== '') {
                        $scope.cities.push(thisProvince);
                    } else {
                        for(var j=0; j < $scope.areas.length; j++){
                            if($scope.areas[j].parent === thisProvince.id){
                                $scope.cities.push($scope.areas[j]);
                            }
                        }
                    }
                    $scope.code = value;
                }
            });
            // 监控市区选中
            $scope.$watch('cityCode', function (value) {

                $scope.districts = [];

                if(value) {
                    var thisCity = getAreaByCode(value);
                    for(var i=0; i < $scope.areas.length; i++){
                        if($scope.areas[i].parent === thisCity.id){
                            $scope.districts.push($scope.areas[i]);
                        }
                    }
                    $scope.code = value;
                }
            });
            // 监控县区选中
            $scope.$watch('districtCode', function (value) {

                if(value){
                    $scope.code = value;
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

            // 根据code获取对应区域对象
            function  getAreaByCode(code) {
                var thisArea;
                for(var i=0; i < $scope.areas.length; i++) {
                    if($scope.areas[i].code === code) {
                        thisArea = $scope.areas[i];
                        break;
                    }
                }
                return thisArea;
            }
        }
    };
}]);

// 歌手选择
musicApp.directive('singerSelect', function(AdminService){

    return {
        replace: true,
        restrict: 'EA',
        scope: {
            selectedSingerId: '='
        },
        template: '<div class="form-group singer-select"><label class="pull-left">歌手选择：</label>' +
            '<div class="input-group">' +
            '<select class="form-control" ng-model="selectedSingerId" ng-options="singer.id as singer.singer_name for singer in allSingers">' +
            '<option value="">-- 选择歌手 --</option></select></div></div>',
        link: function($scope) {

            AdminService.getAllSingers().success(function(data) {

                if(data.success) {
                    $scope.allSingers = data.allSingers;
                }
            });
        }
    };
});

// 语种选择
musicApp.directive('languageSelect', function(){

    return {
        replace: true,
        restrict: 'EA',
        scope: {
            selectedLanguageId: '='
        },
        template: '<div class="form-group language-select"><label class="pull-left">语种选择：</label>' +
        '<div class="input-group">' +
        '<select class="form-control" ng-model="selectedLanguageId" ng-options="language.id as language.text for language in languages">' +
        '<option value="">-- 选择语种 --</option></select></div></div>',
        link: function($scope) {

            $scope.languages = $config.languages;
        }
    };
});

// 歌手延伸专辑选择
musicApp.directive('singerAndAlbumSelect', function($filter, AdminService){

    return {
        replace: true,
        restrict: 'EA',
        scope: {
            selectedSingerId: '=',
            selectedAlbumId: '='
        },
        template: '<div class="form-group singer-album-select clearfix"><label class="pull-left">歌手及专辑：</label>' +
            '<div class="input-group pull-left">' +
            '<select class="form-control" ng-model="selectedSingerId" ' +
            'ng-options="singer.id as singer.singer_name for singer in allSingers">' +
            '<option value="">-- 选择歌手 --</option></select>' +
            '<select class="form-control" ng-model="selectedAlbumId" ' +
            'ng-options="album.id as album.album_name for album in albums | filter: filterAlbums">' +
            '<option value="">-- 歌手专辑 --</option></select></div></div>',
        link: function($scope) {

            $scope.allSingers = [];
            $scope.albums = [];
            // 获取所有歌手
            AdminService.getAllSingers().success(function(data) {

                if(data.success) {
                    $scope.allSingers = data.allSingers;
                }
            });
            // 获取所有专辑
            AdminService.getAllAlbums().success(function(data) {
                if(data.success) {
                    $scope.albums = data.albums;
                }
            });
            // 根据歌手id过滤专辑
            $scope.filterAlbums = function(album){
                return album.singer_id === $scope.selectedSingerId;
            };

        }
    };
});
