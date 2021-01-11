//index.js
//获取应用实例
const app = getApp()

function transFundList(data) {
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
const date = new Date();
const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
Page({
  data: {
    motto: 'Hello World~~~~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    fundList: [],
    form: {
      netWorth: 0,
      date: currentDay,
      rate: 0.15
    },
    fundId: ''
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const fundId = this.data.fundId;
    const myFundObj = wx.getStorageSync('myFundObj') || {};
    const currentFunObj = myFundObj[fundId] || {};
    const { myFundList=[], info } = currentFunObj;
    myFundList.push({...e.detail.value, index: myFundList.length, type: 'add'}); 
    currentFunObj.myFundList = myFundList;
    !info ? currentFunObj.info = { fundName: this.data.fundName } : null;
    myFundObj[fundId] = currentFunObj;
    console.log('myFundObj', myFundObj)
    wx.setStorageSync('myFundObj', myFundObj);

    console.log('wx.getCurrentPages()', getCurrentPages())
    if( getCurrentPages()[ getCurrentPages().length - 2].route === 'pages/myFundList/index') {
      wx.navigateBack({
        url: `../myFundList/index?fundId=${fundId}&fundName=${this.data.fundName}`
      })
    } else {
      wx.redirectTo({
        url: `../myFundList/index?fundId=${fundId}&fundName=${this.data.fundName}`
      })
    }
  
  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  bindAmountChange: function(e) {
    console.log('input发送选择改变，携带值为', e.detail.value)
    this.data.form.amount = e.detail.value;
    if(!!(this.data.form.amount && this.data.form.netWorth && this.data.form.date)) {
    console.log('this.data.form.amount && this.data.form.netWorth && this.data.form.date', !!(this.data.form.amount && this.data.form.netWorth && this.data.form.date))
      this.data.form.share = (this.data.form.amount * (1 - this.data.form.rate)/this.data.form.netWorth).toFixed(2);
      console.log('this.data.form.share--input', this.data.form.share)
    }
    this.setData({
      form: this.data.form
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.form.date = e.detail.value;
    const self = this;
    wx.request({
      url: `https://api.doctorxiong.club/v1/fund/detail?code=${self.data.fundId}&startDate=${e.detail.value}&endDate=${e.detail.value}`, //仅为示例，并非真实的接口地址
      method: 'GET',
      success (res) {
        const data = res.data && res.data.data;
        const { netWorthData } = data;
        netWorthData[0] && netWorthData[0][1] ? self.data.form.netWorth = netWorthData[0][1] : null;
        console.log('净值', netWorthData[0][1])
        if(self.data.form.amount && self.data.form.netWorth && self.data.form.date) {
          self.data.form.share = (self.data.form.amount * (1 - self.data.form.rate)/self.data.form.netWorth).toFixed(2);
          console.log('this.data.form.share--date', self.data.form.share)
        }
        self.setData({
          form: self.data.form
        })
      }
    })
 
    
  },
  onLoad: function (options) {
    console.log('options', options)   
    this.setData({
      fundId: options.fundId || '000001',
      fundName: options.fundName,
    })
  },
  
})
