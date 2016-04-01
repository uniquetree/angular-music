/**
 * 后台:公共函数
 * Created by 郑树聪 on 2016/2/25.
 */
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
var jsmediatags = require("jsmediatags");

var $config = require('../config/config');

var Common = function(){

};

Common.prototype.getCurrentTime = function(){

    var currentTime = new Date();
    return currentTime.toLocaleString().replace(/年|月/g,'-').replace(/日/g,'');
};

Common.prototype.successCallBack = function(isError, results, callback) {
    if(isError) {
        res.send(500);
        console.log(results.message);
    } else {
        callback(results);
    }
};

/**
 * 上传文件
 * @param req [Object] 发送的请求
 * @param options [Object] 参数对象[可选]
 * @param next [Function] 回调方法
 */
Common.prototype.uploadMp3 = function(req, options, next) {

    // 若未传参数options过来，则设置默认
    if(typeof options === 'function'){
        next = options;
        options = {};
    }
    //创建上传表单
    var form = new formidable.IncomingForm();
    //设置编辑
    form.encoding = options.encoding || 'utf-8';
    //文件大小
    form.maxFieldsSize = options.maxFieldsSize || 20 * 1024 * 1024;
    //设置上传目录
    form.uploadDir = $config.musicUploadDir;
    //解析
    form.parse(req, function (err, fields, files) {
        if(err) return next(true, err);
        for (x in files) {
            //后缀名
            var extName = /\.[^\.]+/.exec(files[x].name);
            var ext = Array.isArray(extName)
                ? extName[0]
                : '';
            //重命名，以防文件重复
            var avatarName = uuid() + ext;
            //移动的文件目录
            var newPath = form.uploadDir + avatarName;
            fs.renameSync(files[x].path, newPath);

            var tags = getMp3Tags(newPath);

            fields[x] = {
                size: files[x].size,
                path: newPath,
                name: files[x].name,
                type: files[x].type,
                extName: ext
            };
        }
        next(false, fields);
    });
};

/**
 * 删除磁盘上的文件
 * @param urls [Array] 要删除文件的绝对路径组成的数组
 * @returns {boolean}
 */
Common.prototype.deleteFiles = function(urls) {

    var isError = false;
    for(var i=0; i<urls.length; i++) {
        fs.unlink(urls[i], function (err) {

            if(err) {
                isError = true;
            }
        });
        if(isError) {
            return false;
        }
    }
};

/**
 * 获取mp3的id3文件标签信息
 * @param path [String] mp3文件路径
 * @returns tag 获取到的标签
 */
function getMp3Tags(path){

    var tags;
    new jsmediatags.Reader(newPath)
        .setTagsToRead(["title", "artist"])
        .read({
            onSuccess: function(tag) {
                tags = tag;
            },
            onError: function(error) {
                console.log(':(', error.type, error.info);
            }
        });
    return tags;
}

module.exports = Common;
