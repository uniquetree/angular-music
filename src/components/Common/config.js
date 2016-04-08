/**
 * Angular项目前端配置
 * Created by 郑树聪 on 2016/2/28.
 */
var base_url = 'http://localhost:3000/';
var singer_url = 'api/singer/';
var album_url = 'api/album/';
var song_url = 'api/song/';
var playlist_url = 'api/playlist/';

module.exports = {
    musicApp: angular.module('musicApp', ['ngRoute', 'ui.bootstrap', 'angular-loading-bar', 'angularFileUpload']),
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
        getAllSingers: base_url + singer_url + 'getAllSingers',
        getSingers: base_url + singer_url + 'getSingers',
        getSingerById: base_url + singer_url + 'getSingerById',
        addSinger: base_url + singer_url + 'addSinger',
        updateSinger: base_url + singer_url + 'updateSinger',
        deleteSingers: base_url + singer_url + 'deleteSingers',
        // 专辑
        getAllAlbums: base_url + album_url + 'getAllAlbums',
        getAlbums: base_url + album_url + 'getAlbums',
        getAlbumById: base_url  + album_url+ 'getAlbumById',
        getAlbumsBySingerId: base_url + album_url + 'getAlbumsBySingerId',
        addAlbum: base_url + album_url + 'addAlbum',
        updateAlbum: base_url + album_url + 'updateAlbum',
        deleteAlumsById: base_url + album_url + 'deleteAlumsById',
        deleteAlbumsBySingerId: base_url + album_url + 'deleteAlbumsBySingerId',
        // 歌曲
        getSongsByPage: base_url + song_url + 'getSongsByPage',
        getSongById: base_url + song_url  + 'getSongById',
        getSongsByPlaylistId: base_url + song_url + 'getSongsByPlaylistId',
        uploadSongs: base_url + song_url  + 'uploadSongs',
        updateSong: base_url + song_url  + 'updateSong',
        deleteSongsByIds: base_url + song_url  + 'deleteSongsById',
        // 歌单
        getPlayListsByUserCreate: base_url + playlist_url  + 'getPlayListsByUserCreate',
        getPlayListsByUserCollect: base_url + playlist_url  + 'getPlayListsByUserCollect',
        addPlaylist: base_url + playlist_url  + 'addPlaylist',
        updatePlaylist: base_url + playlist_url  + 'updatePlaylist',
        deletePlaylistById: base_url + playlist_url  + 'deletePlaylistById'
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