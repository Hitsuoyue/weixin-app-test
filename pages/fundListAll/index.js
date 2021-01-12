//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list: [],
    totalCost: 0.00,
    totalMarketValue: 0.00,
    totalCurrentIncome: 0.00,
    totalAllIncome: 0.00,
    totalYestodayIncome: 0.00
  },
  onShow: function (options) {
    const myFundObj = wx.getStorageSync('myFundObj') || {};
    if(Object.keys(myFundObj).length > 0) {
      wx.showLoading({
        title: '加载中',
      });
    }
    const self = this;
    const list = [];
    let totalCost = 0.00, totalMarketValue = 0.00, 
    totalCurrentIncome = 0.00, totalAllIncome = 0.00, totalYestodayIncome = 0.00;
    console.log('myFundObj', myFundObj)
    for(let key in myFundObj) {
      wx.request({
        url: `https://api.doctorxiong.club/v1/fund/detail?code=${key}`, //仅为示例，并非真实的接口地址
        method: 'GET',
        success (res) {
          const data = res.data && res.data.data;
          const { netWorthData } = data;
          const currentNetWorth = netWorthData != undefined ? netWorthData[netWorthData.length - 1][1] : 0;
          const yestodayNetWorth = netWorthData != undefined ? netWorthData[netWorthData.length - 2][1] : 0;
          let currentFunObj = myFundObj[key] || {};
          const { myFundList = [], info = {  } } = currentFunObj;
          const { fundName='' } = info;
          let allBuyInAmount = 0.00, currentShare = 0.00, yestodayShare = 0.00, allBuyInShare = 0.00, cost = 0.00, marketValue = 0.00,
          currentIncome = 0.00, yestodayIncome = 0.00, allIncome = 0.00, returnRate = 0.00, unitNetWorth = 0.00;
          myFundList.map(item => {
            if(item.type === 'add') {
              allBuyInAmount = Number(allBuyInAmount) + Number(item.amount);
              allBuyInShare = Number(allBuyInShare) + Number(item.share);
              currentShare = Number(currentShare) + Number(item.share);
              let date = new Date();
              const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
              item.date !== currentDay ? yestodayShare = Number(yestodayShare) + Number(item.share) : null;
            } else {
              currentShare = Number(currentShare) - Number(item.share);
              let date = new Date();
              const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
              item.date !== currentDay ? yestodayShare = Number(yestodayShare) + Number(item.share) : null;
              //累计收益 = 卖出金额 - 卖出份额*单位净值 + 当前收益
              allIncome = allIncome + item.income;
            }
          })
          unitNetWorth = allBuyInShare != 0 ? (Number(allBuyInAmount) / Number(allBuyInShare)).toFixed(2) : 0.00; //单位净值
          // 持仓份额 currentShare
          currentShare = Number(currentShare).toFixed(2);
          cost = (Number(currentShare) * Number(unitNetWorth)).toFixed(2); //投资成本
          marketValue = (Number(currentShare) * Number(currentNetWorth)).toFixed(2); //当前市值
          yestodayIncome = ((Number(currentNetWorth) - Number(yestodayNetWorth)) * Number(yestodayShare)).toFixed(2); //昨日收益
          currentIncome = (Number(marketValue) - Number(cost)).toFixed(2); //当前收益
          allIncome = (Number(allIncome) + Number(currentIncome)).toFixed(2); //累计收益
          returnRate = unitNetWorth != 0 ? ((Number(currentNetWorth) - Number(unitNetWorth))/Number(unitNetWorth)).toFixed(2) : 0.00; //收益率 = （当前净值-单位净值）/单位净值 * 100%
          list.push({
            fundId: key,
            fundName,
            share: currentShare,
            yestodayIncome,
            returnRate
          });
          console.log('totalCost', totalCost, Number(cost))
          totalCost = (Number(totalCost) + Number(cost)).toFixed(2);//总本金
          totalMarketValue = (Number(totalMarketValue) + Number(marketValue)).toFixed(2);//总市值
          totalCurrentIncome = (Number(totalCurrentIncome) + Number(currentIncome)).toFixed(2);//当前收益
          totalAllIncome = (Number(totalAllIncome) + Number(allIncome)).toFixed(2);//总盈亏
          totalYestodayIncome = (Number(totalYestodayIncome) + Number(yestodayIncome)).toFixed(2);//昨日收益 
          
          if(list.length == Object.keys(myFundObj).length) {
            console.log('list', list)
            self.setData({
              list,
              totalCost,
              totalMarketValue,
              totalCurrentIncome,
              totalAllIncome,
              totalYestodayIncome
            })
            wx.hideLoading()
          }
        }
      })
    }    
    // const myFundObj = wx.getStorageSync('myFundObj') || {};
    // myFundObj = {};
    // wx.setStorageSync('myFundObj', {});
  },
  bindToMyFundList: function (e) {
    console.log('add', e)
    const { fund_id, fund_name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../myFundList/index?fundId=${fund_id}&fundName=${fund_name}`
    })
  },
  bindToAdd: function () {
    wx.navigateTo({
      url: `../fundList/index`
    })
  },
  
  bindToRemove: function () {
    console.log('remove')
    wx.navigateTo({
      url: `../removeFund/index?fundId=${this.data.fundId}`
    })
  },
  
})






