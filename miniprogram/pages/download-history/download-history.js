// pages/download-history/download-history.js
const app = getApp();

Page({
  data: {
    downloadLogs: [],
    isLoading: false,
    isEmpty: false,
    page: 1,
    pageSize: 20,
    hasMore: true
  },

  onLoad: function() {
    this.loadDownloadLogs();
  },

  onShow: function() {
    // 每次显示页面时刷新
    this.setData({ page: 1, downloadLogs: [] });
    this.loadDownloadLogs();
  },

  // 加载下载记录
  loadDownloadLogs: function() {
    if (this.data.isLoading) return;

    this.setData({ isLoading: true });

    wx.cloud.callFunction({
      name: 'getDownloadLogs',
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      success: res => {
        if (res.result && res.result.success) {
          const logs = res.result.data || [];
          this.setData({
            downloadLogs: this.data.page === 1 ? logs : [...this.data.downloadLogs, ...logs],
            isEmpty: logs.length === 0 && this.data.page === 1,
            hasMore: logs.length >= this.data.pageSize
          });
        } else {
          this.setData({ isEmpty: true });
        }
      },
      fail: err => {
        console.error('获取下载记录失败', err);
        // 如果云函数不存在，显示空状态
        this.setData({ isEmpty: true });
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },

  // 加载更多
  loadMore: function() {
    if (!this.data.hasMore || this.data.isLoading) return;

    this.setData({ page: this.data.page + 1 });
    this.loadDownloadLogs();
  },

  // 跳转到资源详情
  goToDetail: function(e) {
    const resourceId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/resource-detail/resource-detail?id=${resourceId}`
    });
  },

  // 格式化日期
  formatDate: function(dateStr) {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
  },

  // 按日期分组
  getGroupedLogs: function() {
    const logs = this.data.downloadLogs;
    const groups = {};
    
    logs.forEach(log => {
      const date = new Date(log.createTime);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateLabel;
      if (date.toDateString() === today.toDateString()) {
        dateLabel = '今天';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = '昨天';
      } else {
        dateLabel = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }
      
      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(log);
    });
    
    return Object.entries(groups).map(([date, items]) => ({
      date,
      items
    }));
  },

  // 滚动到底部加载更多
  onReachBottom: function() {
    this.loadMore();
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.setData({ page: 1, downloadLogs: [] });
    this.loadDownloadLogs();
    wx.stopPullDownRefresh();
  }
});
