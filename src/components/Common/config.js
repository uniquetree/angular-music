/**
 * Angular项目前端配置
 * Created by 郑树聪 on 2016/2/28.
 */
var base_url = 'http://localhost:3000/';

module.exports = {
    musicApp: angular.module('musicApp', ['ngRoute', 'ui.bootstrap']),
    base_url: base_url,
    api: {
        // 用户操作
        register: base_url + 'api/user/register',
        login: base_url + 'api/user/login',
        logout: base_url + 'api/user/logout',
        // 管理中心
        updateUserInfo: base_url + 'api/user/updateUserInfo',
        getMenuByRole: base_url + 'api/admin/getMenuByRole',
        getAreas: base_url + 'api/admin/getAreas',
        // 歌手
        getAllSingers: base_url + 'api/admin/getAllSingers',
        getSingers: base_url + 'api/admin/getSingers',
        getSingerById: base_url + 'api/admin/getSingerById',
        addSinger: base_url + 'api/admin/addSinger',
        updateSinger: base_url + 'api/admin/updateSinger',
        deleteSingers: base_url + 'api/admin/deleteSingers',
        // 专辑
        getAlbums: base_url + 'api/admin/getAlbums',
        getAlbumById: base_url + 'api/admin/getAlbumById',
        getAlbumBySingerId: base_url + 'api/admin/getAlbumBySingerId',
        addAlbum: base_url + 'api/admin/addAlbum',
        updateAlbum: base_url + 'api/admin/updateAlbum',
        deleteAlumsById: base_url + 'api/admin/deleteAlumsById',
        deleteAlbumsBySingerId: base_url + 'api/admin/deleteAlbumsBySingerId',
        // 歌曲
        getSongsByPage: base_url + 'api/admin/getSongsByPage',
        getSongById: base_url + 'api/admin/getSongById',
        uploadSong: base_url + 'api/admin/uploadSong',
        updateSong: base_url + 'api/admin/updateSong',
        deleteSongsByIds: base_url + 'api/admin/deleteSongsById'
    }
};

module.exports.singerTypes = [
    {id: 1, text: '男歌手'},
    {id: 2, text: '女歌手'},
    {id: 3, text: '乐队组合'}
];

module.exports.languages = [
    {id: 1, text: '华语'},
    {id: 2, text: '粤语'},
    {id: 3, text: '欧美'},
    {id: 4, text: '日语'},
    {id: 5, text: '韩语'},
    {id: 6, text: '小语种'}
];