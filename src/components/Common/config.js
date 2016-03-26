/**
 * Angular项目前端配置
 * Created by 郑树聪 on 2016/2/28.
 */

module.exports = {
    musicApp: angular.module('musicApp', ['ngRoute', 'ui.bootstrap']),
    base_url: 'http://localhost:3000/',
    api: {
        // 用户操作
        register: 'api/user/register',
        login: 'api/user/login',
        logout: 'api/user/logout',
        // 管理中心
        updateUserInfo: 'api/user/updateUserInfo',
        getMenuByRole: 'api/admin/getMenuByRole',
        getAreas: 'api/admin/getAreas',
        addSinger: 'api/admin/addSinger',
        getSingers: 'api/admin/getSingers',
        deleteSingers: 'api/admin/deleteSingers'
    }
};
