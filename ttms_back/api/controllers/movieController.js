// 电影控制器（处理请求和响应示例）
const movieService = require('../services/movieService.js')
const { cc } = require('../utils/response.js')

const movieController = {
    /**
     * 获取电影列表
     */
    getMovieList: async (req, res) => {
        try {
            const result = await movieService.getMovieList()
            res.send(cc(result, 0))
        } catch (error) {
            res.send(cc(error.message))
        }
    },

    /**
     * 获取电影详情
     */
    getMovieDetail: async (req, res) => {
        try {
            const { id } = req.params
            const movie = await movieService.getMovieDetail(id)
            res.send(cc(movie, 0))
        } catch (error) {
            res.send(cc(error.message))
        }
    },

    /**
     * 创建电影
     */
    createMovie: async (req, res) => {
        try {
            const result = await movieService.createMovie(req.body)
            res.send(cc(result.message, 0))
        } catch (error) {
            res.send(cc(error.message))
        }
    },

    /**
     * 更新电影
     */
    updateMovie: async (req, res) => {
        try {
            const { id } = req.params
            const result = await movieService.updateMovie(id, req.body)
            res.send(cc(result.message, 0))
        } catch (error) {
            res.send(cc(error.message))
        }
    },

    /**
     * 删除电影
     */
    deleteMovie: async (req, res) => {
        try {
            const { id } = req.params
            const result = await movieService.deleteMovie(id)
            res.send(cc(result.message, 0))
        } catch (error) {
            res.send(cc(error.message))
        }
    }
}

module.exports = movieController