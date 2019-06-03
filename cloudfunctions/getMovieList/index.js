// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init()


// 云函数入口函数
exports.main = async(event, context) => {
  // const wxContext = cloud.getWXContext()
  return rp(`https://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`)
    .then(function(res) {
      return res;
    })
    .catch(function(err) {
      return err;
    });
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}