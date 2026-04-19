import request from '@/utils/request'

const movieGetAllService = () => request.get('/api/movie/list')
const movieGetHotService = () => request.get('/api/movie/hot')
const movieGetByTabService = (tab) =>
  request.get('/api/movie/seabytab', { params: { tab } })

const movieGetInfoService = (id) =>
  request.get('/api/movie/seabyid', { params: { movie_id: id } })

const movieGetHottheaterService = () => request.get('/api/movie/hot')

const movieSearchService = (name) =>
  request.get('/api/movie/seabyname', { params: { chinese_name: name } })

const movieDelService = (id) =>
  request.delete('/api/movie/delmovie', { params: { movie_id: id } })

// 新增电影：接受 FormData（直接透传）或普通对象（自动构建 FormData）
const movieAddService = (obj) => {
  if (obj instanceof FormData) {
    return request.post('/api/movie/create', obj, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
  const formData = new FormData()
  formData.append('chinese_name', obj.chinese_name || '')
  formData.append('english_name', obj.english_name || '')
  formData.append('category_ids', obj.category_ids || '')
  formData.append('area', obj.area || '')
  formData.append('show_time', obj.show_time || '')
  formData.append('duration', obj.duration || '')
  formData.append('directors', obj.directors || '')
  formData.append('actors', obj.actors || '')
  formData.append('introduction', obj.introduction || '')
  if (obj.movie_img) formData.append('movie_img', obj.movie_img)
  if (obj.director_img) formData.append('director_img', obj.director_img)
  if (obj.actor_img) formData.append('actor_img', obj.actor_img)
  return request.post('/api/movie/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

const movieGetCarouselsService = () =>
  Promise.resolve({ data: { success: true, data: [] } })

export {
  movieGetHotService,
  movieGetAllService,
  movieGetCarouselsService,
  movieAddService,
  movieGetHottheaterService,
  movieSearchService,
  movieDelService,
  movieGetInfoService,
  movieGetByTabService
}
