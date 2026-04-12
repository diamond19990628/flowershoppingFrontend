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
})
