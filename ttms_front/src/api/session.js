import request from '@/utils/request'

// 根据 session_id 获取单个场次详情（query: id）
// 返回 { data: { session_id, movie_id, hall_id, stime, etime, price } }
const sessionGetOneService = (id) =>
  request.get('/api/session/seabyid', { params: { id } })

// 根据电影ID和日期获取场次列表
// 返回 { data: [ { session_id, movie_id, hall_id, stime, etime, price, chinese_name, name(hall), ... } ] }
const sessionGetListService = (theater_id, movie_id, date) => {
  const dateStr = typeof date === 'string' ? date.trim() : date
  return request.get('/api/session/seabymovieanddate', {
    params: { movie_id, date: dateStr }
  })
}

// 获取所有场次，返回 { data: { sessions: [ ... ] } }
const sessionGetAllService = () => request.get('/api/session/list')

// 新增场次，body: { movie_id, hall_id, stime, etime, price }
// stime/etime 格式：'YYYY-MM-DD HH:mm:ss'
const sessionAddService = (obj) =>
  request.post('/api/session/create', {
    movie_id: obj.movie_id,
    hall_id: obj.hall_id,
    stime: obj.stime,
    etime: obj.etime,
    price: obj.price
  })

// 删除场次，query 参数 session_id
const sessionDelService = (id) =>
  request.delete('/api/session/del', { params: { session_id: id } })

// 修改场次，body: { session_id, movie_id, hall_id, stime, etime, price }
const sessionAlertService = (obj) =>
  request.post('/api/session/update', {
    session_id: obj.session_id,
    movie_id: obj.movie_id,
    hall_id: obj.hall_id,
    stime: obj.stime,
    etime: obj.etime,
    price: obj.price
  })

// 根据 session_id 获取已锁定座位（status=1 且未过期）
// 返回 { data: [[row, col], [row, col], ...] }
const sessionGetLockedSeatService = (session_id) =>
  request.get('/api/session/getlockedseatbysessionid', { params: { session_id } })

export {
  sessionGetOneService,
  sessionGetListService,
  sessionGetAllService,
  sessionAddService,
  sessionDelService,
  sessionAlertService,
  sessionGetLockedSeatService
}