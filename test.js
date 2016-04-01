/**
 * Created by 郑树聪 on 2016/3/31.
 */
var fs = require('fs');

var jsmediatags = require("jsmediatags");

//jsmediatags.read("./app/resources/test.mp3", {
//    onSuccess: function(tag) {
//        console.log(tag);
//    },
//    onError: function(error) {
//        console.log(':(', error.type, error.info);
//    }
//});

new jsmediatags.Reader("./app/resources/test.mp3")
    .setTagsToRead(["title", "artist"])
    .read({
        onSuccess: function(tag) {
            console.log(tag.tags);
        },
        onError: function(error) {
            console.log(':(', error.type, error.info);
        }
    });
