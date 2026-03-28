const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:require("../../../config"),
    shoppingCartList:[],
    isErrorVisible:false,
    errorMessage:"",
    isLogined:app.globalData.isLogined,
    isConfirmDialogShow:false,
    deleteTargetProduct_id:0,
    user_id:0
  },
  /**
   * 查询自己的购物车
   */
  onLoadingShoppingCart(){
    if(!this.data.isLogined){
      this.setData({
        errorMessage:"请先登录才能查看购物车",
        isErrorVisible:true
      })
      return;
    }
    const app = getApp();
    const user_id = app.globalData.userInfo.user_id;
    wx.request({
      url:this.data.config.BASE_URL+"/member/shoppingCart/"+user_id,
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.setData({
              shoppingCartList:res.data.data
            })
          break;
          case 401:
            this.setData({
              isErrorVisible:true,
              errorMessage:"登录已失效，请重新登录"
            })
            const app = getApp();
            app.globalData.userInfo=null;
            app.globalData.isLogined=false;
          break;
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp()
    this.setData({
      isLogined: app.globalData.isLogined
    })
    this.onLoadingShoppingCart();
    
  },
  /**
   * 打开删除购物车的最终确认
   */
  onDelete(e){
    const product_id = e.currentTarget.dataset.product_id;
    const app = getApp();
    const user_id = app.globalData.userInfo.user_id;
    this.setData({
      isConfirmDialogShow:true,
      deleteTargetProduct_id:product_id,
      user_id:user_id
    })
  },
  /**
   * 取消删除
   */
  onConfirmClose(){
    this.setData({
      isConfirmDialogShow:false,
    })
  },
  /**
   * 删除购物车 
   */
  doDelete(){
    wx.request({
      url:this.data.config.BASE_URL+"/member/shoppingCart/"+this.data.user_id+"/"+this.data.deleteTargetProduct_id,
      method:"DELETE",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 204:
            this.setData({
              isConfirmDialogShow:false,
            })
            this.onLoadingShoppingCart();
          break;
          case 401:
            this.setData({
              isErrorVisible:true,
              errorMessage:"登录验证已经失效，请重新登录",
            })
            const app = getApp();
            app.globalData.userInfo=null;
            app.globalData.isLogined=false;
          break;
          case 404:
            this.setData({
              isErrorVisible:true,
              errorMessage:"删除失败，未找到该商品",
            })
            this.onLoadingShoppingCart();
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