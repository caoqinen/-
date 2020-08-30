
import {getAll} from "../../utils/db";
Page({


  data:{
    cpList:[],
    val:""
  },


  async onLoad () {
    let resault = await getAll("menuCate");
    this.setData({
      cpList: resault.data
    })
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


  async caipu (e) {

    
    let {id,dataset} = e.currentTarget;
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&tit=${dataset.tit}`,
    })
  }
})