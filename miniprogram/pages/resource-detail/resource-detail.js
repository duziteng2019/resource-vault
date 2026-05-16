// pages/resource-detail/resource-detail.js - 资源详情页
const app = getApp()

Page({
  data: {
    resourceId: '',
    resource: null,
    loading: true,
    downloading: false,
    downloadProgress: 0,
    // 用户下载次数
    downloadCount: 0,
    // 今日广告次数
    adWatchedToday: 0,
    // 激励视频广告实例
    rewardedVideoAd: null,
    // 是否显示余额不足弹窗
    showBalanceModal: false
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.setData({ resourceId: id })
      this.loadResourceDetail(id)
    }
    
    // 初始化激励视频广告
    this.initRewardedVideoAd()
  },

  onShow() {
    // 更新下载次数
    this.setData({
      downloadCount: app.globalData.downloadCount,
      adWatchedToday: app.globalData.adWatchedToday
    })
  },

  onUnload() {
    // 销毁广告实例
    if (this.data.rewardedVideoAd) {
      this.data.rewardedVideoAd.destroy()
    }
  },

  // 初始化激励视频广告
  initRewardedVideoAd() {
    const rewardedVideoAd = wx.createRewardedVideoAd({
      adUnitId: 'YOUR_REWARDED_VIDEO_AD_UNIT_ID' // 替换为实际的广告单元ID
    })

    rewardedVideoAd.onLoad(() => {
      console.log('激励视频广告加载成功')
    })

    rewardedVideoAd.onError(err => {
      console.error('激励视频广告加载失败', err)
    })

    rewardedVideoAd.onClose((res) => {
      if (res && res.isEnded) {
        // 完整观看广告，获得下载次数
        this.grantAdReward()
      } else {
        wx.showToast({
          title: '请完整观看广告',
          icon: 'none'
        })
      }
    })

    this.setData({ rewardedVideoAd })
  },

  // 加载资源详情
  async loadResourceDetail(id) {
    this.setData({ loading: true })
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'getResource',
        data: { id }
      })

      if (res.result && res.result.data) {
        const resource = res.result.data
        resource.downloadCountText = this.formatDownloadCount(resource.downloadCount || 0)
        this.setData({
          resource: resource,
          loading: false
        })
      } else {
        // 使用模拟数据
        this.setData({
          resource: this.getMockResource(id),
          loading: false
        })
      }
    } catch (err) {
      console.error('加载资源详情失败', err)
      this.setData({
        resource: this.getMockResource(id),
        loading: false
      })
    }
  },

  // 格式化下载数量
  formatDownloadCount(count) {
    if (count > 10000) {
      return (count / 10000).toFixed(1) + '万'
    }
    return count
  },

  // 获取模拟资源数据
  getMockResource(id) {
    const mockData = {
      '1': {
        _id: '1',
        name: 'Adobe Photoshop 2024',
        category: '设计工具',
        cover: '/images/ps.png',
        downloadCount: 12580,
        downloadCountText: '1.3万',
        rating: 4.9,
        size: '2.4 GB',
        cost: 1,
        description: 'Adobe Photoshop 2024 是全球最专业的图像编辑软件，集成 AI 神经网络功能，支持一键抠图、智能填充等高级特性。',
        tags: ['图像处理', 'AI智能', '设计师必备'],
        version: '25.0',
        language: '简体中文',
        system: 'Windows 10/11'
      },
      '2': {
        _id: '2',
        name: 'Microsoft Office 2021',
        category: '办公软件',
        cover: '/images/office.png',
        downloadCount: 25600,
        downloadCountText: '2.6万',
        rating: 4.8,
        size: '4.1 GB',
        cost: 1,
        description: 'Microsoft Office 2021 包括 Word、Excel、PowerPoint、Outlook 等办公套件，全面升级的界面和功能。',
        tags: ['办公必备', '高效协作', '正版授权'],
        version: '2021',
        language: '简体中文',
        system: 'Windows 10/11, macOS'
      },
      '3': {
        _id: '3',
        name: 'Visual Studio Code',
        category: '开发工具',
        cover: '/images/vscode.png',
        downloadCount: 18900,
        downloadCountText: '1.9万',
        rating: 4.9,
        size: '120 MB',
        cost: 1,
        description: 'Visual Studio Code 是微软推出的免费开源代码编辑器，支持语法高亮、智能提示、Git 集成等丰富功能。',
        tags: ['代码编辑', '跨平台', '开源免费'],
        version: '1.85',
        language: '简体中文',
        system: 'Windows/macOS/Linux'
      }
    }
    return mockData[id] || mockData['1']
  },

  // 立即下载
  handleDownload() {
    const { downloadCount } = this.data
    
    if (downloadCount <= 0) {
      // 余额不足，显示弹窗
      this.setData({ showBalanceModal: true })
      return
    }

    // 确认下载
    wx.showModal({
      title: '确认下载',
      content: `确定要下载「${this.data.resource.name}」吗？将消耗 1 次下载次数。`,
      confirmText: '确认下载',
      success: (res) => {
        if (res.confirm) {
          this.executeDownload()
        }
      }
    })
  },

  // 执行下载
  async executeDownload() {
    const { resource, downloadCount } = this.data
    
    try {
      // 扣减下载次数
      const result = await wx.cloud.callFunction({
        name: 'downloadResource',
        data: { resourceId: resource._id }
      })

      if (result.result && result.result.success) {
        // 更新本地数据
        app.globalData.downloadCount--
        this.setData({ downloadCount: app.globalData.downloadCount })

        // 显示下载成功
        wx.showModal({
          title: '下载成功',
          content: `「${resource.name}」已开始下载，请前往系统下载管理器查看。`,
          showCancel: false,
          confirmText: '知道了'
        })
      } else {
        throw new Error('下载失败')
      }
    } catch (err) {
      console.error('下载失败', err)
      // 降级处理：本地直接扣减
      app.globalData.downloadCount--
      this.setData({ downloadCount: app.globalData.downloadCount })

      wx.showModal({
        title: '下载成功',
        content: `「${resource.name}」已开始下载，请前往系统下载管理器查看。`,
        showCancel: false
      })
    }
  },

  // 看广告获取下载次数
  handleWatchAd() {
    const { adWatchedToday } = this.data
    
    // 检查是否已达上限
    if (adWatchedToday >= 10) {
      wx.showModal({
        title: '提示',
        content: '今日广告次数已用完（10/10），明天再来吧~',
        showCancel: false
      })
      return
    }

    // 显示激励视频广告
    const { rewardedVideoAd } = this.data
    if (rewardedVideoAd) {
      rewardedVideoAd.show().catch(err => {
        console.error('广告展示失败', err)
        wx.showToast({
          title: '广告加载中，请稍后',
          icon: 'none'
        })
      })
    }
  },

  // 发放广告奖励
  async grantAdReward() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'watchAd'
      })

      if (res.result && res.result.success) {
        // 更新本地数据
        app.globalData.downloadCount++
        app.incrementAdCount()
        
        this.setData({
          downloadCount: app.globalData.downloadCount,
          adWatchedToday: app.globalData.adWatchedToday,
          showBalanceModal: false
        })

        wx.showModal({
          title: '恭喜获得下载次数!',
          content: '+1 次下载次数\n今日已观看 ' + this.data.adWatchedToday + '/10 次广告',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    } catch (err) {
      console.error('奖励发放失败', err)
      // 本地降级处理
      app.globalData.downloadCount++
      app.incrementAdCount()
      
      this.setData({
        downloadCount: app.globalData.downloadCount,
        adWatchedToday: app.globalData.adWatchedToday,
        showBalanceModal: false
      })

      wx.showToast({
        title: '+1 下载次数',
        icon: 'success'
      })
    }
  },

  // 关闭余额不足弹窗
  closeBalanceModal() {
    this.setData({ showBalanceModal: false })
  },

  // 分享
  onShareAppMessage() {
    const { resource } = this.data
    return {
      title: resource ? `推荐下载：${resource.name}` : '资源宝库 - 免费下载各类软件',
      path: '/pages/index/index'
    }
  }
})
