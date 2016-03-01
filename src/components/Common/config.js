/**
 * Angular项目前端配置
 * Created by 郑树聪 on 2016/2/28.
 */

module.exports = {
    musicApp: angular.module('musicApp', ['ngRoute', 'ui.bootstrap']),
    base_url: 'http://localhost:3000/',
    api: {
        register: 'api/register',
        login: 'api/login',
        logout: 'api/logout'
    }
};