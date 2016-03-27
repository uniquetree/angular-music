/**
 * Angular项目前端配置
 * Created by 郑树聪 on 2016/2/28.
 */
var apiUser = 'api/user/';
var apiAdmin = 'api/admin/';

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

        getSingers: 'api/admin/getSingers',
        getSingerById: 'api/admin/getSingerById',
        addSinger: 'api/admin/addSinger',
        updateSinger: 'api/admin/updateSinger',
        deleteSingers: 'api/admin/deleteSingers',

        getAlbums: 'api/admin/getAlbums',
        getAlbumById: 'api/admin/getAlbumById',
        getAlbumBySingerId: 'api/admin/getAlbumBySingerId',
        addAlbum: 'api/admin/addAlbum',
        updateAlbum: 'api/admin/updateAlbum',
        deleteAlums: 'api/admin/deleteAlums'
    }
};
