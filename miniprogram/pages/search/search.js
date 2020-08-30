const db = wx.cloud.database();
Page({

  data: {
    val: "",
    arr: [],
    hotSearch: []
  },


  async onLoad() {
    let resault = await db.collection("menu")
      .orderBy("views", 'desc')
      .orderBy("follows", 'desc')
      .limit(7).get()
    // console.log(resault.data);

    this.setData({
      hotSearch: resault.data
    })
  },

  // 点击进搜索页面
  doDetail(e) {
    let {
      id,
      dataset
    } = e.currentTarget;
    // console.log(dataset.tit);

    // 把输入的内容存在缓存中
    let arr = wx.getStorageSync('key') || [];

    let index = arr.findIndex(item => {
      return item == dataset.tit;
    })
    if (index != -1) {
      arr.splice(index, 1)
    }
    arr.unshift(dataset.tit)
    wx.setStorageSync('key', arr);

    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}`
    })

  },

  // 点击热门
  jinqi(e) {
    let {
      tit,
    } = e.currentTarget.dataset;
    // console.log(tit);return
    
    
    // 把输入的内容存在缓存中
    let arr = wx.getStorageSync('key') || [];

    let index = arr.findIndex(item => {
      return item == tit;
    })
    if (index != -1) {
      arr.splice(index, 1)
    }
    arr.unshift(tit)
    wx.setStorageSync('key', arr);

    wx.navigateTo({
      url: `../recipelist/recipelist?txt=${tit}`
    })

  },


  search() {
    let {
      val
    } = this.data;
    // 把输入的内容存在缓存中
    let arr = wx.getStorageSync('key') || [];

    let index = arr.findIndex(item => {
      return item == val;
    })
    if (index != -1) {
      arr.splice(index, 1)
    }
    arr.unshift(val)
    wx.setStorageSync('key', arr);

    wx.navigateTo({
      url: `../recipelist/recipelist?txt=${val}`
    })
    this.setData({
      val: ""
    })
  },


  onShow() {
    let arr = wx.getStorageSync('key') || [];
    this.setData({
      arr
    })

  },
})