// pages/personal/personal.js

const app = getApp();
import {
  getAll,
  delData
} from "../../utils/db";
const db = wx.cloud.database();

Page({
  data: {
    show: false,
    userInfo: {},
    list: ['菜单', '菜谱', '关注'],
    ind: 0,
    caipuList: [],
    menuList: [],
    openId: "",
    buttons: [{
      type: 'warn',
      text: '查看',
      extClass: 'test'
    }],
    followList: []
  },

  async onLoad() {
    // 如果不是空  就去赋值
    if (app.globalData.userInfo != null) {
      let {
        userInfo
      } = app.globalData;
      this.setData({
        userInfo,
        show: true
      })
    } else {
      // 回到app里面拿数据
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          show: true
        })
      }
    }

    // console.log(app.globalData._openid);

    // 后期加判断
    if (app.globalData._openid == null) {
      // 拿openid   
      wx.cloud.callFunction({
        name: "login",
        success: async res => {
          let resault = await getAll("menu", {
            _openid: res.result.openid
          });
          this.setData({
            menuList: resault.data,
            openId: res.result.openid
          })
        }
      })
    }
  },

  // 添加完毕之后  再次渲染
  async onShow() {
    let resault = await getAll("menu", {
      _openid: app.globalData._openid
    });

    this.setData({
      menuList: resault.data
    })
  },



  // 点击切换
  async switchover(e) {
    this.setData({
      ind: e.target.id
    })

    // 如果没登陆  提醒他一下
    if (!this.data.userInfo.nickName) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      switch (e.target.id) {
        case '0':
          // console.log('菜单');
          break;
        case '1':
          //  请求数据

          let result = await getAll("menuCate", {
            _openid: app.globalData._openid
          });
          this.setData({
            caipuList: result.data
          })
          break;
        case '2':
          // console.log('关注');
          let resault = await getAll("menuFollow", {
            _openid: app.globalData._openid
          })
          let arr = resault.data.map(item => {
            return item.menuId
          })
          let followList = await getAll("menu", {
            _id: db.command.in(arr)
          })
          this.setData({
            followList: followList.data
          })
          break;
        default:
          break;
      }
    }

  },


  // 点击进入添加分类
  fbcpfl() {


    // 如果没有登陆，没办法点头像
    if (this.data.userInfo.nickName && app.globalData._openid == "omOQO5HH-Y-CRSDwAMcg3uydpuH8") {
      wx.navigateTo({
        url: '../pbmenutype/pbmenutype',
      })
    } else {
      wx.showToast({
        title: '抱歉，您没有权限',
        icon: 'none'
      })
    }

  },

  // 没登录的情况下点击头像
  noLogin() {
    // 如果没有登陆，没办法点头像
    if (!this.data.userInfo.nickName) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },



  login(e) {
    // console.log(e.detail.userInfo)
    // 把信息存在本地缓存中
    wx.setStorageSync('userInfo', e.detail.userInfo);

    this.setData({
      userInfo: e.detail.userInfo,
      show: true
    })
  },

  // 点击进入菜单发布
  pbmenu() {
    wx.navigateTo({
      url: '../pbmenu/pbmenu',
    })
  },


  // 点击条详情
  toDetail(e) {
    wx.navigateTo({
      url: `../recipeDetail/recipeDetail?id=${e.currentTarget.id}`,
    })
  },



  // 左划删除
  deleteData(e) {
    let {
      id,
      dataset
    } = e.currentTarget;
    // console.log(id);



    // 警示框
    wx.showModal({
      title: '确定要删除吗?',
      success: async res => {
        if (res.confirm) {
          // 点击了确定
           // 先把数据库图片删除
           let aaa = await getAll("menu", {
            _id: id
          });
          // 删除图片
          wx.cloud.deleteFile({
            fileList: aaa.data[0].files
          })
          // 删除数据库
          let resault = await delData("menu", id);
          if (resault.errMsg == "document.remove:ok") {
            // 把当前下标的哪一项删除
            this.data.menuList.splice(dataset.index, 1);


            // 调用云函数，再删除某条信息时，把相关 关注也删除
            wx.cloud.callFunction({
              name: "del",
              data: {
                params: "menuFollow",
                id: {
                  menuId: id
                }
              },
              success: res => {
                if (res.errMsg == 'cloud.callFunction:ok') {
                  this.setData({
                    menuList: this.data.menuList
                  })
                  wx.showToast({
                    title: '删除成功',
                    icon: "success"
                  })
                }
              }
            })                
          }
        }
      }
    })
  },



  // 左划查看
  slideButtonTap(e) {
    // console.log(e.currentTarget);return
    let {
      id,
      dataset
    } = e.target;
    // console.log(id);
    wx.navigateTo({
      url: `../recipelist/recipelist?id=${id}&tit=${dataset.tit}`,
    })
  }
})