var app = getApp();

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

// 引入配置
var config = require('../../config');

Page({
  data: {
    oPwd: '',
    nPwd: '',
    rnPwd: '',
  },

  /**
   * 页面渲染完成后，启动
   * */
  onReady() {
    wx.setNavigationBarTitle({ title: '修改查询密码' });
  },

  /**
   * 后续后台切换回前台的时候，也要重新启动
   */
  onShow() {
    if (this.pageReady) {
      this.enter();
    }
  },

  /**
   * 页面卸载时，退出
   */
  onUnload() {
    this.quit();
  },

  /**
   * 页面切换到后台运行时，退出
   */
  onHide() {
    this.quit();
  },

  /**
   * 启动
   */
  enter() {
    this.pushMessage(createSystemMessage('正在登录...'));

    // 如果登录过，会记录当前用户在 this.me 上
    if (!this.me) {
      qcloud.request({
        url: `https://${config.service.host}/user`,
        login: true,
        success: (response) => {
          this.me = response.data.data.userInfo;
          this.connect();
        }
      });
    } else {
      this.connect();
    }
  },

  /**
   * 退出聊天室
   */
  quit() {
    if (this.tunnel) {
      this.tunnel.close();
    }
  },

  oPwdInputContent(e) {
    this.setData({ oPwd: e.detail.value.replace(/\s+/g, '') });
  },

  nPwdInputContent(e) {
    this.setData({ nPwd: e.detail.value.replace(/\s+/g, '') });
  },

  rnPwdInputContent(e) {
    this.setData({ rnPwd: e.detail.value.replace(/\s+/g, '') });
  },

  /**
   * 点击「确定」按钮
   **/
  updPwd(e) {
    console.info(app.globalData.openid);
    if (this.data.oPwd == '' || this.data.nPwd == '' || this.data.rnPwd == '') {
      wx.showModal({
        title: '提示',
        content: '输入的内容不能为空值',
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    } else if (this.data.nPwd != this.data.rnPwd) {
      wx.showModal({
        title: '提示',
        content: '两次输入的新密码不一致',
        confirmColor: '#118EDE',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      });
    } else {
      var that = this
      wx.request({
        url: config.service.updPwdUrlCustom,
        /*
        data: {
          jsonData: '{\"WXID\":\"' + app.globalData.openid + '\",\"oPwd\":\"' + that.data.oPwd + '\",\"nPwd\":\"' + that.data.nPwd + '\"}'
        }, 
        */
        data: {
          WXID: app.globalData.openid,
          oPwd: that.data.oPwd,
          nPwd: that.data.nPwd
        },
        header: {
          //'Content-Type': 'application/json'
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              content: '查询密码修改成功',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '查询密码修改失败',
              confirmColor: '#118EDE',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            });
          }
        },
        fail: function (err) {
          console.log(err)
        },
        complete: function () {
        }
      })
    }
  },
});