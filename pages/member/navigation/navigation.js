// pages/member/navigation/navigation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 使用导航
   */
  openLocation(){
    wx.openLocation({
      latitude: 31.92,   // 目标纬度
      longitude: 118.83, // 目标经度
      name: '汀山花语',
      address: '南京市江宁区秣陵街道诚信大道669号金隅六维IN有街市2楼(麦当劳楼上)',
      scale: 18
    })
  },
  /**
   * 直接打电话联系客服
   */
  onCallPhone(){
    wx.makePhoneCall({
      phoneNumber: '15195983633',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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