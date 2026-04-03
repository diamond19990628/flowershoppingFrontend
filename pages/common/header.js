Component({

  data: {
    categoryList: [],
    config: require("../../config"),
    currentIndex:null,
    initCategory_id:0,
    showNotice:false,
    noticeList:[]
  },
  lifetimes: {
    attached() {
      wx.request({
        url: this.data.config.BASE_URL + "/member/categories/all",
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            this.setData({
              categoryList: res.data.data || [],
              currentIndex:0,
              initCategory_id:res.data.data[0].category_id,
            });
            this.triggerEvent("change",{
              category_id:this.data.initCategory_id
            })
          }
        },
        fail: (err) => {
          console.log("请求失败", err);
        }
      });
      this.loadingInformation();
    }
  },

  methods: {
    switchTab(e){
      const index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex:index
      }),
      this.triggerEvent("change",{
        category_id:e.currentTarget.dataset.category_id
      })
    },
    openNotice(){
      this.setData({
        showNotice:true
      })
    },
    onClose(){
      this.setData({
        showNotice:false
      })
    },
    onJoinUs(){
      wx.redirectTo({
        url:"../member/user/user"
      })
    },
    loadingInformation(){
      wx.request({
        url:this.data.config.BASE_URL+"/member/informations",
        method:"GET",
        success:(res)=>{
          switch(res.statusCode){
            case 200:
              this.setData({
                noticeList:res.data.data
              })
            break;
          }
        },
      })
    },
  }
});