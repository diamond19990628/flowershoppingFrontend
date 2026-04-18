// pages/member/user/myOrder.js
const xss = require('xss')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[],
    config:require("../../../config"),
    isErrorVisible:false,
    errorMessage:"",
    status_id:0,
    isLogined:false,
    currentMenu:1,
    btn_name_list:["立即支付","催发货","确认收货","申请售后"],
    targetStatus:0,
    showQR:false,
    searchString:"",
    requestNo:"",
    payLoadingVisible:false
  },
  /**
   * 加载数据
   */
  loadingOrderInfo(){
    const app = getApp();
    const isLogined = app.globalData.isLogined;
    this.setData({
      isLogined:isLogined
    })
    if(!isLogined){
      this.setData({
        isErrorVisible:true,
        errorMessage:"登录已失效，请重新登录",
      })
    }
    const userInfo = app.globalData.userInfo;
    const user_id = userInfo.user_id;
    wx.request({
      url:this.data.config.BASE_URL+"/member/orders/"+user_id,
      method:"GET",
      data:{
        status_id:this.data.status_id,
        order_no:this.data.searchString
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
              orderList:res.data.data,
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadingOrderInfo();
  },
  /**
   * 返回上个页面
   */
  onback(){
    wx.redirectTo({
      url:"./user"
    })
  },
  /**
   * 改变当前选择
   */
  changeCurrentTab(e){
    const currentTab = e.currentTarget.dataset.index;
    let status_id = 0;
    if(currentTab==1){
      status_id = 0;
    }else if(currentTab==2){
      status_id = 1;
    }else if(currentTab==3){
      status_id = 2;
    }else if(currentTab==4){
      status_id = 3;
    }
    this.setData({
      currentMenu:currentTab,
      status_id:status_id
    })
    this.loadingOrderInfo();
  },
  /**
   * 改变订单状态
   */
  changeOrderStatus(e){
    const currentMenu = e.currentTarget.dataset.btn_index;
    const order_no = e.currentTarget.dataset.order_no;
    const total_amount = e.currentTarget.dataset.total_amount;
    if(currentMenu == 0){
      this.setData({
        payLoadingVisible:true
      })
      // 调用支付接口
      wx.request({
        url:this.data.config.BASE_URL+"/member/orders/wechat-pay",
        method:"POST",
        data:{
          order_no:order_no,
          total_amount:total_amount
        },
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr:res.data.data.nonceStr,
                package:res.data.data.package,
                signType:res.data.data.signType,
                paySign:res.data.data.paySign,
                success:(res)=>{
                  this.setData({
                    payLoadingVisible:false
                  })
                  this.loadingOrderInfo();
                },
                fail:(res)=>{
                  this.setData({
                    payLoadingVisible:false
                  })
                  this.loadingOrderInfo();
                }
              })
            break;
            case 401:
              this.setData({
                isErrorVisible:true,
                errorMessage:"登录已失效，请重新登录"
              })
              wx.redirectTo({
                url:"/pages/member/user/user"
              })
            break;
          }
        }
      })
    }
    if(currentMenu==1 || currentMenu == 3){
      this.setData({
        showQR:true
      })
    }
    if(currentMenu==2){
      this.setData({
        targetStatus:3
      })
      wx.request({
        url:this.data.config.BASE_URL+"/member/orders/"+order_no,
        method:"PATCH",
        data:{
          status_id:this.data.targetStatus
        },
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.loadingOrderInfo();
            break;
            case 401:
              this.setData({
                isErrorVisible:true,
                errorMessage:"登录已失效，请重新登录"
              })
              wx.redirectTo({
                url:"./user"
              })
            break;
            case 400:
              this.setData({
                isErrorVisible:true,
                errorMessage:"该订单已经失效，请重新下单"
              })
              this.loadingOrderInfo();
            break;
          }
        }
      })
    }
  },

  /**
   * 关闭二维码
   */
  closeDialog(){
    this.setData({
      showQR:false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 获取输入内容
   */
  onInput(e){
    const searchString = e.detail.value;
    this.setData({
      searchString:xss(searchString)
    })
  },
  /**
   * 通过订单信息查询
   */
  searchOrderWithOrderNo(){
    this.loadingOrderInfo();
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