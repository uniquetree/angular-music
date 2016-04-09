/**
 * 用户操作服务、控制器,登录/登出
 * Created by 郑树聪 on 2016/2/17.
 */
require('../Services/UserService');

var $config = require('../Common/config');

$config.musicApp.controller('UserCtrl', ['$rootScope', '$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function($rootScope, $scope, $location, $window, UserService, AuthenticationService){

        // 注册事件
        $scope.register = function(username, email, password1, password2) {
            if(!username){
                $scope.username = '请输入用户名';
            } else if(!email){
                $scope.message = '请输入邮箱';
            } else if(!password1){
                $scope.message = '请输入密码';
            } else if(password1 !== password2){
                $scope.message = '两次密码不一致';
            } else{
                $scope.disabled = true;   //防止表单重复提交
                $scope.message = false;
                var password = CryptoJS.SHA256(password1).toString();
                //password = CryptoJS.HmacSHA256(password,'ustc').toString();
                password = password1;
                UserService.register(username, email, password).success(function(data, status, headers, config){
                    if(data.success) {
                        $scope.disabled = false;
                        $location.path('/login');
                    } else {
                        console.log(data.msg);
                        $scope.message = data.msg;
                    }
                })
                .error(function(data, status, headers, config){
                    $scope.message = "加载失败，请重新再试";
                    $scope.disabled = false;
                });
            }
        };

        // 登录事件
        $scope.login = function(email, password) {
            if (typeof email !== 'undefined' && typeof password !== 'undefined') {

                UserService.login(email, password).success(function(data) {

                    if(data.success) {
                        // 登录成功
                        AuthenticationService.isAuthenticated = true;
                        if(data.type === 0 || data.type === 1) {
                            AuthenticationService.isAdmin = true;
                        }
                        $window.sessionStorage.token = data.token;
                        $window.sessionStorage.userInfo = JSON.stringify(data.user);
                        var prevUrl = $rootScope.prevUrl;
                        if(typeof prevUrl !== 'undefined') {
                            $location.path(prevUrl);
                        } else {
                            $location.path('/#/');
                        }
                    } else {
                        $scope.message = data.msg;
                        delete $window.sessionStorage.token;
                    }
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    delete $window.sessionStorage.token;
                });
            } else if(typeof email === 'undefined') {
                //$scope.emailTooltipIsOpen = !$scope.emailTooltipIsOpen;
                //$scope.message = '邮箱不能为空';
            } else if(typeof password === 'undefined') {
                //$scope.message = '密码不能为空';
            }
        };

        // 登出事件
        $scope.logout = function logout() {

            UserService.logout().success(function(data) {
                if (AuthenticationService.isAuthenticated) {
                    AuthenticationService.isAuthenticated = false;
                    AuthenticationService.isAdmin = false;
                    $window.sessionStorage.clear();
                    $location.path('/#/');
                }
            }).error(function(status, data){

            });
        };
    }
]);
