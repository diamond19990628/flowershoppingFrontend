const xss = require('xss')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informationList:[],
    config:require("../../../config"),
    showDialog:false
  },
  loadingInformations(){
    wx.request({
      url:this.data.config.BASE_URL+'/informations',
      method:"GET",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.setData({
              informationList:res.data.data
            })
          break;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadingInformations();
  },
  /**
   * 打开遮罩层
   */
  openDialog(){
    this.setData({
      showDialog:true
    })
  },
  /**
   * 关闭遮罩层
   */
  closeDialog(){
    this.setData({
      showDialog:false
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