// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const { type } = event

  switch (type) {
    case 'home':
      return await getHomeResources(event, context)
    case 'list':
      return await getResourcesList(event, context)
    case 'detail':
      return await getResourceDetail(event, context)
    case 'search':
      return await searchResources(event, context)
    default:
      return { success: false, message: '未知操作类型' }
  }
}

// 获取首页资源
async function getHomeResources(event, context) {
  const db = cloud.database()
  
  try {
    const res = await db.collection('resources')
      .orderBy('downloadCount', 'desc')
      .limit(10)
      .get()
    
    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    console.error('获取首页资源失败', err)
    return {
      success: false,
      message: '获取资源失败',
      error: err
    }
  }
}

// 获取资源列表
async function getResourcesList(event, context) {
  const db = cloud.database()
  const { category, page = 1, pageSize = 10, sortBy = 'downloadCount', sortOrder = 'desc' } = event

  try {
    let query = db.collection('resources')

    // 分类筛选
    if (category) {
      query = query.where({ category })
    }

    // 排序
    query = query.orderBy(sortBy, sortOrder)

    // 分页
    const skip = (page - 1) * pageSize
    query = query.skip(skip).limit(pageSize)

    const res = await query.get()

    return {
      success: true,
      data: res.data,
      page,
      pageSize
    }
  } catch (err) {
    console.error('获取资源列表失败', err)
    return {
      success: false,
      message: '获取资源列表失败',
      error: err
    }
  }
}

// 获取资源详情
async function getResourceDetail(event, context) {
  const db = cloud.database()
  const { id } = event

  try {
    const res = await db.collection('resources').doc(id).get()
    
    if (res.data) {
      // 增加下载量
      await db.collection('resources').doc(id).update({
        data: {
          downloadCount: db.command.inc(1)
        }
      })
    }

    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    console.error('获取资源详情失败', err)
    return {
      success: false,
      message: '获取资源详情失败',
      error: err
    }
  }
}

// 搜索资源
async function searchResources(event, context) {
  const db = cloud.database()
  const { keyword } = event

  try {
    const res = await db.collection('resources')
      .where(
        db.command.or([
          { name: db.RegExp({ regexp: keyword, options: 'i' }) },
          { category: db.RegExp({ regexp: keyword, options: 'i' }) },
          { tags: db.RegExp({ regexp: keyword, options: 'i' }) }
        ])
      )
      .orderBy('downloadCount', 'desc')
      .limit(20)
      .get()

    return {
      success: true,
      data: res.data
    }
  } catch (err) {
    console.error('搜索资源失败', err)
    return {
      success: false,
      message: '搜索资源失败',
      error: err
    }
  }
}
