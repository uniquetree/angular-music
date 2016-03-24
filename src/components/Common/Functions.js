/**
 * Created by 郑树聪 on 2016/3/24.
 */

module.exports.getAreaName = function(code, areas) {

    var areaName = {};
    var len = areas.length, i, j, k;
    for(i=0; i<len; i++){
        if(areas[i].code === code){
            if(areas[i].district !== '') {
                areaName.district = areas[i].district;
                for(j=0; j< len; j++ ) {
                    if(areas[j].id === areas[i].parent) {
                        areaName.city = areas[j].city;
                        if(areas[j].province === areas[j].city) {
                            break;
                        } else {
                            for(k = 0; k < len; k++){
                                if(areas[k].id === areas[j].parent) {
                                    areaName.province = areas[k].province;
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
                        break;
                    }
                }
            } else if(areas[i].province !== ''){
                areaName.province = areas[i].province;
                break;
            }
            break;
        }
    }
    return areaName;
};
