Component({
  properties: {

  },

  data: {
    categoryList: [],
    config: require("../../config")
  },

  lifetimes: {
    attached() {
      wx.request({
        url: this.data.config.BASE_URL + "/member/categories/all",
        method: "GET",
        success: (res) => {
          console.log(res.data.data);
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

  }
});