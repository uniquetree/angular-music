/**
 * Created by 郑树聪 on 2016/3/28.
 */
require('./AdminService');
require('../Services/SingerService');

var $config = require('../Common/config');

var musicApp = $config.musicApp;

// 歌手列表控制器
musicApp.controller('SingerCtrl', ['$rootScope', '$scope', '$location', '$state', '$log', 'SingerService', 'PageTableData',
    function($rootScope, $scope, $location, $state, $log, SingerService, PageTableData){

        $scope.singerTypes = $config.singerTypes;
        $scope.languages = $config.languages;

        // 获取歌手列表数据
        $scope.getSingers = function(nextPage, pageSize, keyword){

            var params = {
                currPage: nextPage || 1,
                pageSize: pageSize || 10
            };
            if(keyword) {
                params.keyword = keyword;
            }

            SingerService.getSingers(params).success(function(data) {

                if(data.success) {
                    $scope.singers = data.singers;

                    for(var i=0; i<data.singers.length; i++) {

                        for(var j=0; j<$config.singerTypes.length; j++) {
                            if($scope.singers[i].singer_type === $config.singerTypes[j].id) {
                                $scope.singers[i].singer_type_text = $config.singerTypes[j].text;
                                break;
                            } else {
                                $scope.singers[i].singer_type_text = '';
                            }
                        }
                        for(var k=0; k<$config.languages.length; k++) {
                            if($scope.singers[i].language === $config.languages[k].id) {
                                $scope.singers[i].language_text = $config.languages[k].text;
                                break;
                            } else {
                                $scope.singers[i].language_text = '';
                            }
                        }

                        PageTableData.itemIds.push($scope.singers[i].id);
                    }
                    PageTableData.pagination.totalItems = data.totalItems;
                    PageTableData.pagination.currPage = data.currPage;
                } else {
                    console.log(data.msg);
                }
            }).error(function(data) {
                console.log(data.msg);
            });
        };
        // 回车搜索专辑
        $scope.search = function($event) {

            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                var params = $event.target.value;
                $scope.getSingers(1, 10, params);
            }
        };

        $scope.singerInfo = {};
        // 修改歌手信息
        $scope.saveSingerInfo = function() {

            if($state.is('admin.singers.addSinger')) {

                SingerService.addSinger($scope.singerInfo).success(function(data){
                    if(data.success) {
                        alert('添加成功');
                        $location.search('subPage', 'singerList');
                    }
                });
            } else {

                SingerService.updateSinger($scope.singerInfo).success(function(data){
                    if(data.success) {
                        alert('更新成功');
                    }
                });
            }
        };
        // 删除单个歌手
        $scope.deleteSinger = function(id){

            if(angular.isUndefined(id)) {
                id = PageTableData.selectItemIds;
            }

            var ids = [];
            if(angular.isArray(id)) {
                if (id.length > 0){
                    ids = id;
                } else {
                    alert('请先勾选要删除的项！');
                    return;
                }
            } else {
                ids.push(id);
            }
            SingerService.deleteSingers(ids).success(function(data) {

                if(data.success) {
                    alert('删除成功');
                    $scope.getSingers();
                }
            });
        };
        // 跳转到某位歌手主页
        $scope.goToSingerPage = function(id) {

            $location.path('/singer?singerId=' + id);
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

            if(toState.name === 'admin.singers.addSinger') {
                $scope.breadcrumbs = [
                    {name: '歌手列表', state: 'admin.singers.singerList'},
                    {name: '添加歌手', state: false}
                ];
            } else if(toState.name === 'admin.singers.editSinger') {
                $scope.breadcrumbs = [
                    {name: '歌手列表', state: 'admin.singers.singerList'},
                    {name: '修改歌手信息', state: false}
                ];

                var id = toParams.singerId;
                SingerService.getSingerById(id).success(function(data){

                    if(data.success) {
                        $scope.singerInfo = data.singer;
                    }
                });

            } else {
                $scope.breadcrumbs = [
                    {name: '歌手列表', state: false}
                ];
            }
        });
    }
]);
