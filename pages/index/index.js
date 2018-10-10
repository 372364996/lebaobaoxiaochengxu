// pages/center.js
//获取应用实例
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        Industry: {},
        xuexiao: "",
        markers: [{
            id: 1,
            latitude: 36.577757,
            longitude: 114.491674,
            name: '邯郸乐宝宝小儿推拿'
        }]
    },    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log('onLoad')
        console.log(app.globalData)
        var that = this
        wx.login({
            success: function (res_code) {
                wx.getUserInfo({
                    withCredentials: true,
                    success: function (res) {
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
                            success: function (res_user) {
                                wx.request({
                                    url: app.globalData.hostUrl + '/weichat/Info',
                                    data: {
                                        userid: res_user.data.Id
                                    },
                                    success: function (res) {
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
                    fail: function () {
                        //获取用户信息失败后。请跳转授权页面         
                        wx.navigateTo({
                            url: '../login/login',
                        })
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {}
})