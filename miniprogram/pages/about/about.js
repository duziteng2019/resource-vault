// pages/about/about.js
const app = getApp();

Page({
  data: {
    appInfo: {
      name: '资源宝库',
      version: '1.0.0',
      description: '专注优质资源分享，助力工作学习',
      features: [
        { icon: 'download', title: '海量资源', desc: '涵盖各行业精品资源' },
        { icon: 'security', title: '安全可靠', desc: '资源经过严格审核' },
        { icon: 'free', title: '免费使用', desc: '每日赠送下载次数' },
        { icon: 'update', title: '持续更新', desc: '资源库不断扩充' }
      ]
    },
    contactInfo: [
      { label: '商务合作', value: 'business@example.com' },
      { label: '意见反馈', value: 'feedback@example.com' },
      { label: '客服微信', value: 'resourcehelper' }
    ]
  },

  onLoad: function() {
    // 获取小程序版本信息
    const accountInfo = wx.getAccountInfoSync();
    this.setData({
      'appInfo.version': accountInfo.miniProgram.version || '1.0.0'
    });
  },

  // 复制文本
  copyText: function(e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 查看用户协议
  viewAgreement: function() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/agreement'
    });
  },

  // 查看隐私政策
  viewPrivacy: function() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://example.com/privacy'
    });
  },

  // 检查更新
  checkUpdate: function() {
    wx.showLoading({ title: '检查中...', mask: true });

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function(res) {
      wx.hideLoading();
      if (res.hasUpdate) {
        wx.showModal({
          title: '发现新版本',
          content: '有新版本可用，是否立即更新？',
          success: res => {
            if (res.confirm) {
              // 下载更新
              wx.showLoading({ title: '下载中...', mask: true });
              updateManager.onUpdateReady(function() {
                wx.hideLoading();
                wx.showModal({
                  title: '更新提示',
                  content: '新版本已准备好，是否重启应用？',
                  success: res => {
                    if (res.confirm) {
                      updateManager.applyUpdate();
                    }
                  }
                });
              });

              updateManager.onUpdateFailed(function() {
                wx.hideLoading();
                wx.showModal({
                  title: '更新失败',
                  content: '新版本下载失败，请检查网络后重试',
                  showCancel: false
                });
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: '已是最新版本',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },

  // 分享小程序
  onShareAppMessage: function() {
    return {
      title: '资源宝库 - 海量优质资源免费用',
      path: '/pages/index/index',
      imageUrl: '/images/share-icon.png'
    };
  }
});
