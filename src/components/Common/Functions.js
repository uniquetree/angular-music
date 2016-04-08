/**
 * Created by 郑树聪 on 2016/3/24.
 */
//var jsmediatags = require("../vendors/jsmediatags.min.js");

module.exports.getAreaName = function(code, areas) {

    var areaName = {};
    var len = areas.length, i, j, k;
    for(i=0; i<len; i++){
        if(areas[i].code === code){
            if(areas[i].district !== '') {
                areaName.district = areas[i].district;
                areaName.districtCode = areas[i].code;
                for(j=0; j< len; j++ ) {
                    if(areas[j].id === areas[i].parent) {
                        areaName.city = areas[j].city;
                        areaName.cityCode = areas[j].code;
                        if(areas[j].province === areas[j].city) {
                            areaName.province = areas[j].province;
                            areaName.provinceCode = areas[j].code;
                            break;
                        } else {
                            for(k = 0; k < len; k++){
                                if(areas[k].id === areas[j].parent) {
                                    areaName.province = areas[k].province;
                                    areaName.provinceCode = areas[k].code;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else if(areas[i].city !== '') {
                areaName.city = areas[i].city;
                for(j = 0; j < len; j++){
                    if(areas[j].paidrent === areas[i].parent) {
                        areaName.province = areas[j].province;
                        areaName.provinceCode = areas[j].code;
                        break;
                    }
                }
            } else if(areas[i].province !== ''){
                areaName.province = areas[i].province;
                areaName.provinceCode = areas[i].code;
                break;
            }
            break;
        }
    }
    return areaName;
};

module.exports.formatDate = function(date) {

    date = new Date(date);
    return date.getFullYear() + '-' +
        (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' +
        (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
};

//module.exports.getMp3ImgById3 = function($q, url) {
//
//    var defer = $q.defer();
//
//    jsmediatags.read(url, {
//        onSuccess: function(tag) {
//            defer.resolve(tag);
//        },
//        onError: function(error) {
//            defer.reject(error);
//        }
//    });
//
//    return defer.promise;
//};
