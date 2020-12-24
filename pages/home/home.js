//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World~~~~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    fundList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if(!wx.getStorageSync('fundList')) {
      wx.request({
        url: 'https://mall.api.fofeasy.cn/apimall/fund_screen', //仅为示例，并非真实的接口地址
        data: {
        },
        header: {
          'content-type': 'application/json', // 默认值
          'Authorization': '795722262f8b400a9a3dde0b0d007ce1'
        },
        method: 'POST',
        success (res) {
          console.log('res.data && res.data.data', res.data && res.data.data)
          
          console.log('fundList', wx.getStorageSync('fundList'))

          const data = res.data && res.data.data;
          let len = data.fund_id.length;
          let fundList = [];
          for(let i=0; i<len; i++) {
            fundList.push({
              fund_id: data.fund_id[i],
              compre_rank: data.compre_rank[i],
              foundation_date: data.foundation_date[i],
              fund_name: data.fund_name[i],
              fund_status: data.fund_status[i],
              industry1: data.industry1[i],
              is_resign: data.is_resign[i],
              max_drawdown: data.max_drawdown[i],
              max_drawdown_rank: data.max_drawdown_rank[i],
              nav: data.nav[i],
              return_a: data.return_a[i],
              return_a_rank: data.return_a_rank[i],
              sharpe_a: data.sharpe_a[i],
              sharpe_a_rank: data.sharpe_a_rank[i],
              statistic_date: data.statistic_date[i],
              stdev_a: data.stdev_a[i],
              stdev_a_rank: data.stdev_a_rank[i],
              type: data.type[i],
              type_name: data.type_name[i],
            })
          }
    console.log('fundList---11111', fundList)

          wx.setStorageSync("fundList", fundList)
          console.log('fundList---2222', wx.getStorageSync('fundList'))

        }
      })
    } else {
      this.setData({
        fundList: wx.getStorageSync('fundList')
      })
    }
    console.log('fundList---', wx.getStorageSync('fundList'))

    
    

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
