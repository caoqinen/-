import {
  inquire,
  getAll,
  addData,
  upDate,
  delData
} from "../../utils/db";
const app = getApp();
const db = wx.cloud.database();

Page({
  data: {
    detailList: {},
    show: false,
    id: "",
    follows: 0
  },


  async onLoad(e) {
    // console.log(e.id);return
    
    // 通过openid  查找相应的数据
    let followData = await getAll("menuFollow", {
      _openid: app.globalData._openid
    });

    // 如果当前menuid == 当前页面id  说明已经添加过
    let boo = followData.data.some(item => {
      return item.menuId == e.id
    })
    // 如果是以前添加过得发返回 true 关注点亮，
    this.setData({
      show: boo
    })
    // 本页面数据
    let result = await inquire("menu", e.id);
    // console.log(result);

    let {
      follows
    } = result.data;
   

    // 修改详情title
    wx.setNavigationBarTitle({
      title: result.data.menuName
    })


    // 进页面浏览量加1
    await upDate("menu", e.id, {
      views: db.command.inc(1)
    })
    
    this.setData({
      detailList: result.data,
      id: e.id,
      follows
    })

  },


  // 点击关注
  async guanzhu() {
    // false  说明还未关注
    if (!this.data.show) {
      // 如果是同一个人点多次关注则不生效  把menuFollow里面的数据取出来 通过openid
      let followData = await getAll("menuFollow", {
        _openid: app.globalData._openid
      });
      // 把星星变红
      this.setData({
        show: true
      })
      // 如果当前menuid == 当前页面id  说明已经添加过  boo返回true
      let boo = followData.data.some(item => {
        return item.menuId == this.data.id
      })
      // 如果已经是true 再点击的话就不再添加
      if (boo) {
        this.setData({
          show: true
        })
        wx.showToast({
          title: '请勿重复添加',
          icon: "none"
        })
      } else {
        // 如果没点击关注，就加入数据库
        let result = await addData("menuFollow", {
          menuId: this.data.id,
          addtime: new Date().getTime()
        })
        // 如果成功了 显示弹框  并且收藏数加1
        if (result.errMsg == 'collection.add:ok') {
          // console.log('进来了');

          let result = await upDate("menu", this.data.id, {
            follows: this.data.follows + 1
          });
          // 如果成功了 渲染页面
          if (result.errMsg == 'document.update:ok') {
            this.setData({
              follows: this.data.follows + 1
            })
          }
          wx.showToast({
            title: '已关注',
            icon: 'none'
          })
          // 收藏加1
        }
      }
    } else {
      wx.showModal({
        title: '确定要取消关注吗?',
        success: async res => {
          if (res.confirm) {
            // 点击了确定
            // 修改数据库follow -1
            let result = await upDate("menu", this.data.id, {
              follows: this.data.follows - 1
            });
            // 数据库成功了在渲染页面
            if (result.errMsg == 'document.update:ok') {
              this.setData({
                follows: this.data.follows - 1,
                show: false
              })

              // 通过openid  和 menuid 查到具体的某一条 
              let cc = await getAll("menuFollow", {
                _openid: app.globalData._openid,
                menuId: this.data.id
              })
              // 删除指定id那一项
              await delData("menuFollow", cc.data[0]._id);
              wx.showToast({
                title: '已取消关注',
                icon: 'none'
              })
            }
          } else {
            return
          }
        }
      })
    }
  },


  // 分享
  share() {
    wx.showToast({
      title: '还未开通此功能哦~',
      icon: 'none'
    })
  }

})