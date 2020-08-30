const db = wx.cloud.database();

// 添加数据
async function addData(params, data = {}) {
  return await db.collection(params).add({
    data
  })
}

// 通过id具体某一条数据
async function inquire(params, id) {
  return await db.collection(params).doc(id).get();
}

// 获取分类传递参数 获取指定  不传参数获取所有
// async function getAll(params, _where = {}) {
//   return await db.collection(params).where(_where).get()
// }

//查询所有数据
async function getAll(_collection, _where={},_skip=0,_limit=20){
  return await db.collection(_collection).skip(_skip).limit(_limit).where(_where).get()
}


//  通过id删除
async function delData(params, id) {
  return await db.collection(params).doc(id).remove()
}


// 通过id 修改
async function upDate(params,id, data) {
  return await db.collection(params).doc(id).update({
    data
  })
}





// 翻页功能
/**
 * 
 * @param {*} page 当前第几页
 * @param {*} pageSize 一页几条数据
 * @param {*} store 数据库名字
 */
async function getList(page, pageSize, store) {
  return await db.collection(store).skip(page * pageSize).limit(pageSize).get()
}


export {
  addData,
  inquire,
  getAll,
  delData,
  upDate,
  getList
}