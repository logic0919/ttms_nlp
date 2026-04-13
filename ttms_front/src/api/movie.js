import request from '@/utils/request'
// 获得热映电影
const movieGetHotService = (obj) => {
  console.log('获取热映电影')
  return request.post('/api/v1/hot-movies', {
    // 默认全部，第一页，三十个
    page_size: obj.page ? obj.page : 30,
    page_num: obj.num ? obj.num : 1,
    category_id: obj.id ? [obj.id] : [0]
  })
}
// 获得即将上映电影
const movieGetUnreleasedService = (obj) => {
  return request.post('/api/v1/unreleased-movies', {
    page_size: obj.page ? obj.page : 30,
    page_num: obj.num ? obj.num : 1,
    category_id: obj.id ? [obj.id] : [0]
  })
}
// 获得全部电影
const movieGetAllService = (obj) => {
  return request.post('/api/v1/all-movies', {
    // 默认全部，第一页，十个
    page_size: obj.page ? obj.page : 30,
    page_num: obj.num ? obj.num : 1,
    category_id: obj.id ? [obj.id] : [0]
  })
}
// 首页热映电影
const movieIndexHotService = () => {
  return request.get('/api/v1/index_hot_movies')
}
// 票房榜
const movieIndexBoxService = () => {
  return request.get('/api/v1/sales')
}
// 获得某个电影的信息
const movieGetInfoService = (id) => {
  return request.post('/api/v1/get-movie', {
    movie_id: id
  })
}
// 也用于获得指定影院的热映电影
const movieGetHottheaterService = (id) => {
  console.log('获得指定影院的上映影片信息')
  return request.get('/api/v1/admin/movie/getHot', {
    params: {
      theater_id: id
    }
  })
}
// 获得轮播图
// 轮播图不传参
const movieGetCarouselsService = () => {
  return request.get('/api/v1/carousels')
}
// 搜索电影
const movieSearchService = (info) => {
  return request.post('/api/v1/movies', { introduction: info })
}
// 删除影片
const movieDelService = (id) => {
  return request.delete('/api/v1/admin/del-movie', {
    params: {
      movie_id: id
    }
  })
}
// 新增电影
const movieAddService = (obj) => {
  console.log({
    chinese_name: obj.chinese_name,
    english_name: obj.english_name,
    category_ids: obj.category_id,
    area: obj.area,
    show_time: obj.show_time,
    duration: obj.duration,
    directors: obj.directors,
    actors: obj.actors,
    introduction: obj.introduction,
    movie_img: obj.movie_img,
    director_img: obj.director_img,
    actor_img: obj.actor_img
  })
  return request.post(
    '/api/v1/admin/add-movie',
    {
      chinese_name: obj.chinese_name,
      english_name: obj.english_name,
      category_ids: obj.category_id,
      area: obj.area,
      show_time: obj.show_time,
      duration: obj.duration,
      directors: obj.directors,
      actors: obj.actors,
      introduction: obj.introduction,
      movie_img: obj.movie_img,
      director_img: obj.director_img,
      actor_img: obj.actor_img
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

export {
  movieGetHotService,
  movieGetUnreleasedService,
  movieGetAllService,
  movieGetCarouselsService,
  movieAddService,
  movieGetHottheaterService,
  movieSearchService,
  movieDelService,
  movieGetInfoService,
  movieIndexBoxService,
  movieIndexHotService
}
