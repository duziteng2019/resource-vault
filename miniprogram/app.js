// app.js - 小程序入口文件

// 初始化云开发
wx.cloud.init({
  env: 'YOUR_ENV_ID', // 替换为你的云环境 ID
  traceUser: true
})

App({
  globalData: {
    userInfo: null,
    downloadCount: 0,
    adWatchedToday: 0,
    signStreak: 0,
    isSignedToday: false
  },
  
  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus()
    
    // 获取用户下载次数
    this.getUserDownloadCount()
    
    // 获取今日广告观看次数
    this.getTodayAdCount()
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    } else {
      // 静默登录
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          console.log('静默登录成功', res)
        }
      })
    }
  },
  
  // 获取用户下载次数
  getUserDownloadCount() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      success: res => {
        if (res.result && res.result.data) {
          this.globalData.downloadCount = res.result.data.downloadCount || 0
          this.globalData.signStreak = res.result.data.signStreak || 0
          this.globalData.isSignedToday = this.checkIsSignedToday(res.result.data.lastSignDate)
        }
      },
      fail: err => {
        console.error('获取用户信息失败', err)
        // 使用本地缓存的默认值
        this.globalData.downloadCount = wx.getStorageSync('downloadCount') || 5
      }
    })
  },
  
  // 获取今日广告观看次数
  getTodayAdCount() {
    const today = this.formatDate(new Date())
    const adData = wx.getStorageSync('adWatchedToday') || {}
    
    if (adData.date === today) {
      this.globalData.adWatchedToday = adData.count || 0
    } else {
      // 新的一天，重置计数
      this.globalData.adWatchedToday = 0
      wx.setStorageSync('adWatchedToday', { date: today, count: 0 })
    }
  },
  
  // 检查今天是否已签到
  checkIsSignedToday(lastSignDate) {
    if (!lastSignDate) return false
    const today = this.formatDate(new Date())
    const lastSign = this.formatDate(new Date(lastSignDate))
    return today === lastSign
  },
  
  // 格式化日期为 YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },
  
  // 更新本地下载次数
  updateDownloadCount(delta) {
    this.globalData.downloadCount += delta
    wx.setStorageSync('downloadCount', this.globalData.downloadCount)
  },
  
  // 增加广告观看次数
  incrementAdCount() {
    this.globalData.adWatchedToday++
    const today = this.formatDate(new Date())
    wx.setStorageSync('adWatchedToday', { date: today, count: this.globalData.adWatchedToday })
  }
})
