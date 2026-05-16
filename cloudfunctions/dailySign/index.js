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
      // 创建新用户并签到
      await db.collection('users').add({
        data: {
          openid: openid,
          downloadCount: 6, // 新用户 5 + 签到 1
          totalDownloaded: 0,
          signStreak: 1,
          lastSignDate: todayStr,
          adWatchedToday: 0,
          adLastDate: todayStr,
          createTime: new Date(),
          updateTime: new Date()
        }
      })

      return {
        success: true,
        message: '签到成功',
        newStreak: 1,
        reward: 1
      }
    }

    // 检查今天是否已签到
    const lastSignDate = user.lastSignDate ? new Date(user.lastSignDate) : null
    lastSignDate && lastSignDate.setHours(0, 0, 0, 0)

    if (lastSignDate && lastSignDate.getTime() === today.getTime()) {
      return {
        success: false,
        message: '今日已签到'
      }
    }

    // 计算新的连续签到天数
    let newStreak = 1
    if (lastSignDate) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastSignDate.getTime() === yesterday.getTime()) {
        // 昨天已签到，连续
        newStreak = (user.signStreak || 0) + 1
      }
    }

    // 计算奖励
    const reward = calculateReward(newStreak)

    // 更新用户数据
    await db.collection('users').doc(user._id).update({
      data: {
        downloadCount: _.inc(reward),
        signStreak: newStreak,
        lastSignDate: todayStr,
        updateTime: new Date()
      }
    })

    return {
      success: true,
      message: '签到成功',
      newStreak,
      reward
    }
  } catch (err) {
    console.error('签到失败', err)
    return {
      success: false,
      message: '签到失败',
      error: err
    }
  }
}

// 计算签到奖励
function calculateReward(streak) {
  const day = streak % 7 || 7
  if (day >= 7) return 3
  if (day >= 4) return 2
  return 1
}
