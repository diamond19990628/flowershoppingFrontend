// pages/member/Product/item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:null,
    prevUrl:"",
    product_id:0,
    showServiceDialog:false,
    config:require("../../../config"),
    cardList:[],
    currentCard:0,
    isShowCommentDialog:false,
    isErrorVisible:false,
    errorMessage:"",
    currentType:"",
    comment:"",
    isConfirmDialogShow:false,
    user_id:0,
    isSuccessShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const items = JSON.parse(decodeURIComponent(options.Items));
    const prevURL = options.prevUrl;
    this.setData({
      items:items,
      prevUrl:prevURL
    })
  },
  /**
   * 返回主页面
   */
  onBack(){
    wx.navigateBack()
  },
  /**
   * 添加购物车
   */
  insertShoppingCart(e){
    const product_id = e.currentTarget.dataset.product_id;
    const app = getApp();
    const user = app.globalData.userInfo;
    if(user==null){
      this.setData({
        errorMessage:"请先登录，才能添加购物车",
        isErrorVisible:true
      })
      return;
    }
    this.setData({
      showServiceDialog:true,
      product_id:product_id,
      user_id:user.user_id
    })
  },
  /**
   * 取消加入
   */
  onClose(){
    this.setData({
      showServiceDialog:false
    })
  },
  /**
   * 选择是否匿名
   */
  selectType(e){
    const currentType = e.currentTarget.dataset.type;
    this.setData({
      currentType:currentType
    })
  },
  /**
   * 选择生日卡
   */
  selectCard(e){
    const card_id = e.currentTarget.dataset.card_id;
    this.setData({
      currentCard:card_id
    })
  },
  /**
   * 确认匿名
   */
  onConfirm(){
    const currentCard_id = this.data.currentCard;
    const currentType = this.data.currentType;
    if(currentCard_id == 0){
      this.setData({
        errorMessage:"还没选择祝福卡类型",
        isErrorVisible:true
      })
      return;
    }
    if(currentType == ""){
      this.setData({
        errorMessage:"还没选择是否匿名",
        isErrorVisible:true
      })
      return;
    }
    this.setData({
      showServiceDialog:false,
      isShowCommentDialog:true
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
    wx.request({
      url:this.data.config.BASE_URL+"/member/card",
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
              cardList:res.data.data
            })
          break;
        }
      }
    })
  },
  /**
   * 关闭代写页面
   */
  onCloseComment(){
    this.setData({
      showServiceDialog:true,
      isShowCommentDialog:false
    })
  },

  /**
   * 获取输入内容
   */
  onInput(e){
    const comment = e.detail.value;
    this.setData({
      comment:comment
    })
  },

  /**
   * 最终确认的取消
   */
  onConfirmClose(){
    this.setData({
      isConfirmDialogShow:false
    })
  },
  /**
   * 最终确认
   */
  onFinalConfirm(){
    this.createShoppingCart();
  },

  /**
   * 确认创建购物车
   */
  onConfirmShoppingCart(){
    const comment = this.data.comment;
    if(comment==""){
      this.setData({
        isConfirmDialogShow:true
      })
      return;
    }
    this.createShoppingCart();
  },
  /**
   * 创建购物车
   */
  createShoppingCart(){
    let is_anonymous = this.data.currentType;
    let anonymous_status = 0;
    if(is_anonymous=="named"){
      anonymous_status = 0;
    }else if(is_anonymous=="anonymous"){
      anonymous_status = 1;
    }
    wx.request({
      url:this.data.config.BASE_URL+"/member/shoppingCart",
      method:"POST",
      data:{
        product_id:this.data.product_id,
        card_id:this.data.currentCard,
        user_id:this.data.user_id,
        comment:this.data.comment,
        is_anonymous:anonymous_status,
        quantity:1
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
              isSuccessShow:true
            })
          break;
        }
      }
    })
  },
  /**
   * 查看购物车
   */
  navToCart(){
    wx.redirectTo({
      url: '../shoppingCart/shoppingCart',
    })
  },
  /**
   * 继续购物
   */
  closeSuccess(){
    wx.redirectTo({
      url:"../Product/Product"
    })
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