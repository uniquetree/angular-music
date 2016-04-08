/**
 * 后台:公共函数
 * Created by 郑树聪 on 2016/2/25.
 */
var Q = require('q');
var formidable = require('formidable');
var uuid = require('node-uuid');
var fs = require('fs');
var jsmediatags = require("jsmediatags");
var btoa = require('btoa');

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
 */
Common.prototype.uploadMp3 = function(req, options, callback) {

    var deferred = Q.defer();

    // 若未传参数options过来，则设置默认
    if(typeof options === 'function'){
        callback = options;
        options = {};
    } else if(typeof options === 'undefined') {
        options = {};
    }

    //创建上传表单
    var form = new formidable.IncomingForm();
    //设置编码
    form.encoding = options.encoding || 'utf-8';
    //设置文件最大大小
    form.maxFieldsSize = options.maxFieldsSize || 20 * 1024 * 1024;
    //设置上传目录
    form.uploadDir = $config.musicUploadDir;
    //解析
    form.parse(req, function (err, fields, files) {

        if(err) {
            deferred.reject(err);
        } else {
            for (x in files) {
                if(files[x].name) {
                    //后缀名
                    var extName = /\.[^\.]+/.exec(files[x].name);
                    var ext = Array.isArray(extName) ? extName[0] : '';
                    //重命名，以防文件重复
                    var avatarName = uuid() + ext;
                    //移动的文件目录
                    var newPath = form.uploadDir + avatarName;
                    fs.renameSync(files[x].path, newPath);

                    newPath = newPath.replace('../', $config.baseUrl);
                    fields[x] = {
                        size: files[x].size,
                        path: newPath,
                        //type: files[x].type,
                        //extName: ext,
                        name: files[x].name
                    };
                }
            }
            deferred.resolve(fields);
        }
    });
    return deferred.promise.nodeify(callback);
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
 */
Common.prototype.getMp3Tags = function(fields, callback){

    var deferred = Q.defer();
    jsmediatags.read(fields['file'].path, {
        onSuccess: function(tag) {

            saveMusicImg(tag.tags).then(function(imagePath) {

                tag = {
                    name: tag.tags.title || fields['file'].name,
                    tag_singer_name: tag.tags.artist,
                    tag_album_name: tag.tags.album,
                    year: tag.tags.year,
                    url: fields['file'].path,
                    song_img: imagePath,
                    size: fields['file'].size,
                    singer_id: fields['singer_id'],
                    album_id: fields['album_id'],
                    language: fields['language']
                };
                deferred.resolve(tag);
            });
        },
        onError: function(error) {
            deferred.reject(error);
        }
    });
    return deferred.promise.nodeify(callback);
};

Common.prototype.getMp3ImgById3 = function(url, callback) {

    var deferred = Q.defer();

    jsmediatags.read(url, {
        onSuccess: function(tag) {
            deferred.resolve(tag.tags);
        },
        onError: function(error) {
            deferred.reject(error);
        }
    });

    return deferred.promise.nodeify(callback);
};

module.exports = Common;

/**
 * 将图片二进制数据保存为文件
 * @param tags 读取MP3文件得到的id3标签信息
 */
function saveMusicImg(tags, callback) {

    var deferred = Q.defer();
    if( "picture" in tags ) {
        var image = tags.picture;
        var base64String = "";
        for (var i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
        }
        var imgName = uuid() + (image.format.replace('image/', '.'));
        var imgPath = $config.songImgDir + imgName;
        var dataBuffer = new Buffer(btoa(base64String), 'base64');
        fs.writeFile(imgPath, dataBuffer, function(err) {
            if(err){
                deferred.reject(err);
            }else{
                imgPath = imgPath.replace('../', $config.baseUrl);
                deferred.resolve(imgPath);
            }
        });
    } else {
        deferred.reject('歌曲不存在图片');
    }
    return deferred.promise.nodeify(callback);
}
