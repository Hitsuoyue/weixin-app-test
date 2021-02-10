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
    console.log('Object.keys(myFundObj)', Object.keys(myFundObj))
    const list = new Array(Object.keys(myFundObj).length);
    let totalCost = 0.00, totalMarketValue = 0.00, 
    totalCurrentIncome = 0.00, totalAllIncome = 0.00, totalYestodayIncome = 0.00;
    console.log('myFundObj', myFundObj)
    for(let key in myFundObj) {
      wx.request({
        url: `https://api.doctorxiong.club/v1/fund/detail?code=${key}`, 
        method: 'GET',
        success (res) {
          const data = res.data && res.data.data;
          const { netWorthData } = data;
          const currentNetWorth = netWorthData != undefined ? netWorthData[netWorthData.length - 1][1] : 0;
          const yestodayNetWorth = netWorthData != undefined ? netWorthData[netWorthData.length - 2][1] : 0;
          let currentFunObj = myFundObj[key] || {};
          const { myFundList = [], info = {  }, index } = currentFunObj;
          const { fundName='' } = info;
          let allBuyInAmount = 0.00, currentShare = 0.00, yestodayShare = 0.00, allBuyInShare = 0.00, cost = 0.00, marketValue = 0.00,
          currentIncome = 0.00, yestodayIncome = 0.00, allIncome = 0.00, returnRate = 0.00, unitNetWorth = 0.00;
          myFundList.map(item => {
            if(item.type === 'add') {
              //持仓份额
              currentShare = Number((Number(currentShare) + Number(item.share)).toFixed(2));
              //投资成本
              cost = Number(cost) + Number(item.amount);
              //平均单位净值
              unitNetWorth = cost / currentShare;
              //总市值
              marketValue = currentShare * currentNetWorth;
              //当前收益
              currentIncome = marketValue - cost;
              //累计收益
              allIncome = allIncome;
              //昨日持仓份额
              let date = new Date();
              const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
              item.date !== currentDay ? yestodayShare = Number(yestodayShare) + Number(item.share) : null;
            } else {
              //持仓份额
              currentShare = Number(currentShare) - Number(item.share);
              //投资成本
              cost = Number(cost) - Number(item.share)*Number(unitNetWorth);
              //总市值
              marketValue = currentShare * currentNetWorth;
              //当前收益
              currentIncome = marketValue - cost;
              //累计收益
              allIncome = allIncome + ((Number(item.amount) - Number(item.share) * unitNetWorth));
              //昨日持仓份额
              let date = new Date();
              const currentDay = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
              item.date !== currentDay ? yestodayShare = Number(yestodayShare) - Number(item.share) : null;
            }
          })
           //收益率 = （当前净值-单位净值）/单位净值 * 100%
           returnRate = unitNetWorth != 0 ? Number(((currentNetWorth - unitNetWorth)/unitNetWorth)*100).toFixed(2) : 0.00; 
           //累计收益
           allIncome = (Number(allIncome) + Number(currentIncome)).toFixed(2); //累计收益
           //昨日收益
           yestodayIncome = ((currentNetWorth - yestodayNetWorth) * yestodayShare).toFixed(2); //昨日收益

          console.log('returnRate---', returnRate)
          list[index] = {
            fundId: key,
            fundName,
            share: currentShare,
            yestodayIncome,
            returnRate: returnRate
          };
          console.log('list', list, index)
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






