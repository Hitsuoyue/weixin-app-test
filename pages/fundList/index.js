//index.js
//获取应用实例
const app = getApp()

function transFundList(data) {
  let fundList = [];
  data.map(item => {
    fundList.push({
      fund_id: item[0],
      fund_name: item[2],
      fund_type: item[3]
    })
  })

  // for(let i=0; i<len; i++) {
  //   fundList.push({
  //     fund_id: data.fund_id[i],
  //     compre_rank: data.compre_rank[i],
  //     foundation_date: data.foundation_date[i],
  //     fund_name: data.fund_name[i],
  //     fund_status: data.fund_status[i],
  //     industry1: data.industry1[i],
  //     is_resign: data.is_resign[i],
  //     max_drawdown: data.max_drawdown[i],
  //     max_drawdown_rank: data.max_drawdown_rank[i],
  //     nav: data.nav[i],
  //     return_a: data.return_a[i],
  //     return_a_rank: data.return_a_rank[i],
  //     sharpe_a: data.sharpe_a[i],
  //     sharpe_a_rank: data.sharpe_a_rank[i],
  //     statistic_date: data.statistic_date[i],
  //     stdev_a: data.stdev_a[i],
  //     stdev_a_rank: data.stdev_a_rank[i],
  //     type: data.type[i],
  //     type_name: data.type_name[i],
  //   })
  // }
  wx.setStorageSync("fundList", fundList)
  return fundList;
}

Page({
  data: {
    fundList: []
  },
  //事件处理函数
  onInputChange: function(e) {
    const { detail: { value } } = e;
    console.log('change', e, value)
  },
  toAddFund: function(e) {
    console.log('toAddFund', e, e.currentTarget)
    const { fund_id, fund_name } = e.currentTarget.dataset;
    wx.redirectTo({
      url: `../addFund/index?fundId=${fund_id}&fundName=${fund_name}`
    })
  },
  onSearch: function(e) {
    const { detail: { value } } = e;
    console.log('change', e, value, typeof value, Number(value));
    const self = this;
    if(value) {
      wx.request({
        url: `https://api.doctorxiong.club/v1/fund?code=${value}`, //仅为示例，并非真实的接口地址
        data: {
        },
        header: {
          'content-type': 'application/json', // 默认值
        },
        method: 'GET',
        success (res) {
          console.log('res.data && res.data.data', res.data && res.data.data)
          console.log('fundList', wx.getStorageSync('fundList'))
          const data = res.data && res.data.data;
          data.map(item => {
            item.fund_id = item.code;
            item.fund_name = item.name;
            return item;
          });
          self.setData({
            fundList: data
          });
        }
      })
    } else {
      wx.request({
        // url: 'https://mall.api.fofeasy.cn/apimall/fund_screen', //仅为示例，并非真实的接口地址
        url: 'https://api.doctorxiong.club/v1/fund/all', //仅为示例，并非真实的接口地址
        data: {
        },
        header: {
          'content-type': 'application/json', // 默认值
        },
        method: 'GET',
        success (res) {
          //todo 只显示前100条
          const data = res.data && res.data.data.slice(0,100);
          self.setData({
            fundList: transFundList(data)
          })
        }
      })
    }
    
  },
  onLoad: function () {
    if(!wx.getStorageSync('fundList')) {
      let self = this;
      wx.request({
        // url: 'https://mall.api.fofeasy.cn/apimall/fund_screen', //仅为示例，并非真实的接口地址
        url: 'https://api.doctorxiong.club/v1/fund/all', //仅为示例，并非真实的接口地址
        data: {
        },
        header: {
          'content-type': 'application/json', // 默认值
        },
        method: 'GET',
        success (res) {
          //todo 只显示前100条
          const data = res.data && res.data.data.slice(0,100);
          self.setData({
            fundList: transFundList(data)
          })
        }
      })
    } else {
      this.setData({
        fundList: wx.getStorageSync('fundList')
      })
    }
  },
})
