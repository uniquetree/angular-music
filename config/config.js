/**
 * 后台配置,MySQL数据库联接配置
 * Created by 郑树聪 on 2016/2/16.
 */
module.exports = {
    // 开发环境
    mysql_development: {
        host: '127.0.0.1',
        user: 'root',
        password: 'mysql',
        database:'angular_music',
        port: 3306
    },
    // 线上环境
    mysql_production: {
        host: '115.28.28.3',
        user: 'root',
        password: 'zsc19930817',
        database:'angular_music',
        port: 3306
    },
    secretToken: 'fas3456daj8lf6kjg3asldk2mvdsfasd23gert4ddg'
};

// 管理中心菜单配置
module.exports.adminMenus = [
    {
        name: '个人中心',
        page: 'user',
        icon: 'users',
        role: 2,
        subMenus: [
            {name: '个人信息', page: 'userInfo', icon: 'user', role: 2},
            {name: '编辑资料', page: 'editInfo', icon: 'edit', role: 2}
        ]
    },
    {
        name: '音乐管理',
        page: 'admin',
        icon: 'music',
        role: 1,
        subMenus: [
            {name: '歌手列表', page: 'singers', icon: 'users', role: 1},
            {name: '专辑列表', page: 'Albums', icon: 'tags', role: 1},
            {name: '音乐列表', page: 'songs', icon: 'th-list', role: 1},
            {name: '上传音乐', page: 'uploadMusic', icon: 'upload', role: 1}
        ]
    },
    {
        name: '账号管理',
        page: 'supAdmin',
        icon: 'music',
        role: 1,
        subMenus: [
            {name: '普通用户列表', page: 'users', icon: 'user', role: 1},
            {name: '管理员列表', page: 'admin', icon: 'user-plus', role: 1},
            {name: '超级管理员列表', page: 'supAdmin', icon: 'user-secret', role: 0}
        ]
    }
];
