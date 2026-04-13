import request from '@/utils/request'
// 添加演出厅
const hallAddService = (obj) => {
  return request.post('/api/v1/admin/hall/create', obj)
}
// 查找某个影院的影厅列表
const hallGetListService = (id) => {
  console.log(id)
  return request.get('/api/v1/admin/halls', {
    params: {
      theater_id: id
    }
  })
}
// 查找某个演出厅的信息
const hallGetService = (id) => {
  return request.get(`/api/v1/admin/hall?id=${id}`)
}
// 修改某个影厅的信息
const hallChangeService = (obj) => {
  return request.put('/api/v1/admin/hall/update', obj)
}
// 删除影厅
const hallDelService = (id) => {
  return request.delete('/api/v1/admin/hall/delete', {
    params: {
      id
    }
  })
}
export {
  hallAddService,
  hallGetListService,
  hallGetService,
  hallChangeService,
  hallDelService
}
