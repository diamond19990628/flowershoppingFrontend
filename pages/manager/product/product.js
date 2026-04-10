// pages/manager/product/product.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    product_id:null,
    productList:[],
    imagePath:null,
    currentTab:0,
    lowStock:false,
    status:0,
    stock:0,
    amount:0,
    productName:"",
    productNameSearch:"",
    categoryNameList:[],
    categoryList: [],       // 保存完整分类数据
    categoryIndex:null,
    categoryId: null,        // 当前选中的 category_id
    button_event:"",
    config:require("../../../config"),
    requestNo:"",
    isErrorVisible:false,
    errorMessage:"",
    show_load_dialog:false
  },
  loadProductList(index){
    let status = 0;
    let lowStock = false;
    if(index==0){
      status = 0;
    }
    if(index==1){
      status = 1
    };

    if(index==2){
      status = 2;
    }

    if(index==3){
      lowStock = true;
    }
    this.setData({
      status:status,
      lowStock:lowStock
    })
    wx.request({
      url:this.data.config.BASE_URL+"/product",
      method:"GET",
      data:{
        product_name:this.data.productName,
        status:status,
        Low_Stock:lowStock
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
              productList: res.data.data
            })
            break;
          case 401:
            console.log("error");
            break;
          case 500:
            console.log("system-error");
        }
      }
    })
  },
  switchTab(e){
    const index = e.currentTarget.dataset.index;

    this.setData({
      currentTab:index
    })
    this.loadProductList(index);
  },
  onInput(e){
    const field = e.currentTarget.dataset.field
    const value = e.detail.value

    this.setData({
      [field]: value
    })
  },
  onSearch(){
    wx.request({
      url:this.data.config.BASE_URL+"/product",
      method:"GET",
      data:{
        product_name:this.data.productNameSearch,
        status:this.data.status,
        Low_Stock:this.data.lowStock
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
              productList: res.data.data
            })
            break;
          case 401:
            console.log("error");
            break;
          case 500:
            console.log("system-error");
        }
      }
    })
  },
  // 打开弹窗
  onAddGoods(e) {
    wx.request({
      url:this.data.config.BASE_URL+"/member/orders/requestNo",
      method:"POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.setData({
              requestNo:res.data.data
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
          break;
        }
      }
    });
    const event_type = e.currentTarget.dataset.event_type;
    this.setData({ showAddDialog: true });
    // 新增商品
    if(event_type == "create"){
      wx.request({
        url:this.data.config.BASE_URL+"/categories",
        method:"GET",
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          const list = res.data.data || [];
          const names = list.map(item=>item.category_name);
          this.setData({
            categoryNameList: names,
            categoryList: list,
            button_event:"create"
          })
        }
      })
    }else{
      const productId = e.currentTarget.dataset.product_id;
      this.setData({
        product_id:productId
      })
      // 获取category
      wx.request({
        url:this.data.config.BASE_URL+"/categories",
        method:"GET",
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          const list = res.data.data || [];
          const names = list.map(item=>item.category_name);
          this.setData({
            categoryNameList: names,
            categoryList: list,
          })
          wx.request({
            url:this.data.config.BASE_URL+"/product/"+productId,
            method:"GET",
            header: {
              "Content-Type": "application/json",
              "token": wx.getStorageSync("token"),
              "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
            },
            success:(res)=>{
              const index = this.data.categoryList.findIndex(
                item => item.category_id === res.data.data.category.categoryId
              );
              this.setData({
                productName:res.data.data.productName,
                categoryIndex:index,
                categoryId:res.data.data.category.categoryId,
                amount:res.data.data.amount,
                stock:res.data.data.stock,
                imagePath:res.data.data.attachedFile.attachedFilePath,
                button_event:"update"
              })
            }
          })
        }
      })
    }
    
  },

  // 关闭弹窗
  closeDialog() {
    this.setData({
      productName: "",
      amount: 0,
      stock: 0,
      categoryIndex: null,
      categoryId: null,
      imagePath: ""
    })
    this.setData({ showAddDialog: false });
  },
  onCategoryChange(e) {
    const index = Number(e.detail.value);
    const currentCategory = this.data.categoryList[index];

    this.setData({
      categoryIndex: index,
      categoryId: currentCategory.category_id
    });
  },
  // 图片上传
  chooseImage(){
    wx.chooseMedia({
      count:1,
      mediaType:['image'],
      sourceType:['album','camera'],
    
      success:(res)=>{
        const tempFilePath = res.tempFiles[0].tempFilePath
    
        this.setData({
          imagePath:tempFilePath
        })
      }
    })
  },
  // 阻止冒泡
  stop() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadProductList(0);
  },
  /**
   * 新增商品处理
   * 
   */
  onCreate(e){
    this.setData({
      show_load_dialog:true
    })
    const button_event = e.currentTarget.dataset.button_event;
    const productName = this.data.productName;
    const amount = this.data.amount;
    const stock = this.data.stock;
    const imagePath = this.data.imagePath;
    const category_id = this.data.categoryId;
    const reg = /^[0-9]{1,7}$/;
    if(!imagePath){
      wx.showToast({
        title: "请上传商品图片",
        icon: "none"
      });
      return;
    }
    
    if(!productName){
      wx.showToast({
        title: "请输入商品名称",
        icon: "none"
      });
      return;
    }
    
    if(!category_id){
      wx.showToast({
        title: "请选择商品分类",
        icon: "none"
      });
      return;
    }
    
    if(amount === "" || amount == null){
      wx.showToast({
        title: "请输入销售价格",
        icon: "none"
      });
      return;
    }
    if(!reg.test(amount)){
      wx.showToast({
        title: "销售价格输入错误",
        icon: "none"
      });
      return;
    }
    if(stock === "" || stock == 0){
      wx.showToast({
        title: "请输入库存数量",
        icon: "none"
      });
      return;
    }
    if(!reg.test(stock)){
      wx.showToast({
        title: "库存输入错误",
        icon: "none"
      });
      return;
    }
    if(button_event=="create"){
      wx.uploadFile({
        url:this.data.config.BASE_URL+"/product",
        method:"POST",
        filePath:imagePath,
        name:"attached_file",
        formData:{
          product_name: productName,
          amount: amount,
          stock: stock,
          category: category_id,
          requestNo:this.data.requestNo
        },
        header: {
          "Content-Type": "multipart/form-data",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          const result = JSON.parse(res.data);
          switch(res.statusCode){
            case 200:
              this.setData({
                productName: "",
                amount: 0,
                stock: 0,
                categoryIndex: null,
                categoryId: null,
                imagePath: ""
              })
              this.loadProductList(this.data.currentTab);
              this.setData({ 
                showAddDialog: false,
                show_load_dialog:false
              });
            break;
          }
        }
      })
    }else{
      if(imagePath.includes(this.data.config.BASE_URL)){
        // 没有更改图片
        wx.request({
          url:this.data.config.BASE_URL+"/product/"+this.data.product_id,
          method:"POST",
          data:{
            product_name: productName,
            amount: amount,
            stock: stock,
            category: category_id,
            requestNo:this.data.requestNo
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "token": wx.getStorageSync("token"),
            "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
          },
          success:(res)=>{
            switch(res.statusCode){
              case 200:
                this.setData({
                  productName: "",
                  amount: 0,
                  stock: 0,
                  categoryIndex: null,
                  categoryId: null,
                  imagePath: ""
                })
                this.loadProductList(this.data.currentTab);
                this.setData({ 
                  showAddDialog: false,
                  show_load_dialog:false
                });
              break;
            }
          }
        })
      }else{
        wx.uploadFile({
          url:this.data.config.BASE_URL+"/product/"+this.data.product_id,
          method:"POST",
          filePath:imagePath,
          name:"attached_file",
          formData:{
            product_name: productName,
            amount: amount,
            stock: stock,
            category: category_id,
            requestNo:this.data.requestNo
          },
          header: {
            "Content-Type": "multipart/form-data",
            "token": wx.getStorageSync("token"),
            "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
          },
          success:(res)=>{
            const result = JSON.parse(res.data);
            switch(res.statusCode){
              case 200:
                this.setData({
                  productName: "",
                  amount: 0,
                  stock: 0,
                  categoryIndex: null,
                  categoryId: null,
                  imagePath: ""
                })
                this.loadProductList(this.data.currentTab);
                this.setData({ 
                  showAddDialog: false,
                  show_load_dialog:false
                });
              break;
            }
          }
        })
      }
      
    }
    
  },
  unlistProduct(e){
    const product_id = e.currentTarget.dataset.product_id;
    let status = e.currentTarget.dataset.status;
    if(status == 1){
      status = 2;
    }else{
      status = 1;
    }
    wx.request({
      url:this.data.config.BASE_URL+"/product/"+product_id,
      method:"PATCH",
      data:{
        status:status
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
              productName: "",
              amount: 0,
              stock: 0,
              categoryIndex: null,
              categoryId: null,
              imagePath: ""
            })
            this.loadProductList(this.data.currentTab);
            this.setData({ showAddDialog: false });
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