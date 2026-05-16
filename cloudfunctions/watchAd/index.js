// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const db = cloud.database()
  const _ = db.command

  try {
    // 获取今日日期
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    // 查询用户
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    let user = userRes.data[0]

    if (!user) {
      // 创建新用户
      const createRes = await db.collection('users').add({
        data: {
          openid: openid,
          downloadCount: 6, // 新用户 5 + 广告奖励 1
          totalDownloaded: 0,
          signStreak: 0,
          lastSignDate: null,
          adWatchedToday: 1,
          adLastDate: todayStr,
          createTime: new Date(),
          updateTime: new Date()
        }
      })

      // 记录广告观看日志
      await db.collection('ad_logs').add({
        data: {
          openid: openid,
          action: 'watch_ad',
          reward: 1,
          createTime: new Date()
        }
      })

      return {
        success: true,
        message: '获得下载次数',
        reward: 1
      }
    }

    // 检查今日广告次数
    const adLastDate = user.adLastDate ? new Date(user.adLastDate) : null
    adLastDate && adLastDate.setHours(0, 0, 0, 0)

    let adWatchedToday = user.adWatchedToday || 0

    // 新的一天，重置计数
    if (!adLastDate || adLastDate.getTime() < today.getTime()) {
      adWatchedToday = 0
    }

    // 检查是否超过每日上限
    if (adWatchedToday >= 10) {
      return {
        success: false,
        message: '今日广告次数已用完'
      }
    }

    // 增加下载次数和广告计数
    await db.collection('users').doc(user._id).update({
      data: {
        downloadCount: _.inc(1),
        adWatchedToday: adWatchedToday + 1,
        adLastDate: todayStr,
        updateTime: new Date()
      }
    })

    // 记录广告观看日志
    await db.collection('ad_logs').add({
      data: {
        openid: openid,
        action: 'watch_ad',
        reward: 1,
        createTime: new Date()
      }
    })

    return {
      success: true,
      message: '获得下载次数',
      reward: 1,
      adWatchedToday: adWatchedToday + 1
    }
  } catch (err) {
    console.error('广告奖励发放失败', err)
    return {
      success: false,
      message: '奖励发放失败',
      error: err
    }
  }
}
