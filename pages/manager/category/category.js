// pages/manager/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    isDialogVisible: false,
    event:'',
    create_status:'',
    parent_category_id:0,
    categoryName:'',
    isDeleteVisible:false,
    isErrorVisible:false,
    errorMessage:'',
    deleteCategory:0,
    updateCategory:0,
    deleteTargetName:'',
    title:'',
    config:require("../../../config")
  },
  loadCategories(){
    wx.request({
      url:this.data.config.BASE_URL+"/categories/all",
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
            const list = res.data.data;
            const newList = list.map(item=>{
              return {
                ...item,
                expanded:false
              }
            });
            this.setData({
              categoryList:newList
            })
          break;
        }
      }
    })
  },
  toggleExpand(e){
    const category_id = e.currentTarget.dataset.id;
    const list = this.data.categoryList;
    const index = list.findIndex(item=>item.category_id===category_id);
    list[index].expanded = !list[index].expanded;
    this.setData({
      categoryList:list
    })
  },
  handleAddParent(e){
      const status = e.currentTarget.dataset.status;
      const event = e.currentTarget.dataset.event;
      let parent_category_id = 0;
      if(status=='create_child'){
        parent_category_id = e.currentTarget.dataset.pid
      }
      this.setData({
        isDialogVisible:true,
        create_status:status,
        parent_category_id:parent_category_id,
        event:event,
        title:'新建分类',
        categoryName:''
      });
  },
  hideDialog(){
    this.setData({
      isDialogVisible:false
    })
  },
  onInputName(e){
    let value = e.detail.value;
    this.setData({
      categoryName:value
    })
  },
  // 新建分类
  createCategory(){
    const categoryName = this.data.categoryName;
    const event = this.data.event;
    let allow_create = true;
    if(categoryName==''){
      allow_create = false;
    }
    const parent_category_id = this.data.parent_category_id;
    const updateCategory_id = this.data.updateCategory;
    if(event=="create"){
      wx.request({
        url:this.data.config.BASE_URL+'/categories',
        method:"POST",
        data:{
          category_name:categoryName,
          parent_category_id:parent_category_id
        },
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.loadCategories();
              this.setData({
                isDialogVisible:false,
                categoryName:'',
                parent_category_id:0
              })
            break;
          }
        }
      })
    }else if(event=="update"){
      wx.request({
        url:this.data.config.BASE_URL+'/categories/'+updateCategory_id,
        method:"POST",
        data:{
          category_name:categoryName
        },
        header: {
          "Content-Type": "application/json",
          "token": wx.getStorageSync("token"),
          "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
        },
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.loadCategories();
              this.setData({
                isDialogVisible:false,
                categoryName:'',
                parent_category_id:0
              })
            break;
            case 400:
              this.setData({
                isErrorVisible:true,
                errorMessage:res.data.msg
              })
            break;
          }
        }
      })
    }
    
  },
  // 编辑分类
  handleEdit(e){
    const category_name = e.currentTarget.dataset.categoryparentname;
    const category_id = e.currentTarget.dataset.id;
    const event = e.currentTarget.dataset.event;
    this.setData({
      isDialogVisible:true,
      categoryName:category_name,
      updateCategory:category_id,
      title:'编辑分类',
      event:event
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadCategories();
  },
  handleDelete(e){
    const category_id = e.currentTarget.dataset.id;
    const category_name = e.currentTarget.dataset.name;
    const event = e.currentTarget.dataset.event;
    this.setData({
      deleteCategory:category_id,
      isDeleteVisible:true,
      deleteTargetName:category_name,
      event:event
    })
    
  },
  hideDeleteDialog(){
    this.setData({
      isDeleteVisible:false
    })
  },
  confirmDelete(){
    wx.request({
      url:this.data.config.BASE_URL+'/categories/'+this.data.deleteCategory,
      method:"DELETE",
      header: {
        "Content-Type": "application/json",
        "token": wx.getStorageSync("token"),
        "Cookie": "JSESSIONID=" + wx.getStorageSync("JSESSIONID")
      },
      success:(res)=>{
        switch(res.statusCode){
          case 204:
            this.loadCategories();
            this.setData({
              isDeleteVisible:false
            })
          break;
          case 400:
            const errorMsg = res.data.msg;
            if(errorMsg != ''){
              this.setData({
                errorMessage:errorMsg,
                isDeleteVisible:false,
                isErrorVisible:true
              })
            }
          break;
        }
      }
    })
  },
  hideErrorDialog(){
    this.setData({
      isErrorVisible:false
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