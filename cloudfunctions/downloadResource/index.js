// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { resourceId } = event

  const db = cloud.database()
  const _ = db.command

  try {
    // 查询用户
    const userRes = await db.collection('users').where({
      openid: openid
    }).get()

    const user = userRes.data[0]

    if (!user) {
      return {
        success: false,
        message: '用户不存在'
      }
    }

    // 检查下载次数
    if (user.downloadCount <= 0) {
      return {
        success: false,
        message: '下载次数不足'
      }
    }

    // 获取资源信息
    const resourceRes = await db.collection('resources').doc(resourceId).get()

    if (!resourceRes.data) {
      return {
        success: false,
        message: '资源不存在'
      }
    }

    const resource = resourceRes.data

    // 获取云存储临时链接
    let downloadUrl = resource.downloadUrl
    if (resource.cloudPath) {
      try {
        const urlRes = await cloud.getTempFileURL({
          fileList: [resource.cloudPath]
        })
        if (urlRes.fileList && urlRes.fileList[0]) {
          downloadUrl = urlRes.fileList[0].tempFileURL
        }
      } catch (err) {
        console.error('获取下载链接失败', err)
      }
    }

    // 扣减下载次数
    await db.collection('users').doc(user._id).update({
      data: {
        downloadCount: _.inc(-1),
        totalDownloaded: _.inc(1),
        updateTime: new Date()
      }
    })

    // 记录下载日志
    await db.collection('download_logs').add({
      data: {
        openid: openid,
        resourceId: resourceId,
        resourceName: resource.name,
        createTime: new Date()
      }
    })

    // 增加资源下载量
    await db.collection('resources').doc(resourceId).update({
      data: {
        downloadCount: _.inc(1)
      }
    })

    return {
      success: true,
      message: '下载成功',
      downloadUrl: downloadUrl || resource.downloadUrl
    }
  } catch (err) {
    console.error('下载失败', err)
    return {
      success: false,
      message: '下载失败',
      error: err
    }
  }
}
