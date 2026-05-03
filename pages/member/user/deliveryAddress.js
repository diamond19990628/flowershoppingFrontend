// pages/member/user/deliveryAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:require("../../../config"),
    user_id:0,
    isLogined:false,
    isErrorVisible:false,
    errorMessage:"",
    deliveryAddressList:[],
    showAddressDialog:false,
    currentType:"",
    editForm:{},
    showDeleteDialog:false,
    currentDeliveryAddressId:0,
    dialogTitle:""
  },
  /**
   * 微信一键导入
   */
  importFromWechat(){
    wx.chooseAddress({
      success:(res) =>{
        console.log(res);
        const deliveryAddress = res.cityName+res.countyName+res.detailInfo;
        const userName = res.userName;
        const telNumber = res.telNumber;
        this.setData({
          currentType:"create"
        })
        this.createDeliveryAddress(deliveryAddress,userName,telNumber);
      },
      fail(err) {
        console.log(err);
      }
    });
  },
  /**
   * 获取住址信息
   */
  loadingDeliveryInfo(){
    wx.request({
      url:this.data.config.BASE_URL+"/member/deliveryAddress/"+this.data.user_id,
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
              deliveryAddressList:res.data.data
            })
          break;
          case 401:
            this.setData({
              isErrorVisible:true,
              errorMessage:"登录已失效，请重新登录"
            })
            const app1 = getApp();
            app1.globalData.userInfo = null;
            app1.globalData.isLogined = false;
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
    const app = getApp();
    const isLogined =  app.globalData.isLogined;
    this.setData({
      isLogined:isLogined
    })
    if(!isLogined){
      this.setData({
        isErrorVisible:true,
        errorMessage:"登录已失效，请重新登录"
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/index/index'
        })
      },3000)
    }
    this.setData({
      user_id:app.globalData.userInfo.user_id
    })
    this.loadingDeliveryInfo();
  },
  /**
   * 添加地址/修改地址
   */
  createDeliveryAddress(delivery_address,receive_name,receive_tel){
    const currentType = this.data.currentType;
    if(currentType == "create"){
      wx.request({
        url:this.data.config.BASE_URL+"/member/deliveryAddress/"+this.data.user_id,
        method:"POST",
        data:{
          delivery_address:delivery_address,
          receive_name:receive_name,
          receive_tel:receive_tel
        },
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.loadingDeliveryInfo();
            break;
            case 401:
              this.setData({
                isErrorVisible:true,
                errorMessage:"登录已失效，请重新登录"
              })
              const app1 = getApp();
              app1.globalData.userInfo = null;
              app1.globalData.isLogined = false;
              wx.redirectTo({
                url:"/pages/member/user/user"
              })
            break;
            case 404:
              this.setData({
                isErrorVisible:true,
                errorMessage:"该地址已经不存在"
              })
            break;
          }
        }
      })
    }else{
      const delivery_address_id = this.data.currentDeliveryAddressId;
      if(delivery_address_id == null || delivery_address_id == 0){
        this.setData({
          isErrorVisible:true,
          errorMessage:"地址ID不能为空"
        })
        return;
      }
      wx.request({
        url:this.data.config.BASE_URL+"/member/deliveryAddress/"+delivery_address_id,
        method:"PUT",
        data:{
          delivery_address:delivery_address,
          receive_name:receive_name,
          receive_tel:receive_tel
        },
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.loadingDeliveryInfo();
            break;
            case 401:
              this.setData({
                isErrorVisible:true,
                errorMessage:"登录已失效，请重新登录"
              })
            break;
            case 404:
              this.setData({
                isErrorVisible:true,
                errorMessage:"登录已失效，请重新登录"
              })
            break;
          }
        }
      })
    }
    
  },
  /**
   * 打开手动添加新地址
   */
  onAddAddressInfo(e){
    const currentType = e.currentTarget.dataset.type;
    this.setData({
      editForm:{},
      currentType:currentType,
      showAddressDialog:true,
      dialogTitle:"添加新地址"
    })
  },

  /**
   * 取消输入
   */
  closeAddressDialog(){
    this.setData({
      showAddressDialog:false
    })
  },

  /**
   * 输入中
   */
  onEditInput(e){
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`editForm.${field}`]: value
    });
  },

  /**
   * 确定创建
   */
  saveAddress(){
    const delivery_address = this.data.editForm.delivery_address;
    const receive_tel = this.data.editForm.receive_tel;
    console.log(receive_tel);
    const receive_name = this.data.editForm.receive_name;
    const phoneReg = /^1[3-9]\d{9}$/;
    if(receive_name=="" || !receive_name){
      this.setData({
        isErrorVisible:true,
        errorMessage:"收件人不能为空"
      });
      return;
    }
    if(receive_tel=="" || receive_tel== undefined){
      this.setData({
        isErrorVisible:true,
        errorMessage:"收件人电话不能为空"
      });
      return;
    }
    if(!phoneReg.test(receive_tel)){
      this.setData({
        isErrorVisible:true,
        errorMessage:"电话格式不正确，请重新输入"
      });
      return;
    }
    if(delivery_address=="" || delivery_address== undefined){
      this.setData({
        isErrorVisible:true,
        errorMessage:"收件人地址不能为空"
      });
      return;
    }
    this.createDeliveryAddress(delivery_address,receive_name,receive_tel);
    this.setData({
      showAddressDialog:false
    })
    
  },
  /**
   * 修改地址
   */
  editAddress(e){
    const currentType = e.currentTarget.dataset.type;
    const currentDeliveryAddressId = e.currentTarget.dataset.deliveryaddress_id;
    const addressList = this.data.deliveryAddressList;
    const targetAddress = addressList.find(item => item.delivery_address_id == currentDeliveryAddressId);
    this.setData({
      currentDeliveryAddressId:currentDeliveryAddressId,
      currentType:currentType,
      showAddressDialog:true,
      dialogTitle:"修改地址",
      editForm:targetAddress
    })
  },
  /**
   * 点击删除
   */
  onDeleteAddress(e){
    const delivery_address_id = e.currentTarget.dataset.deliveryaddress_id;
    this.setData({
      currentDeliveryAddressId:delivery_address_id,
      showDeleteDialog:true
    })
  },
  /**
   * 取消删除
   */
  closeDeleteDialog(){
    this.setData({
      showDeleteDialog:false
    })
  },
  /**
   * 执行删除
   */
  executeDelete(){
    wx.request({
      url:this.data.config.BASE_URL+"/member/deliveryAddress/"+this.data.currentDeliveryAddressId,
      method:"DELETE",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 204:
            this.loadingDeliveryInfo();
            this.setData({
              showDeleteDialog:false
            })
          break;
          case 401:
            this.setData({
              isErrorVisible:true,
              errorMessage:"登录已失效，请重新登录"
            })
            const app1 = getApp();
            app1.globalData.userInfo = null;
            app1.globalData.isLogined = false;
            wx.redirectTo({
              url:"/pages/member/user/user"
            })
          break;
        }
      }
    })
  },
  /**
   * 返回上一页
   */
  onBack(){
    wx.redirectTo({
      url:"./user"
    });
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