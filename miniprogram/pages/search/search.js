// pages/search/search.js
const app = getApp();

Page({
  data: {
    searchKeyword: '',
    searchResults: [],
    isLoading: false,
    isEmpty: false,
    page: 1,
    pageSize: 10,
    hasMore: true,
    hotKeywords: ['PPT模板', '简历模板', '合同范本', '工作总结', '学习资料'],
    historyKeywords: []
  },

  onLoad: function(options) {
    // 从历史记录中获取搜索关键词
    const historyKeywords = wx.getStorageSync('searchHistory') || [];
    this.setData({ historyKeywords });

    // 如果有传入关键词，自动搜索
    if (options.keyword) {
      this.setData({ searchKeyword: options.keyword });
      this.doSearch(options.keyword);
    }
  },

  // 监听搜索输入
  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  // 点击搜索按钮
  onSearchConfirm: function(e) {
    const keyword = e.detail.value || this.data.searchKeyword;
    if (keyword.trim()) {
      this.doSearch(keyword.trim());
    }
  },

  // 点击热门关键词
  onHotKeywordTap: function(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.doSearch(keyword);
  },

  // 执行搜索
  doSearch: function(keyword) {
    if (!keyword) return;

    this.setData({
      isLoading: true,
      searchResults: [],
      page: 1,
      hasMore: true
    });

    // 保存搜索历史
    this.saveSearchHistory(keyword);

    // 调用云函数搜索
    wx.cloud.callFunction({
      name: 'getResources',
      data: {
        action: 'search',
        keyword: keyword,
        page: 1,
        pageSize: this.data.pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const results = res.result.data || [];
          this.setData({
            searchResults: results,
            isEmpty: results.length === 0,
            hasMore: results.length >= this.data.pageSize
          });
        } else {
          this.setData({ isEmpty: true });
        }
      },
      fail: err => {
        console.error('搜索失败', err);
        wx.showToast({ title: '搜索失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  // 保存搜索历史
  saveSearchHistory: function(keyword) {
    let history = wx.getStorageSync('searchHistory') || [];
    // 去重
    history = history.filter(item => item !== keyword);
    // 添加到开头
    history.unshift(keyword);
    // 最多保留10条
    history = history.slice(0, 10);
    wx.setStorageSync('searchHistory', history);
    this.setData({ historyKeywords: history });
  },

  // 清除搜索历史
  clearHistory: function() {
    wx.showModal({
      title: '提示',
      content: '确定清除搜索历史？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          this.setData({ historyKeywords: [] });
        }
      }
    });
  },

  // 加载更多
  loadMore: function() {
    if (this.data.isLoading || !this.data.hasMore) return;

    const nextPage = this.data.page + 1;
    this.setData({ isLoading: true });

    wx.cloud.callFunction({
      name: 'getResources',
      data: {
        action: 'search',
        keyword: this.data.searchKeyword,
        page: nextPage,
        pageSize: this.data.pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const newResults = res.result.data || [];
          this.setData({
            searchResults: [...this.data.searchResults, ...newResults],
            page: nextPage,
            hasMore: newResults.length >= this.data.pageSize
          });
        }
      },
      fail: err => {
        console.error('加载更多失败', err);
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  // 跳转到资源详情
  goToDetail: function(e) {
    const resourceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/resource-detail/resource-detail?id=${resourceId}`
    });
  },

  // 滚动到底部加载更多
  onReachBottom: function() {
    this.loadMore();
  },

  // 点击清空输入
  clearInput: function() {
    this.setData({
      searchKeyword: '',
      searchResults: [],
      isEmpty: false
    });
  }
});
