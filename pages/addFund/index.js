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

Page({
  data: {
    motto: 'Hello World~~~~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    fundList: [],
    form: {
      netWorth: 0,
      date: '2016-09-01',
      rate: 0.15
    }
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  bindAmountChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.form.amount = e.detail.value;
    //todo
    if(this.data.form.amount && this.data.form.netWorth && this.data.form.date) {
      this.data.form.share = this.data.form.amount * (1 - this.data.form.rate)/this.data.form.netWorth;
    }
    this.setData({
      form: this.data.form
    })
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.form.date = e.detail.value;
    //todo
    this.data.form.netWorth = 12;
    this.data.form.share = 12;
    if(this.data.form.amount && this.data.form.netWorth && this.data.form.date) {
      this.data.form.share = this.data.form.amount * (1 - this.data.form.rate)/this.data.form.netWorth;
    }
    this.setData({
      form: this.data.form
    })
  },
  onLoad: function () {
    
  },
  
})
