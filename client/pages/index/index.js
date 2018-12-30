//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    inputValue: '',
    currentCity: "",
    weatherInfo: [],
    todayWeather: {},
    mainImageSrc: "",
    secondImageSrc: "",
    thirdImageSrc: "",
    weatherQuanlity: ""
  },
  //初始化数据
  onLoad: function() {
    this.getLocation().then(result => {
      if (result) {
        let latitude = result.latitude;
        let longitude = result.longitude;
        return this.getWeatherInfo(latitude, longitude);
      } else {
        throw '无法获取地理位置'
      }
    }).then(res => { 
      if (res.data.HeWeather6.length) {
        this.weatherInfo = res.data.HeWeather6[0].daily_forecast;
        this.todayWeather = this.weatherInfo[0];
        this.setData({
          todayWeather: this.weatherInfo[0],
          day: this.weatherInfo[0].date.split("-")[2],
          month: this.weatherInfo[0].date.split("-")[1],
          tommorrowWeather: this.weatherInfo[1],
          dayAfterWeather: this.weatherInfo[2],
          mainImageSrc: `../../weather-icon/${this.todayWeather.cond_code_d}.png`,
          secondImageSrc: `../../weather-icon/${this.weatherInfo[1].cond_code_d}.png`,
          thirdImageSrc: `../../weather-icon/${this.weatherInfo[2].cond_code_d}.png`,
        })
        console.log(this.todayWeather)
      }
      this.setData({
        currentCity: res.data.HeWeather6[0].basic.parent_city
      })
      return this.getWeatherQuanlity(res.data.HeWeather6[0].basic.parent_city)
    }).then(res=>{
      console.log(res);
      this.setData({
        weatherQuanlity:res.data.HeWeather6[0].air_now_city.aqi,
        weatherCondition: res.data.HeWeather6[0].air_now_city.qlty,
        weatherConditionColor:this.getWeatherConditionColor(res.data.HeWeather6[0].air_now_city.qlty)
      })
    }).catch(err => {
      console.log(err);
    })
  },
  // onReady: function() {
  //   console.log(this.weatherInfo)
  // },
  //获取当前位置信息
  getLocation: function() {
    return new Promise((reslove, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: reslove,
        fail: reject
      })
    })
  },

  //获取天气信息
  getWeatherInfo: function(latitude, longitude) {
    let url = encodeURI(`https://free-api.heweather.net/s6/weather/forecast?location= ${latitude},${longitude}&key=2be22d4891af4199aaff57f82a9eec9a`);
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: resolve,
        fail: reject
      })
    })
  },
  getWeatherQuanlity:function(city){
    let url = encodeURI(`https://free-api.heweather.net/s6/air/now?location=${city}&key=2be22d4891af4199aaff57f82a9eec9a`);
    return new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        success:resolve,
        fail:reject
      })
    })
  },
  //获取天气状况对应颜色
  getWeatherConditionColor:function(condition){
    switch(condition){
      case "优":
        return "#339900";
      break;
      case "良":
        return "#99CC66";
        break;
      case "轻度污染":
        return "#FFFF99";
        break;
      case "中度污染":
        return "#FF9966";
        break;
      case "重度污染":
        return "#FF0000";
        break;
      case "严重污染":
        return "#990033";
        break;
    }
  }
})