// pages/manager/discount/discount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discountList:[],
    // key
    discount_scope_id:1,
    
    discount_title:"",
    discount_rate:"",
    threshold_amount:"",
    reduction_amount:"",
    salesDate:"",
    advance_days:"",
    startDate:"",
    endDate:"",
    currentSelectedDiscountTypeId:0,

    showDeleteDialog:false,
    isOpening:false,
    discountTypeList:[],
    errorMessage:"",
    isErrorVisible:false,
    discountIndex:-1,
    discountNameList:[],
    is_storewide_discount:false,
    is_advance_booking_discount:false,
    is_off_over:false,
    currentDiscountId:0,
    config:require("../../../config")
  },
  /**
   * 
   * 获取所有信息
   */
  getAllDiscount(){
    wx.request({
      url:this.data.config.BASE_URL+"/discount",
      method:"GET",
      data:{
        "discount_scope":this.data.discount_scope_id,
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
              discountList:res.data.data
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //查询所有折扣类型
    wx.request({
      url:this.data.config.BASE_URL+"/discount/type",
      method:"GET",
      data:{},
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            const list = res.data.data || [];
            const discountName = list.map(item=>item.discount_type_name);
            this.setData({
              discountNameList:discountName,
              discountTypeList:list
            })
          break;
        }
      },
    })
    this.getAllDiscount();
  },
  /**
   * 启动系统折扣dialog
   */
  openCreateDialog(){
    this.setData({
      isOpening:true,
      discount_title:"",
      discount_rate:"",
      threshold_amount:"",
      reduction_amount:"",
      salesDate:"",
      advance_days:"",
      startDate:"",
      endDate:"",
    })
  },
  /**
   * 关闭dialog
   */
  closeDialog(){
    this.setData({
      isOpening:false
    })
  },
  /**
   * 改变折扣类型
   */
  onDiscountChange(e){
    const index = e.detail.value;
    const discount_type_id = this.data.discountTypeList[index].discount_type_id;
    this.setData({
      discountIndex:index,
      currentSelectedDiscountTypeId:discount_type_id
    });
    if(discount_type_id==1){
      this.setData({
        is_storewide_discount:true,
        is_off_over:false,
        is_advance_booking_discount:false
      })
    }
    else if(discount_type_id==2){
      this.setData({
        is_storewide_discount:false,
        is_off_over:true,
        is_advance_booking_discount:false
      })
    }
    else if(discount_type_id==3){
      this.setData({
        is_storewide_discount:false,
        is_off_over:false,
        is_advance_booking_discount:true
      })
    }
  },
  /**
   * 
   * 开始时间改变
   */
  onStartDateChange(e){
    const date = e.detail.value;
    this.setData({
      startDate:date
    })
  },
  /**
   * 
   * @param {结束时间改变} e 
   */
  onEndDateChange(e){
    const date = e.detail.value;
    this.setData({
      endDate:date
    })
  },
  /**
   * 
   * @param {改变销售时间} e 
   */
  onSalesDateChange(e){
    const date = e.detail.value;
    this.setData({
      salesDate:date
    })
  },
  /**
   * 输入
   */
  onInput(e){
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [field]:value
    })
  },
  /**
   * 创建折扣
   */
  onCreate(){
    const discount_title = this.data.discount_title;
    let startDate = this.data.startDate;
    let endDate = this.data.endDate;
    let discount_rate = "";
    let threshold_amount = "";
    let reduction_amount = "";
    let salesDate = "";
    let advance_days = "";
    const discount_type_id = this.data.currentSelectedDiscountTypeId;
    if(discount_title == ""){
      this.setData({
        isErrorVisible:true,
        errorMessage:"折扣名不能为空"
      });
      return false;
    }
    if(startDate==""){
      this.setData({
        isErrorVisible:true,
        errorMessage:"折扣开始日期不能为空"
      });
      return false;
    }
    if(endDate==""){
      this.setData({
        isErrorVisible:true,
        errorMessage:"折扣结束日期不能为空"
      });
      return false;
    }
    console.log(discount_type_id);
    if(discount_type_id == 1){
      discount_rate = this.data.discount_rate;
      if(discount_rate == ""){
        this.setData({
          isErrorVisible:true,
          errorMessage:"折扣不能为空"
        });
        return false;
      }
      if(discount_rate <1 || discount_rate > 10){
        this.setData({
          isErrorVisible:true,
          errorMessage:"折扣数只能为1~10之间"
        });
        return false;
      }
    }else if(discount_type_id == 2){
      threshold_amount = this.data.threshold_amount;
      reduction_amount = this.data.reduction_amount;
      if(threshold_amount == ""){
        this.setData({
          isErrorVisible:true,
          errorMessage:"满额金额不能为空"
        });
        return false;
      }
      else if(reduction_amount == ""){
        this.setData({
          isErrorVisible:true,
          errorMessage:"打折金额不能为空"
        });
        return false;
      }
    }else if(discount_type_id == 3){
      discount_rate = this.data.discount_rate;
      if(discount_rate <=1 || discount_rate > 10){
        this.setData({
          isErrorVisible:true,
          errorMessage:"折扣数只能为0~1之间"
        });
        return false;
      }
      salesDate = this.data.salesDate;
      advance_days = this.data.advance_days;
    }else{
      this.setData({
        isErrorVisible:true,
        errorMessage:"请选择折扣类型"
      });
      return false;
    }
    wx.request({
      url:this.data.config.BASE_URL+"/discount",
      method:"POST",
      data:{
        discount_scope:this.data.discount_scope_id,
        discount_title:discount_title,
        start_date:startDate+" "+"00:00:00",
        end_date:endDate+" "+"23:59:59",
        discount_type_id:Number(discount_type_id),
        discount_rate:Number(discount_rate),
        threshold_amount:Number(threshold_amount),
        reduction_amount:Number(reduction_amount),
        booking_time:salesDate+" "+"00:00:00",
        advance_days:Number(advance_days)
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
              isOpening:true,
              discount_title:"",
              discount_rate:"",
              threshold_amount:"",
              reduction_amount:"",
              salesDate:"",
              advance_days:"",
              startDate:"",
              endDate:"",
            });
            this.getAllDiscount();
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
          case 400:
            const msg = res.data.msg;
            this.setData({
              errorMessage:msg,
              isErrorVisible:true
            })
        }
      },
      complete:(res)=>{
        this.setData({
          isOpening:false
        })
      }
    })
  },
  /**
   * 永久删除折扣
   */
  deleteDiscount(e){
    const discount_id = e.currentTarget.dataset.id;
    this.setData({
      showDeleteDialog:true,
      currentDiscountId:discount_id
    })
  },
  onCancelDelete(){
    this.setData({
      showDeleteDialog:false
    })
  },
  /**
   * 执行删除
   */
  onConfirmDelete(){
    wx.request({
      url:this.data.config.BASE_URL+"/discount/"+this.data.currentDiscountId,
      method:"DELETE",
      data:{},
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.getAllDiscount();
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
      },
      complete:()=>{
        this.setData({
          showDeleteDialog:false
        })
      }
    })
  },
  /**
   * 下架折扣
   */
  offDiscount(e){
    const discount_id = e.currentTarget.dataset.id;
    wx.request({
      url:this.data.config.BASE_URL+"/discount/"+discount_id,
      method:"PUT",
      data:{},
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.getAllDiscount();
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