Component({

  data: {
    categoryList: [],
    config: require("../../config"),
    currentIndex:null
  },

  lifetimes: {
    attached() {
      wx.request({
        url: this.data.config.BASE_URL + "/member/categories/all",
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            this.setData({
              categoryList: res.data.data || []
            });
          }
        },
        fail: (err) => {
          console.log("请求失败", err);
        }
      });
    }
  },

  methods: {
    switchTab(e){
      const index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex:index
      })
    }
  }
});