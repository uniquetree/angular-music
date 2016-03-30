/**
 * 后台:公共函数
 * Created by 郑树聪 on 2016/2/25.
 */
var fs = require('fs');

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

module.exports = Common;
