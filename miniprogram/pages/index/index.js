import {
  getAll,
  getList
} from "../../utils/db";

Page({
  data: {
    indexList: [],
    daohangImg: [{
        id: 0,
        tit: "菜谱分类",
        img: "/static/index/fenlei.png"
      },
      {
        id: 1,
        tit: "儿童菜谱",
        img: "/static/index/ertong.png",
        _id:"b5416b755f472208007f0eb31848dbc5"
      },
      {
        id: 2,
        tit: "养生菜谱",
        img: "/static/index/yangsheng.png",
        _id: "65825b355f44aec4003db92d7297910c"
      },
      {
        id: 3,
        tit: "推荐菜谱",
        img: "/static/index/tuijian.png"
      },
    ],
    val: "",
    page: 0,
    pageSize: 6,
    _id:null
  },

  // 进页面加载
  async onLoad() {
    // this.empty()
    // this.data.page = 0
    // let {
    //   page,
    //   pageSize
    // } = this.data;
    // let resault = await getList(page, pageSize, "menu");
    // this.setData({
    //   indexList: resault.data
    // })
  },

  // 页面显示时候加载
  async onShow() {
    
    this.data.page = 0
    let {
      page,
      pageSize
    } = this.data;
    let resault = await getList(page, pageSize, "menu");
    // console.log(resault.data);
    
    this.setData({
      indexList: resault.data
    })
  },

  //!-- 触底刷新
  async onReachBottom() {
    // console.log('触底刷新记得做。。。。。。');
    wx.showLoading({
      title: '加载中...',
    })
    this.data.page += 1;
    // console.log(this.data.page)
    let pageSize = this.data.pageSize;
    let resault = await getList(this.data.page, pageSize, "menu");
    // console.log(resault);
    if (resault.data.length == 0) {
      wx.showToast({
        title: '暂无更多~',
        icon: "none"
      })
    }
    wx.hideLoading();
    this.setData({
      indexList: this.data.indexList.concat(resault.data)
    })

  },



  // 进入详情
  toDetail(e) {
    this.data._id = e.currentTarget.id;
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${e.currentTarget.id}`,
    })
  },

  // 点击进入菜谱分类
  cpClassify(e) {
    // console.log(e);

    let {
      id,
      dataset
    } = e.currentTarget;
    // console.log(dataset.tit);

    if (id != 0) {
      wx.navigateTo({
        url: `../recipelist/recipelist?id=${dataset._id}&tit=${dataset.tit}`,
      })
    } else {

      wx.navigateTo({
        url: `../typelist/typelist`,
      })
    }

  },

  // 点击搜索
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




  // 渲染页面
  async empty() {
    // let resault = await getAll("menu");
    // this.setData({
    //   indexList: resault.data
    // })
  }
})