// app.js
const config = require("./config")
App({
  globalData:{
    isLogined:false,
    userInfo:null
  },
  onLaunch() {
    wx.loadFontFace({
      family: 'Yellowtail',
      source: 'url("http://192.168.3.68:8080/fonts/Yellowtail-Regular.ttf")',
      global: true, // 设置为全局生效,
    });
  },
  
  globalData: {
    userInfo: null
  }
})
