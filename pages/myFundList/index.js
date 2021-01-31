//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    myFundList: [],
    fundId: '',
    fundName: '',
    title: '',
    unitNetWorth: 0.00,
    currentShare: 0.00,
    cost: 0.00,
    marketValue: 0.00,
    yestodayIncome: 0.00,
    currentIncome: 0.00,
    allIncome: 0.00,
    returnRate: 0.00
  },
  onLoad: function (options) {
    this.data.fundId = options.fundId;
    this.data.fundName = options.fundName;
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    });
    const fundId = this.data.fundId;
    const fundName = this.data.fundName;
    const self = this;
    wx.request({
      url: `https://api.doctorxiong.club/v1/fund/detail?code=${fundId}`, //仅为示例，并非真实的接口地址
      method: 'GET',
      success (res) {
        const data = res.data && res.data.data;
        const { netWorthData } = data;
        const currentNetWorth = netWorthData != undefined ? netWorthData[netWorthData.length - 1][1] : 0;
        const yestodayNetWorth = netWorthData != undefined ? netWorthData[netWorthData.length - 2][1] : 0;
        console.log('yestodayNetWorth', yestodayNetWorth, currentNetWorth)
        const currentFunObj = wx.getStorageSync('myFundObj')[fundId];
        const { myFundList = [], info = {} } = currentFunObj;
        let allBuyInAmount = 0.00, currentShare = 0.00, yestodayShare = 0.00, allBuyInShare = 0.00, cost = 0.00, marketValue = 0.00,
        currentIncome = 0.00, yestodayIncome = 0.00, allIncome = 0.00, returnRate = 0.00, unitNetWorth = 0.00;
        myFundList.map(item => {
          if(item.type === 'add') {
            allBuyInAmount = Number(allBuyInAmount) + Number(item.amount);
            allBuyInShare = Number(allBuyInShare) + Number(item.share);
            currentShare = Number((Number(currentShare) + Number(item.share)).toFixed(2));
            let date = new Date();
            const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            item.date !== currentDay ? yestodayShare = Number(yestodayShare) + Number(item.share) : null;
          } else {
            currentShare = Number(currentShare) - Number(item.share);
            let date = new Date();
            const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            item.date !== currentDay ? yestodayShare = Number(yestodayShare) - Number(item.share) : null;
            allIncome = Number(allIncome) + Number(item.income);
          }})
          unitNetWorth = allBuyInShare != 0 ? (Number(allBuyInAmount) / Number(allBuyInShare)).toFixed(2) : 0.00; //单位净值
          // 持仓份额 currentShare
          cost = (currentShare * unitNetWorth).toFixed(2); //投资成本
          marketValue = (currentShare * currentNetWorth).toFixed(2); //当前市值
          yestodayIncome = ((currentNetWorth - yestodayNetWorth) * yestodayShare).toFixed(2); //昨日收益
          currentIncome = (marketValue - cost).toFixed(2); //当前收益
          allIncome = (allIncome + Number(currentIncome)).toFixed(2); //累计收益
          returnRate = unitNetWorth != 0 ? Number(((currentNetWorth - unitNetWorth)/unitNetWorth)*100).toFixed(2) : 0.00; //收益率 = （当前净值-单位净值）/单位净值 * 100%
        self.setData({
          fundId: fundId,
          fundName,
          title: `${fundId} ${fundName}`,
          myFundList: myFundList,
          unitNetWorth,
          currentShare,
          cost,
          marketValue,
          yestodayIncome,
          currentIncome,
          allIncome,
          returnRate
        })
        wx.hideLoading();
      }
    })

    
    
    // const myFundObj = wx.getStorageSync('myFundObj') || {};
    // myFundObj[fundId] = {};
    // wx.setStorageSync('myFundObj', myFundObj);


  },
  bindToAdd: function () {
    console.log('add')
    wx.navigateTo({
      url: `../addFund/index?fundId=${this.data.fundId}&fundName=${this.data.fundName}`
    })
  },
  bindToRemove: function () {
    console.log('remove')
    wx.navigateTo({
      url: `../removeFund/index?fundId=${this.data.fundId}&fundName=${this.data.fundName}`
    })
  },
  toItem: function(e) {
    console.log('e', e, e.target.dataset, e.currentTarget.dataset.item)
    const { item={} } = e.currentTarget.dataset;
    const { type } = item;
    if(type === 'add') {
      wx.navigateTo({
        url: `../addFund/index?fundId=${this.data.fundId}&fundName=${this.data.fundName}&fundData=${JSON.stringify(item)}`
      })
    } else {
      wx.navigateTo({
        url: `../removeFund/index?fundId=${this.data.fundId}&fundName=${this.data.fundName}&fundData=${JSON.stringify(item)}`
      })
    }
   
  }
  
})