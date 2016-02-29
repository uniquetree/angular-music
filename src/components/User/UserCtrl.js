/**
 * 用户操作控制器,登录/登出
 * Created by 郑树聪 on 2016/2/17.
 */
var $config = require('../Config/config');

$config.musicApp.factory('UserService', ['$http', function($http){
    return {
        // 注册服务
        register: function(username, email, password){

            var url = $config.base_url + $config.api.register;
            return $http.post(url, {
                username: username,
                email: email,
                password: password
            });
        },
        // 登录服务
        login: function(email, password) {

            var url = $config.base_url + $config.api.login;
            return $http.post(url, {
                email: email,
                password: password
            });
        },
        // 登出服务
        logout: function() {

        }
    };
}]).controller('UserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
    function($scope, $location, $window, UserService, AuthenticationService){

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
                UserService.register(username, email, password1).success(function(data, status, headers, config){
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
                        $location.path('/');
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
            if (AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = false;
                delete $window.sessionStorage.token;
                $location.path('/');
            }
        };
    }
]);