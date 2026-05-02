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
    config:require("../../../config"),
    isErrorVisible:false,
    errorMessage:"",
    refund_btn:"发起退款"
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
      status_id = 0;
    }
    if(index==1){
      status_id = 1;
    }
    if(index==2){
      status_id = 2;
    }
    if(index==3){
      status_id = 3;
    }
    if(index==4){
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
          case 401:
            this.setData({
              errorMessage:"登录已失效，请重新登录",
              isErrorVisible:true
            })
            const app = getApp();
            app.globalData.userInfo = null;
            app.globalData.isLogined = false;
            wx.redirectTo({
              url:"/pages/member/user/user"
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
          case 401:
            this.setData({
              errorMessage:"登录已失效，请重新登录",
              isErrorVisible:true
            })
            const app = getApp();
            app.globalData.userInfo = null;
            app.globalData.isLogined = false;
            wx.redirectTo({
              url:"/pages/member/user/user"
            })
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
   * 发起退款
   */
  onRefund(e){
    const order_no = e.currentTarget.dataset.order_no;
    const refund_amount = e.currentTarget.dataset.amount;
    wx.request({
      url:this.data.config.BASE_URL+"/pay/refund",
      method:"POST",
      data:{
        order_no:order_no,
        refund_amount:refund_amount
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
              refund_btn:"退款中"
            })
          break;
        }
      },
      complete:(res)=>{
        this.loadOrderList();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadOrderList();
  },
  /**
   * 搜索
   */
  searchWithText(){
    this.loadOrderList();
  },
  /**
   * 获取输入
   */
  onInput(e){
    const inputData = e.detail.value;
    this.setData({
      searchString:inputData
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