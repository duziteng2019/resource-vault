// pages/mine/mine.js - 我的页面
const app = getApp()

Page({
  data: {
    // 用户信息
    userInfo: null,
    // 下载次数
    downloadCount: 0,
    // 累计下载
    totalDownloaded: 0,
    // 连续签到
    signStreak: 0,
    // 今日广告次数
    adWatchedToday: 0,
    // 下载历史
    downloadHistory: [],
    // 功能菜单
    menuItems: [
      { id: 'download', name: '下载记录', icon: 'history', url: '' },
      { id: 'favorites', name: '我的收藏', icon: 'star', url: '' },
      { id: 'settings', name: '设置', icon: 'settings', url: '' },
      { id: 'about', name: '关于我们', icon: 'info', url: '' },
      { id: 'feedback', name: '意见反馈', icon: 'feedback', url: '' },
      { id: 'help', name: '帮助中心', icon: 'help', url: '' }
    ]
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
  },

  onPullDownRefresh() {
    this.loadUserInfo()
    wx.stopPullDownRefresh()
  },

  // 加载用户信息
  loadUserInfo() {
    // 从全局数据获取
    const userInfo = app.globalData.userInfo
    const downloadCount = app.globalData.downloadCount
    const signStreak = app.globalData.signStreak
    const adWatchedToday = app.globalData.adWatchedToday

    // 获取本地存储的累计下载数
    const totalDownloaded = wx.getStorageSync('totalDownloaded') || 0

    // 获取下载历史
    const downloadHistory = wx.getStorageSync('downloadHistory') || []

    this.setData({
      userInfo,
      downloadCount,
      signStreak,
      adWatchedToday,
      totalDownloaded,
      downloadHistory: downloadHistory.slice(0, 5) // 只显示最近5条
    })
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功', res)
        
        // 保存用户信息
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)

        this.setData({
          userInfo: res.userInfo
        })

        wx.showToast({
          title: '授权成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败', err)
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        })
      }
    })
  },

  // 跳转功能页面
  navigateTo(e) {
    const { id } = e.currentTarget.dataset
    
    const pages = {
      download: '/pages/download-history/download-history',
      favorites: '/pages/favorites/favorites',
      settings: '/pages/settings/settings',
      about: '/pages/about/about',
      feedback: '/pages/feedback/feedback',
      help: '/pages/help/help'
    }

    if (pages[id]) {
      wx.navigateTo({
        url: pages[id]
      })
    } else {
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      })
    }
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '资源宝库 - 免费下载各类软件工具',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    }
  },

  // 刷新数据
  refreshData() {
    // 重新获取用户数据
    app.getUserDownloadCount()
    app.getTodayAdCount()

    this.loadUserInfo()

    wx.showToast({
      title: '刷新成功',
      icon: 'success'
    })
  }
})
