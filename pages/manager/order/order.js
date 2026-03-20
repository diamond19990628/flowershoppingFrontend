// pages/manager/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchString:"",
    orderList:[],
    status_id:1,
    currentTab:0,
    order_id:0,
    config:require("../../../config")
  },
  switchTab(e){
    const index = e.currentTarget.dataset.index;

    this.setData({
      currentTab:index
    });
    this.loadOrderList();
  },
  loadOrderList(){
    let index = this.data.currentTab;
    let status_id = 0;
    if(index==0){
      status_id = 1;
    }
    if(index==1){
      status_id = 2;
    }
    if(index==2){
      status_id = 3;
    }
    if(index==3){
      status_id = 4;
    }
    wx.request({
      url:this.data.config.BASE_URL+"/orders",
      method:"GET",
      data:{
        searchString:this.data.searchString,
        status_id:status_id
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
        }
      }
    })
  },
  shippedFunction(e){
    const order_id = e.currentTarget.dataset.order_id;
    
    const status_id = e.currentTarget.dataset.status_id;
    wx.request({
      url:this.data.config.BASE_URL+"/orders/"+order_id,
      method:"PATCH",
      data:{
        status_id:status_id
      },
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.loadOrderList();
          break;
        }
      }
    })
  },
  navToOrderItem(e){
    const orderItems = e.currentTarget.dataset.items;
    wx.navigateTo({
      url:'/pages/manager/order/orderItem?Items='+encodeURIComponent(JSON.stringify(orderItems))
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadOrderList();
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