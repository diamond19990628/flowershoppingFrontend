// app.js
App({
  onLaunch() {
    
  },
  login(){
    return new Promise((resolve,reject)=>{
      // 展示本地存储能力
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      const config = require("config.js");
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
                this.globalData.isLogin = true;
                this.globalData.userInfo = res.data.data;
                resolve(res.data)
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
