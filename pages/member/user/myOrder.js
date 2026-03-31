// pages/member/user/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    config:require("../../../config"),
    isErrorVisible:false,
    errorMessage:"",
    status_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if(userInfo==null){
      this.setData({
        isErrorVisible:true,
        errorMessage:"登录已失效，请重新登录"
      })
    }
    const user_id = userInfo.user_id;
    wx.request({
      url:this.data.config.BASE_URL+"/member/orders/"+user_id,
      method:"GET",
      data:{
        status_id:this.data.status_id
      },
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.setData({
              orderList:res.data.data
            })
          break;
          case 401:
            this.setData({
              isErrorVisible:true,
              errorMessage:"登录已失效，请重新登录"
            })
          break;
        }
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