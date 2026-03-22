Component({
  properties:{
    url:{
      type:String,
      value:""
    },
    index:{
      type:Number,
      value:""
    }
  },
  methods:{
    navToPage(e){
      const currentIndex = e.currentTarget.dataset.index;
      const currentUrl = this.data.url;
      const navToUrl = e.currentTarget.dataset.url;
      if(navToUrl != currentUrl){
        this.setData({
          index:currentIndex,
          url:navToUrl
        })
        wx.redirectTo({
          url:navToUrl
        })
      }
      
      
      
    }
  }
})