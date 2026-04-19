import request from '@/utils/request'

// 新增影厅，body: { name, rnum, cnum, seat }
// seat 是二维数组，JSON.stringify 后传给后端
const hallAddService = (obj) =>
  request.post('/api/hall/create', {
    name: obj.name,
    rows: obj.rows,
    cols: obj.cols,
    array: obj.array
  })
// 根据hall_id搜索影厅信息
const hallSearchByIdService = (id) =>
  request.get('/api/hall/seabyid', { params: { hall_id: id } })

// 获取所有影厅，返回 { data: { halls: [ { hall_id, name, rnum, cnum, seat } ] } }
const hallGetListService = () => request.get('/api/hall/list')

// 根据 hall_id 获取单个影厅，返回 { data: { hall_id, name, rnum, cnum, seat } }
const hallGetService = (id) =>
  request.get('/api/hall/seabyid', { params: { hall_id: id } })

// 修改影厅，body: { hall_id, name, rnum, cnum, seat }
const hallChangeService = (obj) =>
  request.post('/api/hall/update', {
    hall_id: obj.hall_id,
    name: obj.name,
    rnum: obj.rnum,
    cnum: obj.cnum,
    seat: obj.seat
  })

// 删除影厅，query 参数 id
const hallDelService = (id) =>
  request.delete('/api/hall/del', { params: { id } })

export {
  hallAddService,
  hallGetListService,
  hallGetService,
  hallChangeService,
  hallDelService,
  hallSearchByIdService
}
