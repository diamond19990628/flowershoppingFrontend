// pages/manager/index.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    username:wx.getStorageSync('nickName'),
    config:require("../../../config.js"),
    stock_count:0,
    todayorderList:[],
    waitShippedOrderList:[]
  },
  selectAllOrder(){
    wx.request({
      url:this.data.config.BASE_URL+"/orders",
      data:{
        is_today_order:true
      },
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
              todayorderList:res.data.data
            })
          break;
        }
      }
    })
  },
  waitshipped(){
    wx.request({
      url:this.data.config.BASE_URL+"/orders",
      method:"GET",
      data:{
        status_id:1
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
              waitShippedOrderList:res.data.data
            })
          break;
        }
      }
    })
  },
  navToGoods(){
    wx.navigateTo({
      url:'/pages/manager/product/product'
    })
  },
  navToOrder(){
    wx.navigateTo({
      url:'/pages/manager/order/order'
    })
  },
  navToCategory(){
    wx.navigateTo({
      url:'/pages/manager/category/category'
    })
  },
  navToNotice(){
    wx.navigateTo({
      url:'/pages/manager/information/informations'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let count = 0;
    wx.request({
      url:this.data.config.BASE_URL+"/product",
      method:"GET",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            for(var i = 0;i<res.data.data.length;i++){
              if(res.data.data[i].stock<60){
                count++;
              }
            }
            this.setData({
              stock_count:count
            })
            break;
            case 401:
              console.log(res);
              break;
            case 403:
              wx.reLaunch({
                url: '/pages/index/index'
              })
              break;
        }
        
      },fail:(error)=>{
        console.log(error);
        
      }

    })
    this.selectAllOrder();
    this.waitshipped();
  },
  toUser(){
    wx.redirectTo({
      url:"/pages/index/index"
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