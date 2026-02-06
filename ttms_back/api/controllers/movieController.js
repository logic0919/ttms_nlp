// 电影控制器（处理请求和响应示例）
const movieService = require('../services/movieService.js')

const movieController = {
    /**
     * 获取电影列表
     */
    getMovieList: async (req, res) => {
        try {
            const result = await movieService.getMovieList()
            res.status(200).json({
                success: true,
                message: '获取电影列表成功',
                data: result
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
    /**
     * 根据标签（tab）搜索电影
     * 接收参数：req.query.tab（应为标签id或标签名）
     */
    searchMoviesByTab: async (req, res) => {
        try {
            const { id } = req.query.tab;
            const result = await movieService.searchMoviesByTab(id);
            res.status(200).json({
                success: true,
                message: '按标签搜索电影成功',
                data: result
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            });
        }
    },
    /**
     * 根据chinese_name字段模糊搜索电影
     */
    searchMoviesByChineseName: async (req, res) => {
        try {
            const { chinese_name } = req.query
            if (!chinese_name) {
                return res.status(400).json({
                    success: false,
                    message: '请输入电影名'
                })
            }
            const result = await movieService.searchMoviesByChineseName(chinese_name)
            res.status(200).json({
                success: true,
                message: '搜索电影成功',
                data: result
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    /**
     * 获取电影详情
     */
    searchMoviesById: async (req, res) => {
        try {
            const  id  = req.query.movie_id
            const movie = await movieService.searchMoviesById(id)
            res.status(200).json({
                success: true,
                message: '获取电影详情成功',
                data: movie
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    /**
     * 创建电影
     */
    createMovie: async (req, res) => {
        try {
            console.log('表单字段:', req.body)  // 其他表单字段
            // 处理文件字段，找到对应的文件
            const findFileByFieldName = (fieldName) => {
                return req.files.find(file => file.fieldname === fieldName)
            }
            // 构建电影数据对象
            const movieData = {
                chinese_name: req.body.chinese_name || '中文名',
                english_name: req.body.english_name || 'eng_name',
                category_ids: req.body.category_ids ? '0,' + req.body.category_ids:'0',
                area: req.body.area||'中国大陆',
                show_time: req.body.show_time == 'NaN-NaN-NaN' ? '2026-01-01' : req.body.show_time,
                duration: req.body.duration||'120',
                directors: req.body.directors||'director_name',
                actors: req.body.actors||'actor_name',
                introduction: req.body.introduction ||'detailIntroduction',

                // 文件字段 - 转换为完整的URL路径（本地开发环境）
                // 如果没有上传图片，使用默认图片
                movie_img: findFileByFieldName('movie_img') ?
                    `http://localhost:8080/${findFileByFieldName('movie_img').path.replace(/\\/g, '/')}` :
                    'http://localhost:8080/uploads/movie/default_movie.jpg',
                director_img: findFileByFieldName('director_img') ?
                    `http://localhost:8080/${findFileByFieldName('director_img').path.replace(/\\/g, '/')}` :
                    'http://localhost:8080/uploads/director/default_director.jpg',
                actor_img: findFileByFieldName('actor_img') ?
                    `http://localhost:8080/${findFileByFieldName('actor_img').path.replace(/\\/g, '/')}` :
                    'http://localhost:8080/uploads/actor/default_actor.jpg'
            }

            console.log('处理后的电影数据:', movieData)

            const result = await movieService.createMovie(movieData)
            console.log(result);
            
            res.status(200).json({
                success: true,
                message: '创建电影成功',
                data: result
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },

    /**
     * 更新电影
     */
    updateMovie: async (req, res) => {
        try {
            const { id } = req.params
            const result = await movieService.updateMovie(id, req.body)
            res.status(200).json({
                success: true,
                message: '更新电影成功',
                data: result
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
    /**
     * 获取正在热映（有场次安排）电影列表
     */
    getHotList: async (req, res) => {
        try {
            const result = await movieService.getHotList()
            res.status(200).json({
                success: true,
                message: '获取电影列表成功',
                data: result
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },

    /**
     * 删除电影
     */
    deleteMovie: async (req, res) => {
        try {
            const { movie_id } = req.query          
            const result = await movieService.deleteMovie(movie_id)
            res.status(200).json({
                success: true,
                message: '删除电影成功',
                data: result
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }
}

module.exports = movieController