let Mock = require('../../dist/mock.js');
/*数据源来自于mock.js数据，调用url: http://rapapi.org/mockjs/17332/api/list?accessToken=l
// mock.js =>> 自己去mock.js官网下载并项目导入，这里只是解析数据
// 因为是 http协议传输，小程序是https , 你需要先小程序开发工具勾选不校验安全域名才能获取到数据
*/
Page({
  data: {
    screenHeight: 0,
    requestOrderList: [], // 获取订单的数据
    requestPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 10,      //返回数据的个数 ，前端自己可以定制返回数据的个数
    requestLoading: false, //"上拉加载"的变量，默认false，隐藏  
    requestLoadingComplete: false  //“没有数据”的变量，默认false，隐藏  
  },

  /**
   * 请求数据封装
   */
  fetchOrderList: function () {
    let that = this;
    let requestPageNum = this.data.requestPageNum, // 第几次加载数据(第几页)
      callbackcount = this.data.callbackcount; //返回数据的个数(一次性取数据的个数)
    wx.request({
      url: 'http://rapapi.org/mockjs/17332/api/list?accessToken=l',
      data: {
        pageNum: requestPageNum,
        pageSize: callbackcount
      },
      success: function (res) {
        let resData = Mock.mock(res.data.data);
        let pageNum = Math.ceil(resData.info.total / resData.info.pageSize); //rap数据总页码
        console.log(resData, 'rap数据');
        console.log(pageNum, 'rap数据总页码');
        console.log(that.data.requestPageNum, '当前第几页')

        let screenHeight = that.data.screenHeight;
        let screenOrderNum = parseInt(screenHeight / 150);
        console.log(screenOrderNum, '满屏最多能放几个卡片')
        // 9 >= 1, 2, 3 知道 currentPage 大于 rap数据总页码
        if (pageNum >= that.data.requestPageNum && (resData.results.length > screenOrderNum)) {
          that.setData({
            requestLoading: true,
            requestOrderList: that.data.requestOrderList.concat(resData.results)
          });
        } else if (pageNum >= that.data.requestPageNum && (resData.results.length <= screenOrderNum)) {
          that.setData({
            requestLoadingComplete: false,
            requestLoading: false,
            requestOrderList: that.data.requestOrderList.concat(resData.results)
          })
        } else {
          that.setData({
            requestLoadingComplete: true,
            requestLoading: false
          })
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取系统高度，判断正在加载中是否显示, 每个卡片的高度是300rpx;
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight, 'screenHeight')
        that.setData({
          screenHeight: res.windowHeight
        })
      },
    })

    this.fetchOrderList(); // 第一次请求数据
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("page下拉动作")
    wx.showLoading({
      title: '努力加载中',
    });
    this.setData({
      requestPageNum: 1,
      requestOrderList: [],
      requestLoading: false,
      requestLoadingComplete: false
    });
    this.fetchOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("page上拉触底")
    let that = this;
    if (that.data.requestLoading && !that.data.requestLoadingComplete) {
      that.setData({
        requestPageNum: that.data.requestPageNum + 1,  //每次触发上拉事件，把requestPageNum+1
      })
      that.fetchOrderList();
    }
  }
})