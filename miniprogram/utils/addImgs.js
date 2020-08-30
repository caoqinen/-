async function bindUpload (params) {
  let arr = [];
  params.forEach(item => {
    let nowTime = new Date().getTime();//用于拼接路径
    let extName = item.url.split(".").pop();//获取到后缀名
    let promise = wx.cloud.uploadFile({
      cloudPath: `menuImg/${nowTime}.${extName}`,
      filePath: item.url
    })

    arr.push(promise);
  })

  return await Promise.all(arr)
}

export {
  bindUpload
}