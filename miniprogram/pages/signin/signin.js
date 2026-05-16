// pages/signin/signin.js - 签到页逻辑
const app = getApp()

Page({
  data: {
    // 连续签到天数
    signStreak: 0,
    // 今日是否已签到
    isSignedToday: false,
    // 用户下载次数
    downloadCount: 0,
    // 今日广告观看次数
    adWatchedToday: 0,
    // 本周签到状态 (0=未签到, 1=已签到)
    weekStatus: [0, 0, 0, 0, 0, 0, 0],
    // 签到奖励规则
    rewards: [
      { day: 1, reward: 1 },
      { day: 2, reward: 1 },
      { day: 3, reward: 1 },
      { day: 4, reward: 2 },
      { day: 5, reward: 2 },
      { day: 6, reward: 2 },
      { day: 7, reward: 3 }
    ],
    // 是否显示签到成功弹窗
    showSuccessModal: false,
    // 今日奖励
    todayReward: 0
  },

  onLoad() {
    this.loadSigninStatus()
  },

  onShow() {
    this.loadSigninStatus()
  },

  // 加载签到状态
  loadSigninStatus() {
    const userInfo = app.globalData.userInfo || {}
    const signStreak = app.globalData.signStreak || 0
    const isSignedToday = app.globalData.isSignedToday || false
    const downloadCount = app.globalData.downloadCount || 0
    const adWatchedToday = app.globalData.adWatchedToday || 0

    // 生成本周签到状态
    const weekStatus = this.generateWeekStatus(signStreak, isSignedToday)

    this.setData({
      signStreak,
      isSignedToday,
      downloadCount,
      adWatchedToday,
      weekStatus
    })
  },

  // 生成本周签到状态
  generateWeekStatus(streak, isSignedToday) {
    const today = new Date()
    const dayOfWeek = today.getDay() || 7 // 转换为 1-7 (周一到周日)
    const weekStatus = [0, 0, 0, 0, 0, 0, 0]
    
    // 计算本周已过去的几天
    for (let i = 0; i < dayOfWeek; i++) {
      // 如果是今天，且已签到，则标记为已签到
      if (i === dayOfWeek - 1 && isSignedToday) {
        weekStatus[i] = 1
      } else if (i === dayOfWeek - 1) {
        // 今天是待签到状态
        weekStatus[i] = 0
      } else if (streak > i - dayOfWeek + 7) {
        // 之前连续签到的日期
        weekStatus[i] = 1
      }
    }

    return weekStatus
  },

  // 执行签到
  async handleSignin() {
    if (this.data.isSignedToday) {
      wx.showToast({
        title: '今日已签到',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '签到中...' })

    try {
      const res = await wx.cloud.callFunction({
        name: 'dailySign'
      })

      wx.hideLoading()

      if (res.result && res.result.success) {
        // 计算今日奖励
        const newStreak = res.result.newStreak || this.data.signStreak + 1
        const todayReward = this.calculateReward(newStreak)

        // 更新本地数据
        app.globalData.signStreak = newStreak
        app.globalData.isSignedToday = true
        app.globalData.downloadCount += todayReward

        // 更新本周状态
        const weekStatus = [...this.data.weekStatus]
        weekStatus[weekStatus.length - 1] = 1

        this.setData({
          signStreak: newStreak,
          isSignedToday: true,
          downloadCount: app.globalData.downloadCount,
          weekStatus,
          showSuccessModal: true,
          todayReward
        })

        // 显示成功弹窗
        this.showSigninSuccessModal(todayReward)
      } else {
        throw new Error('签到失败')
      }
    } catch (err) {
      console.error('签到失败', err)
      wx.hideLoading()

      // 降级处理：本地签到
      const newStreak = this.data.signStreak + 1
      const todayReward = this.calculateReward(newStreak)

      app.globalData.signStreak = newStreak
      app.globalData.isSignedToday = true
      app.globalData.downloadCount += todayReward

      const weekStatus = [...this.data.weekStatus]
      weekStatus[weekStatus.length - 1] = 1

      this.setData({
        signStreak: newStreak,
        isSignedToday: true,
        downloadCount: app.globalData.downloadCount,
        weekStatus
      })

      this.showSigninSuccessModal(todayReward)
    }
  },

  // 计算奖励
  calculateReward(streak) {
    const day = streak % 7 || 7
    if (day >= 7) return 3
    if (day >= 4) return 2
    return 1
  },

  // 显示签到成功弹窗
  showSigninSuccessModal(reward) {
    this.setData({ showSuccessModal: true, todayReward: reward })
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showSuccessModal: false })
  },

  // 获取下周奖励预览
  getNextReward() {
    const nextDay = (this.data.signStreak + 1) % 7 || 7
    if (nextDay >= 7) return 3
    if (nextDay >= 4) return 2
    return 1
  },

  // 看广告
  handleWatchAd() {
    wx.switchTab({
      url: '/pages/index/index'
    })
    // 首页会自动处理广告
  }
})
