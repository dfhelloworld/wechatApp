//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        inputValue: '',
        qqmap:{}
    },
    onLoad:function(){
       this.qqmap = new QQMapWX({
        key: '4WJBZ-FXP6J-TFJF4-FWJMM-BJKOO-4ZFDX'
      }) 

      this.getLocation().then(result => {
        if (result) {
          let latitude = result.latitude;
          let longitude = result.longitude;
          return this.getCityInfo(latitude, longitude);
        } else {
          throw '无法获取地理位置'
        }
      }).then(res => {

      }).catch(err => {
        console.log(err);
      })
    },
    onShow:function(){
 
    },
    //获取当前位置信息
    getLocation:function(){ 
        return new Promise((reslove,reject)=>{
        wx.getLocation({
            type: 'wgs84',
            success:reslove, 
            fail:reject 
        }) 
    })},

    //根据经纬度获取城市信息
    getCityInfo:function(latitude,longitude){
      return new Promise((resolve,reject)=>{
        this.qqmap.reverseGeocoder({
          location:{
            latitude:latitude,
            longitude:longitude
          },
          success:resolve,
          fail:reject
        })
      })
    },
  
 
  bindButtonTap:function(){  
    if(this.data.inputValue){
      let url = encodeURI('https://free-api.heweather.net/s6/weather/forecast?location=' + this.data.inputValue + '&key=2be22d4891af4199aaff57f82a9eec9a')
      console.log(url);
      wx.request({
        url: url, 
        success(result) {
          let tommorrow = result.data.HeWeather6[0].daily_forecast[0]
          console.log(tommorrow)
          util.showModel(`明日天气:`,`${tommorrow.cond_txt_d},最低温度：${tommorrow.tmp_min},最高温度:${tommorrow.tmp_max}`) 
        },

        fail(error) {
          util.showModel('请求失败', error)
          console.log('request fail', error)
        }
      })
    }
  },
  cityInput:function(e){
    this.setData({ inputValue: e.detail.value} 
    )
  }, 
})
