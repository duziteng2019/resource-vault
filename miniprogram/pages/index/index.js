// pages/index/index.js - 首页逻辑
const app = getApp()

Page({
  data: {
    // 用户下载次数
    downloadCount: 0,
    // 轮播图数据
    banners: [
      { id: 1, image: '/images/banner1.png', title: '限时活动' },
      { id: 2, image: '/images/banner2.png', title: '新用户福利' }
    ],
    // 分类数据
    categories: [
      { id: 1, name: '办公软件', icon: 'icon-bangong', color: '#667eea' },
      { id: 2, name: '设计工具', icon: 'icon-sheji', color: '#f093fb' },
      { id: 3, name: '开发工具', icon: 'icon-kaifa', color: '#4facfe' },
      { id: 4, name: '影音娱乐', icon: 'icon-yingyin', color: '#43e97b' },
      { id: 5, name: '系统工具', icon: 'icon-xitong', color: '#fa709a' },
      { id: 6, name: '实用工具', icon: 'icon-gongju', color: '#fee140' }
    ],
    // 推荐资源
    resources: [],
    // 热门资源
    hotResources: [],
    // 是否加载中
    loading: true,
    // 搜索关键词
    searchKeyword: ''
  },

  onLoad() {
    // 获取用户下载次数
    this.setData({
      downloadCount: app.globalData.downloadCount
    })
    
    // 加载资源数据
    this.loadResources()
  },

  onShow() {
    // 每次显示页面时更新下载次数
    this.setData({
      downloadCount: app.globalData.downloadCount
    })
  },

  onPullDownRefresh() {
    this.loadResources()
    wx.stopPullDownRefresh()
  },

  // 加载资源数据
  async loadResources() {
    this.setData({ loading: true })
    
    try {
      // 从云数据库获取资源列表
      const res = await wx.cloud.callFunction({
        name: 'getResources',
        data: { type: 'home' }
      })
      
      if (res.result && res.result.data) {
        this.setData({
          resources: res.result.data.slice(0, 6),
          hotResources: res.result.data.slice(0, 5),
          loading: false
        })
      } else {
        // 使用模拟数据
        this.setData({
          resources: this.getMockResources(),
          hotResources: this.getMockResources().slice(0, 5),
          loading: false
        })
      }
    } catch (err) {
      console.error('加载资源失败', err)
      // 使用模拟数据
      this.setData({
        resources: this.getMockResources(),
        hotResources: this.getMockResources().slice(0, 5),
        loading: false
      })
    }
  },

  // 获取模拟资源数据
  getMockResources() {
    return [
      {
        _id: '1',
        name: 'Adobe Photoshop 2024',
        category: '设计工具',
        cover: '/images/ps.png',
        downloadCount: 12580,
        rating: 4.9,
        size: '2.4 GB',
        cost: 1
      },
      {
        _id: '2',
        name: 'Microsoft Office 2021',
        category: '办公软件',
        cover: '/images/office.png',
        downloadCount: 25600,
        rating: 4.8,
        size: '4.1 GB',
        cost: 1
      },
      {
        _id: '3',
        name: 'Visual Studio Code',
        category: '开发工具',
        cover: '/images/vscode.png',
        downloadCount: 18900,
        rating: 4.9,
        size: '120 MB',
        cost: 1
      },
      {
        _id: '4',
        name: '剪映专业版',
        category: '影音娱乐',
        cover: '/images/jianying.png',
        downloadCount: 9800,
        rating: 4.7,
        size: '800 MB',
        cost: 1
      },
      {
        _id: '5',
        name: 'Adobe Premiere Pro',
        category: '影音娱乐',
        cover: '/images/pr.png',
        downloadCount: 8900,
        rating: 4.8,
        size: '3.2 GB',
        cost: 1
      },
      {
        _id: '6',
        name: 'Figma 桌面版',
        category: '设计工具',
        cover: '/images/figma.png',
        downloadCount: 5600,
        rating: 4.9,
        size: '200 MB',
        cost: 1
      }
    ]
  },

  // 跳转到资源详情页
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/resource-detail/resource-detail?id=${id}`
    })
  },

  // 跳转到分类页
  goToCategory(e) {
    const { id, name } = e.currentTarget.dataset
    wx.switchTab({
      url: '/pages/category/category'
    })
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    
    if (keyword) {
      wx.navigateTo({
        url: `/pages/category/category?keyword=${keyword}`
      })
    }
  },

  // 跳转到签到页
  goToSignin() {
    wx.switchTab({
      url: '/pages/signin/signin'
    })
  },

  // 看广告获取次数
  async watchAd() {
    // 检查今日广告次数
    if (app.globalData.adWatchedToday >= 10) {
      wx.showModal({
        title: '提示',
        content: '今日广告次数已用完，明天再来吧~',
        showCancel: false
      })
      return
    }

    // 检查下载次数
    if (app.globalData.downloadCount > 0) {
      wx.showModal({
        title: '提示',
        content: '您还有下载次数，不需要看广告哦~',
        showCancel: false
      })
      return
    }

    // 显示激励视频广告
    const rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: 'YOUR_AD_UNIT_ID' // 替换为实际的广告单元ID
    })

    rewardedVideoAd.onLoad(() => {
      console.log('广告加载成功')
    })

    rewardedVideoAd.onError(err => {
      console.error('广告加载失败', err)
      wx.showToast({
        title: '广告加载失败',
        icon: 'none'
      })
    })

    rewardedVideoAd.onClose((res) => {
      // 用户关闭广告后
      if (res && res.isEnded) {
        // 完整观看，获得奖励
        this.grantAdReward()
      } else {
        wx.showToast({
          title: '请完整观看广告',
          icon: 'none'
        })
      }
    })

    rewardedVideoAd.show().catch(err => {
      console.error('广告展示失败', err)
      wx.showToast({
        title: '广告加载中，请稍后',
        icon: 'none'
      })
    })
  },

  // 发放广告奖励
  async grantAdReward() {
    try {
      // 调用云函数增加下载次数
      const res = await wx.cloud.callFunction({
        name: 'watchAd'
      })

      if (res.result && res.result.success) {
        // 更新本地数据
        app.globalData.downloadCount++
        app.incrementAdCount()
        
        this.setData({
          downloadCount: app.globalData.downloadCount
        })

        wx.showModal({
          title: '恭喜获得下载次数!',
          content: `+1 次下载次数\n今日已观看 ${app.globalData.adWatchedToday}/10 次广告`,
          showCancel: false,
          confirmText: '知道了'
        })
      } else {
        wx.showToast({
          title: '奖励发放失败',
          icon: 'none'
        })
      }
    } catch (err) {
      console.error('奖励发放失败', err)
      // 本地直接加1作为降级方案
      app.globalData.downloadCount++
      app.incrementAdCount()
      
      this.setData({
        downloadCount: app.globalData.downloadCount
      })

      wx.showToast({
        title: '+1 下载次数',
        icon: 'success'
      })
    }
  },

  // 刷新下载次数显示
  refreshDownloadCount() {
    this.setData({
      downloadCount: app.globalData.downloadCount
    })
  }
})
