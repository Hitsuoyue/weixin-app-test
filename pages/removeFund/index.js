//index.js
//获取应用实例
const app = getApp()
const date = new Date();
const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
Page({
  data: {
    form: {
      netWorth: 0,
      date: currentDay,
      rate: 0.15
    },
    fundId: ''
  },
  bindDeleteItem() {
    const fundId = this.data.fundId;
    const myFundObj = wx.getStorageSync('myFundObj') || {};
    const currentFunObj = myFundObj[fundId] || {};
    const { myFundList=[], info } = currentFunObj;
    console.log('myFundList', myFundList)
    console.log('this.data.index', this.data.index)
    myFundList.splice(this.data.index, 1);
    myFundList.map((item, index) => {
      item.index = index;
    });
    currentFunObj.myFundList = myFundList;
    myFundObj[fundId] = currentFunObj;
    console.log('myFundObj', myFundObj)
    wx.setStorageSync('myFundObj', myFundObj);
    wx.navigateBack({
      url: `../myFundList/index?fundId=${fundId}&fundName=${this.data.fundName}`
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const fundId = this.data.fundId;
    const myFundObj = wx.getStorageSync('myFundObj') || {};
    const currentFunObj = myFundObj[fundId] || {};
    const myFundList = currentFunObj.myFundList || [];
    let allBuyInAmount = 0.00, allBuyInShare = 0.00, unitNetWorth = 0.00;
    myFundList.map(item => {
      if(item.type === 'add') {
        allBuyInAmount = allBuyInAmount + item.amount;
        allBuyInShare = allBuyInShare + item.share;
      } 
      unitNetWorth = allBuyInAmount / allBuyInShare; //单位净值
    })
    const income = e.detail.value.amount - e.detail.value.share * unitNetWorth;

    if(this.data.index != undefined) {
      myFundList[this.data.index] = {...e.detail.value, index: this.data.index, type: 'remove', income: income}; 
    } else {
      myFundList.push({...e.detail.value, index: myFundList.length, type: 'remove', income: income}); 
    }

    
    currentFunObj.myFundList = myFundList;
    myFundObj[fundId] = currentFunObj;
    wx.setStorageSync('myFundObj', myFundObj);
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
  bindShareChange: function(e) {
    console.log('赎回份额发送选择改变，携带值为', e.detail.value)
    this.data.form.share = e.detail.value;

    if(!!(this.data.form.share && this.data.form.netWorth && this.data.form.date)) {
    console.log('this.data.form.amount && this.data.form.netWorth && this.data.form.date', !!(this.data.form.amount && this.data.form.netWorth && this.data.form.date))
      this.data.form.amount = (this.data.form.netWorth * (1 - this.data.form.rate/100)*this.data.form.share).toFixed(2);
      console.log('this.data.form.amount--input', this.data.form.amount)
    }
    this.setData({
      form: this.data.form
    })
  },
  bindNetWorthChange: function(e) {
    this.data.form.netWorth = e.detail.value;
    if(!!(this.data.form.share && this.data.form.netWorth && this.data.form.date)) {
      console.log('this.data.form.amount && this.data.form.netWorth && this.data.form.date', !!(this.data.form.amount && this.data.form.netWorth && this.data.form.date))
        this.data.form.amount = (this.data.form.netWorth * (1 - this.data.form.rate/100)*this.data.form.share).toFixed(2);
        console.log('this.data.form.amount--input', this.data.form.amount)
      }
    this.setData({
      form: this.data.form
    })
  },
  bindRateChange: function(e) {
    console.log('rate 发送选择改变，携带值为', e.detail.value)
    this.data.form.rate = e.detail.value;

    if(!!(this.data.form.share && this.data.form.netWorth && this.data.form.date)) {
      console.log('this.data.form.amount && this.data.form.netWorth && this.data.form.date', !!(this.data.form.amount && this.data.form.netWorth && this.data.form.date))
        this.data.form.amount = (this.data.form.netWorth * (1 - this.data.form.rate/100)*this.data.form.share).toFixed(2);
        console.log('this.data.form.amount--input', this.data.form.amount)
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
        netWorthData && netWorthData[0] && netWorthData[0][1] ? self.data.form.netWorth = netWorthData[0][1] : null;
        console.log('this.data.form', self.data.form)
        if(!!(self.data.form.share && self.data.form.netWorth && self.data.form.date)) {
          self.data.form.amount = (self.data.form.netWorth * (1 - self.data.form.rate/100)*self.data.form.share).toFixed(2);
          console.log('self.data.form.amount--input', self.data.form.amount)
        }
        self.setData({
          form: self.data.form
        })

      }
    });
  },
  onLoad: function (options) {
    const fundData = options.fundData ? JSON.parse(options.fundData) : undefined;
    if(fundData !== undefined) {
      this.setData({
        fundId: options.fundId || '000001',
        fundName: options.fundName,
        form: fundData,
        index: fundData.index !== undefined ? fundData.index : ''
      })
    } else {
      this.setData({
        fundId: options.fundId || '000001',
        fundName: options.fundName,
      })
    }
  },
})
