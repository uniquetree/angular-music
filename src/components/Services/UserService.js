/**
 * 用户相关服务
 * Created by 郑树聪 on 2016/4/9.
 */
var $config = require('../Common/config');

var musicApp = $config.musicApp;

musicApp.factory('UserService', ['$http', '$window', function($http, $window){

    return {
        // 注册服务
        register: function(username, email, password){

            return $http.post($config.api.register, {
                username: username,
                email: email,
                password: password
            });
        },
        // 登录服务
        login: function(email, password) {

            return $http.post($config.api.login, {
                email: email,
                password: password
            });
        },
        // 登出服务
        logout: function() {

            return $http.post($config.api.logout, {
                email: JSON.parse($window.sessionStorage.userInfo).email,
                token: $window.sessionStorage.token
            });
        },
        // 更新用户信息
        updateUserInfo: function(userInfo){

            return $http.post($config.api.updateUserInfo, userInfo);
        }
    };
}]);
