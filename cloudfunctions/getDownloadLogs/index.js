// cloudfunctions/getDownloadLogs/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 获取下载记录
exports.main = async (event, context) => {
  const { page = 1, pageSize = 20 } = event;
  const openid = cloud.getWXContext().OPENID;

  try {
    // 获取用户信息
    const userResult = await db.collection('users').where({
      openid: openid
    }).get();

    if (!userResult.data || userResult.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const userId = userResult.data[0]._id;

    // 获取下载记录
    const skip = (page - 1) * pageSize;
    const logsResult = await db.collection('download_logs')
      .where({
        userId: userId
      })
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    // 获取资源详情
    const logs = logsResult.data;
    if (logs.length > 0) {
      const resourceIds = logs.map(log => log.resourceId);
      
      const resourcesResult = await db.collection('resources')
        .where({
          _id: db.command.in(resourceIds)
        })
        .field({
          _id: true,
          title: true,
          coverImage: true,
          category: true,
          fileSize: true
        })
        .get();

      const resourceMap = {};
      resourcesResult.data.forEach(r => {
        resourceMap[r._id] = r;
      });

      // 合并数据
      logs.forEach(log => {
        const resource = resourceMap[log.resourceId];
        if (resource) {
          log.title = resource.title;
          log.coverImage = resource.coverImage;
          log.category = resource.category;
          log.fileSize = resource.fileSize;
        }
      });
    }

    return {
      success: true,
      data: logs,
      page,
      pageSize
    };
  } catch (err) {
    console.error('获取下载记录失败', err);
    return {
      success: false,
      message: '获取下载记录失败'
    };
  }
};
