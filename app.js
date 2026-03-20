// app.js
const config = require("./config")
App({
  onLaunch() {
    wx.loadFontFace({
      family: 'Yellowtail',
      source: 'url("http://192.168.3.68:8080/fonts/Yellowtail-Regular.ttf")',
      global: true, // 设置为全局生效,
    });
  },
  login(){
    return new Promise((resolve,reject)=>{
      // 展示本地存储能力
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      const config = require("./config");
      // 登录(暂时关闭)
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, 
          const code = res.code;
          wx.request({
            url:config.BASE_URL+"/login",
            method:"GET",
            data:{
              code : code
            },
            success(res){
              console.log(res);
              if(res.statusCode == 200){
                wx.setStorageSync("token", res.data.token);
                wx.setStorageSync("nickName", res.data.data.nickName);
                const setCookie =
                    res.header['Set-Cookie'] ||
                    res.header['set-cookie']

                  if (setCookie) {
                    // 提取 JSESSIONID=xxxx
                    const match = setCookie.match(/JSESSIONID=([^;]+)/)
                    if (match && match[1]) {
                      const jsessionid = match[1]
                      wx.setStorageSync('JSESSIONID', jsessionid)
                    }
                  }
                resolve('yes')
              }
            },
            fail(error){
              console.log(error);
            }
          })
        }
      })
    })
  },
  globalData: {
    userInfo: null
  }
})
