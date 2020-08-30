import {
  getAll,
  addData
} from "../../utils/db";
import {
  bindUpload
} from "../../utils/addImgs";
const app = getApp();
Page({

  data: {
    val: "",
    cateList: [],
    files: [],
    textarea: ""
  },

  async onLoad() {
    //进页面加载菜谱
    let result = await getAll("menuCate");
    this.setData({
      cateList: result.data
    })
  },

  // 菜单名称输入框
  chageMenuName(e) {
    this.setData({
      val: e.detail.value
    })
  },

  // 文本
  chageText(e) {
    this.setData({
      textarea: e.detail.value
    })
  },


  // 点击提交
  async fbcd(e) {
    wx.showLoading({
      title: '发布中...'
    })
// 从本地缓存中取
    let user = wx.getStorageSync('userInfo') || [];
    console.log(user);
    let {
      nickName,
      avatarUrl
    } = user;
    
    

    let {
      menuName,
      typeId,
      desc
    } = e.detail.value;

    // console.log(this.data.files);
    // 图片存在云里面
    let result = await bindUpload(this.data.files);
    let arr = result.map(i => {
      return i.fileID
    })
    // console.log(arr);
    
    

    // 把字段存在数据库中
    let result1 = await addData("menu", {
      menuName,
      files: arr,
      desc,
      addTime: new Date().getTime(),
      nickName,
      avatarUrl,
      follows: 0,
      views: 0,
      typeId
    })

    // 如果上传成功
    if (result1.errMsg == 'collection.add:ok') {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        success: res => {
          this.setData({
            val: "",
            files: [],
            textarea: "",
          })
        }
      })
    }

  },

  // 把临时图片渲染到页面
  bindselect(e) {
    let tempFilePath = e.detail.tempFilePaths;
    let files = tempFilePath.map(item => {
      return {
        url: item
      }
    })
    this.setData({
      files
    })
  },
})