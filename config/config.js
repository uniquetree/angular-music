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
