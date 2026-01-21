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
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    /**
     * 获取电影详情
     */
    getMovieDetail: async (req, res) => {
        try {
            const { id } = req.params
            const movie = await movieService.getMovieDetail(id)
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
            const result = await movieService.createMovie(req.body)
            res.status(201).json({
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
     * 删除电影
     */
    deleteMovie: async (req, res) => {
        try {
            const { id } = req.params
            const result = await movieService.deleteMovie(id)
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