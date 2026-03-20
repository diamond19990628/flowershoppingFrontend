// pages/common/footer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:[],
    config:require('../../config'),
    current_parent_id:0
  },
  onCategoryChange(e){
    this.setData({
      current_parent_id:e.detail.category_id
    });
    this.loadingProduct();
  },
  loadingProduct(){
    wx.request({
      url:this.data.config.BASE_URL+"/member/product",
      method:"GET",
      data:{
        category_id:this.data.current_parent_id
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.setData({
              productList:res.data.data
            })
          break;
          case 400:

          break;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadingProduct();
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