// pages/category/category.js - 分类页逻辑
const app = getApp()

Page({
  data: {
    // 搜索关键词
    keyword: '',
    // 分类列表
    categories: [
      { id: 0, name: '全部', active: true },
      { id: 1, name: '办公软件', active: false },
      { id: 2, name: '设计工具', active: false },
      { id: 3, name: '开发工具', active: false },
      { id: 4, name: '影音娱乐', active: false },
      { id: 5, name: '系统工具', active: false },
      { id: 6, name: '实用工具', active: false }
    ],
    // 资源列表
    resources: [],
    // 当前选中分类
    currentCategory: 0,
    // 加载状态
    loading: false,
    // 分页
    page: 1,
    pageSize: 10,
    hasMore: true,
    // 排序
    sortBy: 'downloadCount',
    sortOrder: 'desc'
  },

  onLoad(options) {
    // 获取搜索关键词
    if (options.keyword) {
      this.setData({ keyword: options.keyword })
      this.searchResources()
    } else {
      // 加载全部资源
      this.loadResources()
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, resources: [], hasMore: true })
    this.loadResources()
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreResources()
    }
  },

  // 加载资源
  async loadResources() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'getResources',
        data: {
          category: this.data.currentCategory === 0 ? '' : this.data.categories[this.data.currentCategory].name,
          page: this.data.page,
          pageSize: this.data.pageSize,
          sortBy: this.data.sortBy,
          sortOrder: this.data.sortOrder
        }
      })

      if (res.result && res.result.data) {
        // 格式化下载数量
        const resources = res.result.data.map(item => ({
          ...item,
          downloadCountText: this.formatDownloadCount(item.downloadCount || 0)
        }))
        this.setData({
          resources: resources,
          hasMore: resources.length >= this.data.pageSize,
          loading: false
        })
      } else {
        this.setData({
          resources: this.getMockResources(),
          hasMore: false,
          loading: false
        })
      }
    } catch (err) {
      console.error('加载资源失败', err)
      this.setData({
        resources: this.getMockResources(),
        hasMore: false,
        loading: false
      })
    }
  },

  // 加载更多
  async loadMoreResources() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({ 
      page: this.data.page + 1,
      loading: true 
    })
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'getResources',
        data: {
          category: this.data.currentCategory === 0 ? '' : this.data.categories[this.data.currentCategory].name,
          page: this.data.page,
          pageSize: this.data.pageSize,
          sortBy: this.data.sortBy,
          sortOrder: this.data.sortOrder
        }
      })

      if (res.result && res.result.data) {
        const newResources = res.result.data.map(item => ({
          ...item,
          downloadCountText: this.formatDownloadCount(item.downloadCount || 0)
        }))
        this.setData({
          resources: [...this.data.resources, ...newResources],
          hasMore: newResources.length >= this.data.pageSize,
          loading: false
        })
      } else {
        this.setData({ hasMore: false, loading: false })
      }
    } catch (err) {
      console.error('加载更多失败', err)
      this.setData({ hasMore: false, loading: false })
    }
  },

  // 搜索资源
  async searchResources() {
    if (!this.data.keyword) {
      this.loadResources()
      return
    }

    this.setData({ 
      loading: true,
      page: 1,
      resources: []
    })

    try {
      const res = await wx.cloud.callFunction({
        name: 'searchResources',
        data: { keyword: this.data.keyword }
      })

      if (res.result && res.result.data) {
        const resources = res.result.data.map(item => ({
          ...item,
          downloadCountText: this.formatDownloadCount(item.downloadCount || 0)
        }))
        this.setData({
          resources: resources,
          loading: false
        })
      } else {
        // 模拟搜索
        const mockData = this.getMockResources().filter(item => 
          item.name.includes(this.data.keyword) || 
          item.category.includes(this.data.keyword)
        )
        this.setData({
          resources: mockData,
          loading: false
        })
      }
    } catch (err) {
      console.error('搜索失败', err)
      this.setData({ loading: false })
    }
  },

  // 格式化下载数量显示
  formatDownloadCount(count) {
    if (count > 10000) {
      return (count / 10000).toFixed(1) + '万'
    }
    return count
  },

  // 获取模拟数据
  getMockResources() {
    return [
      { _id: '1', name: 'Adobe Photoshop 2024', category: '设计工具', cover: '/images/ps.png', downloadCount: 12580, downloadCountText: '1.3万', rating: 4.9, size: '2.4 GB', cost: 1 },
      { _id: '2', name: 'Microsoft Office 2021', category: '办公软件', cover: '/images/office.png', downloadCount: 25600, downloadCountText: '2.6万', rating: 4.8, size: '4.1 GB', cost: 1 },
      { _id: '3', name: 'Visual Studio Code', category: '开发工具', cover: '/images/vscode.png', downloadCount: 18900, downloadCountText: '1.9万', rating: 4.9, size: '120 MB', cost: 1 },
      { _id: '4', name: '剪映专业版', category: '影音娱乐', cover: '/images/jianying.png', downloadCount: 9800, downloadCountText: '9800', rating: 4.7, size: '800 MB', cost: 1 },
      { _id: '5', name: 'Adobe Premiere Pro', category: '影音娱乐', cover: '/images/pr.png', downloadCount: 8900, downloadCountText: '8900', rating: 4.8, size: '3.2 GB', cost: 1 },
      { _id: '6', name: 'Figma 桌面版', category: '设计工具', cover: '/images/figma.png', downloadCount: 5600, downloadCountText: '5600', rating: 4.9, size: '200 MB', cost: 1 },
      { _id: '7', name: 'Notion', category: '办公软件', cover: '/images/notion.png', downloadCount: 7800, downloadCountText: '7800', rating: 4.8, size: '150 MB', cost: 1 },
      { _id: '8', name: 'Docker Desktop', category: '开发工具', cover: '/images/docker.png', downloadCount: 4500, downloadCountText: '4500', rating: 4.7, size: '500 MB', cost: 1 },
      { _id: '9', name: '腾讯会议', category: '实用工具', cover: '/images/meeting.png', downloadCount: 15600, downloadCountText: '1.6万', rating: 4.6, size: '180 MB', cost: 1 },
      { _id: '10', name: 'CleanMyMac', category: '系统工具', cover: '/images/clean.png', downloadCount: 6200, downloadCountText: '6200', rating: 4.5, size: '80 MB', cost: 1 }
    ]
  },

  // 切换分类
  switchCategory(e) {
    const { id } = e.currentTarget.dataset
    const categories = this.data.categories.map(item => ({
      ...item,
      active: item.id === id
    }))
    
    this.setData({
      categories,
      currentCategory: id,
      page: 1,
      resources: [],
      hasMore: true
    })
    
    this.loadResources()
  },

  // 切换排序
  switchSort(e) {
    const { sort } = e.currentTarget.dataset
    this.setData({ 
      sortBy: sort,
      page: 1,
      resources: [],
      hasMore: true
    })
    this.loadResources()
  },

  // 跳转到详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/resource-detail/resource-detail?id=${id}`
    })
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value
    this.setData({ keyword })
    if (keyword) {
      this.searchResources()
    } else {
      this.loadResources()
    }
  }
})
