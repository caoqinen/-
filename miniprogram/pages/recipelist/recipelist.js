const db = wx.cloud.database();
const _ = db.command;
import {
  getAll
} from "../../utils/db";

Page({
  data: {
    searchList: [],
    page: 0,
    pageSize: 6,
    id: "",
    txt: "",
    liangStar:[1,1],
    darkStar:[1,1,1]
  },

  async onLoad(e) {
    let id = e.id;
    let {
      page,
      pageSize
    } = this.data;
    // console.log(id);
    
    if (id) {
      this.data.id = id;
      // 修改详情title
      wx.setNavigationBarTitle({
        title: `${e.tit}`
      })

      let resault = await getAll("menu", {
        typeId: id
      }, page * pageSize, pageSize)
      this.setData({
        searchList: resault.data
      })



    } else {
      let key = e.txt;
      this.data.txt = key;
      // console.log(key);
      // 修改详情title
      wx.setNavigationBarTitle({
        title: `${e.txt}的查询结果`
      })

      wx.showLoading({
        title: '加载中...',
      })

      let resault = await getAll("menu", _.or([{
        menuName: db.RegExp({
          regexp: '.*' + key,
          options: 'i',
        })
      }]))
      // console.log(resault.data);
      

      if (resault.errMsg == "collection.get:ok") {
        wx.hideLoading()
        this.setData({
          searchList: resault.data
        })
      }

    }

    // console.log('我是onload');
    

  },

  async onShow () {   
    // console.log(this.data);
    
    let {
      page,
      pageSize,
      id,
      txt
    } = this.data;
    // console.log(id);
    
    if (id) {
      // this.data.id = id;
      // 修改详情title
      wx.setNavigationBarTitle({
        title: `${txt}`
      })

      let resault = await getAll("menu", {
        typeId: id
      }, page * pageSize, pageSize)
      this.setData({
        searchList: resault.data
      })
      // console.log(this.data.searchList);

    } else {
      // 修改详情title
      wx.setNavigationBarTitle({
        title: `${txt}的查询结果`
      })

      // wx.showLoading({
      //   title: '加载中...',
      // })

      let resault = await getAll("menu", _.or([{
        menuName: db.RegExp({
          regexp: '.*' + txt,
          options: 'i',
        })
      }]))
      // console.log(resault.data);
      

      if (resault.errMsg == "collection.get:ok") {
        // wx.hideLoading()
        this.setData({
          searchList: resault.data
        })
      }

    }

  },

  // 触底刷新
  async onReachBottom() {
    // 触底page+1
    this.data.page += 1;
    let {
      page,
      pageSize,
      id,
      txt
    } = this.data;


    if (this.data.id) {
      wx.showLoading({
        title: '加载中...',
      })
      let resault = await getAll("menu", {
        typeId: id
      }, page * pageSize, pageSize)
      wx.hideLoading()
      this.setData({
        searchList: this.data.searchList.concat(resault.data)
      })
      if (resault.data.length == 0) {
        wx.showToast({
          title: '暂无更多~',
          icon: "none"
        })
      }

    } else {
      let resault = await getAll("menu", _.or([{
        menuName: db.RegExp({
          regexp: '.*' + txt,
          options: 'i',
        })
      }]))

      if (resault.errMsg == "collection.get:ok") {
        wx.hideLoading()
        this.setData({
          searchList: this.data.searchList.concat(resault.data)
        })
      }

      if (resault.data.length == 0) {
        wx.showToast({
          title: '暂无更多~',
          icon: "none"
        })
      }
    }
    // console.log(resault.data);




  },
  // 点击进入详情
  toDetail(e) {

    let {
      id
    } = e.currentTarget;
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${id}`,
    })
  }
})