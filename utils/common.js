/**
 * 后台:公共函数
 * Created by 郑树聪 on 2016/2/25.
 */

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

module.exports = Common;
