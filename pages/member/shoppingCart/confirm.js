// pages/member/shoppingCart/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoppingCartList:[],
    isErrorVisible:false,
    errorMessage:"",
    total_amount:0,
    isSelfPickup:true,
    config:require("../../../config"),
    user_id:0,
    isLogined:false,
    addressList:[],
    deliveryAddressNameList:[],
    addressIndex:null,
    delivery_address_id:0,
    deliveryDate:null,
    deliveryTime:null,
    isSubmitting:false,
    requestNo:"",
    payLoadingVisible:false
  },
  toggleType(){
    this.setData({
      isSelfPickup:!this.data.isSelfPickup
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const shoppingCartList = wx.getStorageSync("confirmShoppingCartList") || [];
    if(shoppingCartList.length === 0){
      this.setData({
        isErrorVisible:true,
        errorMessage:"未查到任何数据，无法结算"
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/index/index'
        })
      },1000)
      return;
    }
    this.setData({
      shoppingCartList:shoppingCartList
    });
    // 获取登录中的user_id
    const app = getApp();
    this.setData({
      isLogined:app.globalData.isLogined
    })
    if(!app.globalData.isLogined){
      this.setData({
        isErrorVisible:true,
        errorMessage:"登录已失效，请重新登录"
      })
      return;
    }
    const user_id = app.globalData.userInfo.user_id;
    // 获取当前用户登录的收货地址
    wx.request({
      url:this.data.config.BASE_URL+"/member/deliveryAddress/"+user_id,
      method:"GET",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            let deliveryAddressNameList = [];
            for(let i = 0;i<res.data.data.length;i++){
              deliveryAddressNameList.push(res.data.data[i].delivery_address);
            }
            const index = res.data.data.findIndex(
              item => item.delivery_address_id === this.data.delivery_address_id
            );
            this.setData({
              addressList:res.data.data,
              deliveryAddressNameList:deliveryAddressNameList,
              addressIndex:index
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
    wx.request({
      url:this.data.config.BASE_URL+"/member/orders/requestNo",
      method:"POST",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        console.log(res.data.data);
        switch(res.statusCode){
          case 200:
            this.setData({
              requestNo:res.data.data
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
  onAddressChange(e){
    const index = e.detail.value;
    this.setData({
      addressIndex:index,
      delivery_address_id:this.data.addressList[index].delivery_address_id
    })
  },

  /**
   * 切换配送日期
   */
  bindDateChange(e){
    const deliveryDate = e.detail.value;
    this.setData({
      deliveryDate:deliveryDate
    })
  },

  /**
   * 选择配送时间
   */
  bindTimeChange(e){
    const deliveryTime = e.detail.value;
    this.setData({
      deliveryTime:deliveryTime
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
    let sum_price = 0;
    for(let i = 0;i<this.data.shoppingCartList.length;i++){
      let product_price = this.data.shoppingCartList[i].product.amount*this.data.shoppingCartList[i].quantity;
      sum_price = sum_price+product_price;
    };
    this.setData({
      total_amount:sum_price
    })
  },

  /**
   * 付款
   */
  onPay(){
    this.setData({
      isSubmitting:true
    })
    const app = getApp();
    const user_id = app.globalData.userInfo.user_id;
    const total_amount = this.data.total_amount;
    let deliveryType = 0;
    if(this.data.isSelfPickup){
      deliveryType = 1;
    }else{
      deliveryType = 2;
    }
    const delivery_address_id = this.data.delivery_address_id;
    const delivery_date = this.data.deliveryDate+' '+this.data.deliveryTime+ ":00";
    let product_info_array = [];
    for(let i = 0;i<this.data.shoppingCartList.length;i++){
      let product_info_struct = {
        productId : this.data.shoppingCartList[i].product.productId,
        cardId:this.data.shoppingCartList[i].card.card_id,
        is_anonymous:this.data.shoppingCartList[i].is_anonymous,
        comment:this.data.shoppingCartList[i].comment,
        quantity:this.data.shoppingCartList[i].quantity
      }
      product_info_array.push(product_info_struct);
      
    }
    if(total_amount==0){
      this.setData({
        isErrorVisible:true,
        errorMessage:"总金额不能为空",
        isSubmitting:false
      })
      return;
    }
    if(this.data.deliveryDate==null){
      this.setData({
        isErrorVisible:true,
        errorMessage:"自提日期不能为空",
        isSubmitting:false
      })
      return;
    }
    if(this.data.deliveryTime==null){
      this.setData({
        isErrorVisible:true,
        errorMessage:"自提日期不能为空",
        isSubmitting:false
      })
      return;
    }
    if(deliveryType==2 && delivery_address_id==0){
      this.setData({
        isErrorVisible:true,
        errorMessage:"配送地址不能为空",
        isSubmitting:false
      })
      return;
    }
    this.setData({
      payLoadingVisible:true
    })
    wx.request({
      url:this.data.config.BASE_URL+"/member/orders",
      method:"POST",
      data:{
        product_info_array:product_info_array,
        user_id:user_id,
        total_amount:total_amount,
        delivery_type_id:deliveryType,
        delivery_address_id:delivery_address_id,
        delivery_date:delivery_date,
        requestNo:this.data.requestNo
      },
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        this.setData({
          isSubmitting:false
        })
        switch(res.statusCode){
          case 200:
            const order_no = res.data.data.order_no;
            const total_amount = res.data.data.total_amount;
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
                        wx.redirectTo({
                          url:"./success"
                        })
                      },
                      fail:(res)=>{
                        this.setData({
                          payLoadingVisible:false
                        })
                        wx.redirectTo({
                          url:"./fails"
                        })
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
          break;
          case 400:
            let err = res.data.data;
            this.setData({
              isErrorVisible:true,
              errorMessage:err
            })
          break;
        }
      }
    })
  },

  /**
   * 返回
   */
  onBack(){
    wx.navigateBack();
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