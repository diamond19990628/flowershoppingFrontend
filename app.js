// app.js
const config = require("./config")
App({
  globalData:{
    isLogined:false,
    userInfo:null,
    loading:false
  },
  onLaunch() {
    wx.loadFontFace({
      family: 'Yellowtail',
      source: 'url("'+config.BASE_URL+'/fonts/Yellowtail-Regular.ttf")',
      global: true, // 设置为全局生效,
    });
  },
  onShow(){
    wx.request({
      url:config.BASE_URL+"/login/verify",
      method:"POST",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        
        switch(res.statusCode){
          case 200:
            const app = getApp();
            app.globalData.userInfo = res.data.data;
            app.globalData.isLogined = true;
          break;
          case 401:
            const app1 = getApp();
            app1.globalData.userInfo = null;
            app1.globalData.isLogined = false;
          break;
        }
      }
    })
  }
})
