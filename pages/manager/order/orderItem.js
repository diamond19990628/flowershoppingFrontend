// pages/manager/order/orderItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderItems:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const items = JSON.parse(decodeURIComponent(options.Items));
    this.setData({
      orderItems:{
        ...items,
        delivery_date:this.formatDateTime(items.delivery_date),
        create_time:this.formatDateTime(items.create_time)
      }
    })
  },
  formatDateTime(dateStr) {
    if (!dateStr) return ''
    return dateStr.replace('T', ' ').slice(0, 16)
  },

  /**
   * 复制功能
   */
  copyText(e){
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data:text,
      success:()=>{
        wx.showToast({
          title: '复制成功',
          icon: 'success'
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