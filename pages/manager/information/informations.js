const xss = require('xss')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    informationList:[],
    config:require("../../../config"),
    showDialog:false,
    information_title:"",
    information_content:"",
    startDate:null,
    endDate:null,
    errorMessage:"",
    isErrorVisible:false
  },
  loadingInformations(){
    wx.request({
      url:this.data.config.BASE_URL+'/informations',
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
              informationList:res.data.data
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
    this.loadingInformations();
  },
  /**
   * 打开遮罩层
   */
  openDialog(){
    this.setData({
      showDialog:true
    })
  },
  /**
   * 关闭遮罩层
   */
  closeDialog(){
    this.setData({
      information_title:"",
      information_content:"",
      startDate:null,
      endDate:null,
      showDialog:false
    });
  },
  /**
   * 设置开始日期
   */
  bindStartDateChange(e){
    const startDate = e.detail.value;
    this.setData({
      startDate:startDate
    })
  },
  /**
   * 设置结束日期
   */
  bindEndDateChange(e){
    const endDate = e.detail.value;
    this.setData({
      endDate:endDate
    })
  },
  /**
   * 输入公告内容
   */
  onInput(e){
    const field = e.currentTarget.dataset.field
    const value = e.detail.value

    this.setData({
      [field]: value
    })
  },
  submitNotice(){
    const title = xss(this.data.information_title);
    const content = xss(this.data.information_content);
    const startDate = this.data.startDate;
    const endDate = this.data.endDate;
    let allow_upload = true;
    if(title == ""){
      allow_upload = false;
      this.setData({
        errorMessage:"公告标题不能为空",
        isErrorVisible:true
      })
      return;
    }
    if(content == ""){
      allow_upload = false;
      this.setData({
        errorMessage:"公告内容不能为空",
        isErrorVisible:true
      })
      return;
    }
    if(startDate == null){
      allow_upload = false;
      this.setData({
        errorMessage:"公告开始日不能为空",
        isErrorVisible:true
      })
      return;
    }
    if(endDate == null){
      allow_upload = false;
      this.setData({
        errorMessage:"公告结束日不能为空",
        isErrorVisible:true
      })
      return;
    }
    if(startDate > endDate){
      allow_upload = false;
      this.setData({
        errorMessage:"开始日不能在公告结束日之前",
        isErrorVisible:true
      })
      return;
    }
    if(allow_upload){
      wx.request({
        url:this.data.config.BASE_URL+"/informations",
        method:"POST",
        data:{
          information_title:title,
          information_content:content,
          publish_start_date:startDate,
          publish_end_date:endDate
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
                information_title:"",
                information_content:"",
                startDate:null,
                endDate:null,
                showDialog:false
              });
              this.loadingInformations();

            break;
            case 400:
              this.setData({
                errorMessage:res.data.msg,
                isErrorVisible:true
              })
            break;
          }
        }
      })
    }
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