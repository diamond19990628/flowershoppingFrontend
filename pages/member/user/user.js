// pages/member/user/user.js
const xss = require('xss')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID_code:null,
    config:require("../../../config"),
    showdialog:false,
    nickName:"",
    phoneNumber:"",
    isErrorVisible:false,
    errorMessage:"",
    isLogined:app.globalData.isLogined,
    isAdmin:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  /**
   * 获取手机号
   */
  onGetPhoneNumber(e){
    let code = e.detail.code;
    if(code != null){
      wx.request({
        url:this.data.config.BASE_URL+"/login/phone",
        method:"POST",
        data:{
          code:code
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              let phoneNumber = res.data.data.phoneNumber;
              this.setData({
                phoneNumber:phoneNumber
              })
              let isNewUser = res.data.data.isNewUser;
              console.log(isNewUser);
              if(isNewUser=="true"){
                this.setData({
                  showdialog:true
                })
              }else{
                this.setData({
                  nickName:res.data.data.nickName,
                  showdialog:false
                });
                this.login();
              }
            break;
          }
        }
      })
    }
    
  },
  onInput(e){
    const nickName = e.detail.value;
    this.setData({
      nickName:xss(nickName)
    })
  },
  onNewUserLogin(){
    const nickName = this.data.nickName;
    if(nickName == ""){
      this.setData({
        isErrorVisible:true,
        errorMessage:"昵称不能为空"
      })
      return;
    }
    this.login();
  },
  login(){
      // 展示本地存储能力
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      const nickName = this.data.nickName;
      const phoneNumber = this.data.phoneNumber;
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, 
          const code = res.code;
          wx.request({
            url:this.data.config.BASE_URL+"/login",
            method:"GET",
            data:{
              code : code,
              nickName:nickName,
              phoneNumber:phoneNumber
            },
            success:(res)=>{
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
                  const app = getApp();
                  app.globalData.isLogined = true;
                  app.globalData.userInfo = res.data.data;
                  this.setData({
                    nickName:res.data.data.nickName,
                    showdialog:false,
                    isLogined: true,
                    isAdmin:res.data.data.isAdmin
                  })
              }
            },
            fail(error){
              console.log(error);
            }
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const app = getApp()

    this.setData({
      isLogined: app.globalData.isLogined,
      nickName:app.globalData.userInfo.nickName,
      isAdmin:app.globalData.userInfo.isAdmin
    })
  },
  toAdmin(){
    wx.redirectTo({
      url:"/pages/manager/index/index"
    })
  },
  toOrder(){
    wx.redirectTo({
      url:"./myOrder"
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})