import request from '@/utils/request'
// 获得某场次信息
const sessionGetOneService = (id) => {
  return request.get('/api/v1/admin/session', {
    params: {
      id
    }
  })
}
// 获得某影院场次列表
const sessionGetListService = (theater_id, movie_id, date) => {
  return request.get('/api/v1/admin/sessions', {
    params: {
      theater_id: theater_id,
      movie_id: movie_id,
      date: date.slice(0, date.length - 1)
    }
  })
}
// 新建场次
const sessionAddService = (obj) => {
  return request.post('/api/v1/admin/add-session', {
    theater_id: obj.theater_id,
    movie_id: obj.movie_id,
    hall_id: obj.hall_id,
    show_time: obj.show_time,
    price: obj.price
  })
}
// 删除某场次
const sessionDelService = (id) => {
  return request.delete('/api/v1/admin/delete-session', {
    params: { session_id: id }
  })
}
// 修改场次信息
const sessionAlertService = (obj) => {
  return request.put('/api/v1/admin/alter-session', {
    session_id: obj.session_id,
    theater_id: obj.theater_id,
    movie_id: obj.movie_id,
    address_id: obj.hall_id,
    show_time: obj.show_time,
    price: obj.price
  })
}
export {
  sessionGetOneService,
  sessionGetListService,
  sessionAddService,
  sessionDelService,
  sessionAlertService
}
