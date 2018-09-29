//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '邯郸乐宝宝小儿推拿',
    userInfo: {},
    childName: null,
    phone: null,
    canusecount: 0,
    current: 'homepage'
  },

  handleChange({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goToCenter: function() {
    wx.navigateTo({
      url: '../center/center',
    })
  },
  onGotUserInfo: function(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },
  onLoad: function() {
    console.log('onLoad')
    console.log(app.globalData)
    var that = this
    //调用应用实例的方法获取全局数据

    wx.login({
      success: function(res_code) {
        wx.getUserInfo({
          withCredentials: true,
          success: function(res) {
            that.setData({
              userInfo: res.userInfo
            })
            wx.request({
              url: app.globalData.hostUrl + '/weichat/login',
              data: {
                code: res_code.code,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              success: function(res_user) {
                wx.request({
                  url: app.globalData.hostUrl + '/weichat/Info',
                  data: {
                    userid: res_user.data.Id
                  },
                  success: function(res) {
                    that.setData({
                      childName: res.data.ChildName,
                      phone: res.data.Phone,
                      canusecount: res.data.CanUseCount
                    });
                  }
                });
                console.log(res_user.data.Id)
              }
            })
          },
          fail: function() {
            //获取用户信息失败后。请跳转授权页面         
            wx.navigateTo({
              url: '../login/login',
            })
          }
        })
      }
    })
  }
})