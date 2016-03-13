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
        role: 2,
        subMenus: [
            {name: '个人信息', page: 'userInfo'},
            {name: '编辑资料', page: 'editInfo'}
        ]
    },
    {
        name: '管理员中心',
        page: 'admin',
        role: 1,
        subMenus: []
    },
    {
        name: '管理员账号管理',
        page: 'supAdmin',
        role: 0,
        subMenus: []
    }
];
