import {
  addData,
  upDate,
  getAll,
  delData
} from "../../utils/db";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    add: false, //false  不出现输入框
    edit: false,
    val: "",
    list: [],
    editVal: '',
    editId: "",
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    // 控制删除警示弹框 显示隐藏状态
    dialogShow: false,
    dialogTit: '确定要删除吗?',
    delId: ''
  },

  // 弹框按钮点击触发事件
  async tapDialogButton(e) {
    switch (e.detail.index) {
      case 0:
        // 如果点取消，显示框消失
        this.setData({
          dialogShow: false
        })
        break;
      case 1:
        // 警示框隐藏
        this.setData({
          dialogShow: false
        })
        wx.showLoading({
          title: '删除中...',
        })
        let result = await delData("menuCate", this.data.delId);
        // 如果删除成功
        if (result.errMsg == "document.remove:ok") {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            success: res => {
              // 调用函数渲染页面
              this.empty();
            }
          })
        }
        break;
      default:
        console.log('失败');
    }
  },

  onLoad() {
    this.empty()
  },
  // 添加菜谱
  addCp() {
    this.setData({
      add: true
    })
  },

  // 点击修改
  edit(e) {
    // 输入框出现
    this.setData({
      edit: true,
      editId: e.target.id
    })
  },

  // 输入框后面的修改
  async editData() {
    wx.showLoading({
      title: '修改中...',
    })
    let id = this.data.editId;
    let result = await upDate("menuCate", id, {
      cateName: this.data.editVal
    });

    if (result.errMsg == 'document.update:ok') {

      // 提示框
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        success: async res => {
          // 清空输入框，关闭输入框
          this.setData({
            edit: false,
            editVal: ""
          })
          // 成功后请求数据库列表， 渲染页面   
          this.empty()
        }
      })


    }

  },


  // 删除
  async del(e) {
    // 点击删除警示用户
    this.setData({
      dialogShow: true
    })

    // 把id 保存在data内
    this.setData({
      delId: e.target.id
    })
  },

  // // 获取添加输入框内容
  changeModel(e) {
    this.setData({
      val: e.detail.value
    })
  },
  // 获取修改输入框内容
  changeModel1(e) {

    this.setData({
      editVal: e.detail.value
    })
  },


  // 点击添加数据
  async addData() {
    wx.showLoading({
      title: '玩命上传中...',
    })
    let result = await addData("menuCate", {
      cateName: this.data.val,
      // 添加时间
      addTime: new Date().getTime()
    });

    // 如果success  执行下面操作
    if (result.errMsg == 'collection.add:ok') {
      // 提示框
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        success: async res => {
          // 清空输入框，关闭输入框
          this.setData({
            val: "",
            add: false
          })

          // 成功后请求数据库列表， 渲染页面   
          this.empty()
        }
      })

    }
  },

  // 每次请求一次刷新，渲染页面
  async empty() {
    let result = await getAll("menuCate");
    this.setData({
      list: result.data
    })
  }

})