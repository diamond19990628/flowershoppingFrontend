const lottie = require('lottie-miniprogram')
const animationData = require('./loadingData')
const app = getApp()
// pages/loading/loading.js
Page({
  onReady() {
    const query = wx.createSelectorQuery().in(this)

    query.select('#lottieCanvas').node().exec((res) => {
      const canvas = res[0] && res[0].node
      if (!canvas) {
        console.error('canvas 获取失败')
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('2d context 获取失败')
        return
      }

      lottie.setup(canvas)

      this.anim = lottie.loadAnimation({
        renderer: 'canvas',
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
          context: ctx,
          clearCanvas: true
        }
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    setTimeout(()=>{
      wx.navigateTo({
        url: '/pages/index/index'
      })
    },2000)
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