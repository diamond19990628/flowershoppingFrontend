// pages/member/Product/Product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:require("../../../config"),
    categoryList:[],
    categoryChildList:[],
    currentIndex:0,
    currentParentIndex:0,
    currentChildIndex:0,
    CategoryId:0,
    productList:[]
  },
  loadingCategory(){
    return new Promise((resolve,reject)=>{
      wx.request({
        url:this.data.config.BASE_URL+"/member/categories/parentall",
        method:"GET",
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.setData({
                categoryList:res.data.data,
                categoryChildList:res.data.data[this.data.currentIndex].parent_category,
                CategoryId:res.data.data[this.data.currentChildIndex].parent_category[0].categoryId
              })
            break;
          }
          resolve(res);
        },
        fail:(err)=>{
          reject(err);
        }
      })
    })
    
  },
  loadingProduct(){
    wx.request({
      url:this.data.config.BASE_URL+'/member/product',
      method:"GET",
      data:{
        category_id:this.data.CategoryId,
        access_flag:2
      },
      success:(res)=>{
        switch(res.statusCode){
          case 200:
            this.setData({
              productList:res.data.data
            })
          break;
        }
      }
    })
  },
  switchParent(e){
    const index = e.currentTarget.dataset.parent_index;
    const targetId = e.currentTarget.dataset.category_id;
    const item = this.data.categoryList.find(
      item => item.category_id === targetId
    );
    this.setData({
      currentParentIndex:index,
      categoryChildList:item.parent_category,
      currentChildIndex:0,
      CategoryId:item.parent_category[0].categoryId
    })
    this.loadingProduct();
  },
  switchChild(e){
    const index = e.currentTarget.dataset.child_index;
    const category_id = e.currentTarget.dataset.category_id;
    this.setData({
      currentChildIndex:index,
      CategoryId:category_id
    })
    this.loadingProduct();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    try{
      await this.loadingCategory();
      await this.loadingProduct();
    }catch(err){
      console.error(err);
    }
    
  },
    /**
   * 画面移动
   */
  navToItem(e){
    const item = e.currentTarget.dataset.items;
    wx.navigateTo({
      url:"../Product/item?Items="+encodeURIComponent(JSON.stringify(item))
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