import request from '@/utils/request'
// 添加剧院
const theaterAddService = (obj) => {
  return request.post('/api/v1/admin/createTheater', {
    name: obj.name,
    address: obj.place
  })
}
export { theaterAddService }
