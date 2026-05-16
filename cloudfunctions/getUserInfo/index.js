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

  try {
    // 获取用户信息
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    let user = userRes.data[0]

    if (!user) {
      // 创建新用户
      const createRes = await db.collection('users').add({
        data: {
          openid: openid,
          downloadCount: 5, // 新用户初始5次
          totalDownloaded: 0,
          signStreak: 0,
          lastSignDate: null,
          adWatchedToday: 0,
          adLastDate: null,
          createTime: new Date(),
          updateTime: new Date()
        }
      })

      user = {
        _id: createRes._id,
        openid: openid,
        downloadCount: 5,
        totalDownloaded: 0,
        signStreak: 0
      }
    }

    return {
      success: true,
      data: user
    }
  } catch (err) {
    console.error('获取用户信息失败', err)
    return {
      success: false,
      message: '获取用户信息失败',
      error: err
    }
  }
}
