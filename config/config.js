/**
 * 后台配置,MySQL数据库联接配置
 * Created by 郑树聪 on 2016/2/16.
 */
// multipleStatements属性使数据库可以实现Multiple statement queries
module.exports = {
    // 开发环境
    mysql_development: {
        host: '127.0.0.1',
        user: 'root',
        password: 'mysql',
        database:'angular_music',
        port: 3306,
        multipleStatements: true
    },
    // 线上环境
    mysql_production: {
        host: '115.28.28.3',
        user: 'root',
        password: 'zsc19930817',
        database:'angular_music',
        port: 3306,
        multipleStatements: true
    },
    secretToken: 'fas3456daj8lf6kjg3asldk2mvdsfasd23gert4ddg',
    musicUploadDir: '../app/resources/music/',
    songImgDir: '../app/resources/images/',
    baseUrl: 'http://localhost:3000/'
};

module.exports.tableName = {
    language_tb: 'language',
    nation_tb: 'nation',
    user_tb: 'user',
    playlist_tb: 'playlist',
    playlist_user_tb: 'playlist_user',
    playlist_song_tb: 'playlist_song',
    singer_tb: 'singer',
    album_tb: 'album',
    song_tb: 'song'
};

// 管理中心菜单配置
module.exports.adminMenus = [
    {
        name: '个人中心',
        state: 'user',
        icon: 'home',
        role: 2,
        subMenus: [
            {name: '我的主页', state: 'admin.userInfo', icon: 'user', role: 2},
            {name: '编辑资料', state: 'admin.editInfo', icon: 'edit', role: 2}
        ]
    },
    {
        name: '音乐管理',
        state: 'admin',
        icon: 'music',
        role: 1,
        subMenus: [
            {name: '歌手列表', state: 'admin.singers', icon: 'users', role: 1},
            {name: '专辑列表', state: 'admin.albums', icon: 'tags', role: 1},
            {name: '音乐列表', state: 'admin.songs', icon: 'list', role: 1},
            {name: '上传音乐', state: 'admin.uploadMusic', icon: 'upload', role: 1}
        ]
    },
    {
        name: '账号管理',
        state: 'supAdmin',
        icon: 'certificate',
        role: 1,
        subMenus: [
            {name: '普通用户列表', state: 'admin.users', icon: 'user', role: 1},
            {name: '管理员列表', state: 'admin.admins', icon: 'user-plus', role: 1}
            //{name: '超级管理员列表', state: 'supAdmins', icon: 'user-secret', role: 0}
        ]
    }
];
