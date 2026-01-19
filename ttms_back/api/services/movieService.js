// 电影服务层（业务逻辑示例）
const movieModel = require('../models/movieModel.js')

const movieService = {
    /**
     * 获取所有电影列表
     */
    getMovieList: async () => {
        const movies = await movieModel.findAll()
        return {
            movies,
            total: movies.length
        }
    },

    /**
     * 获取电影详情
     */
    getMovieDetail: async (id) => {
        const movies = await movieModel.findById(id)
        if (movies.length === 0) {
            throw new Error('电影不存在')
        }
        return movies[0]
    },

    /**
     * 创建电影
     */
    createMovie: async (movieData) => {
        // 这里可以添加业务逻辑验证
        if (!movieData.name) {
            throw new Error('电影名称不能为空')
        }

        const result = await movieModel.create(movieData)
        if (result.affectedRows !== 1) {
            throw new Error('创建电影失败')
        }

        return {
            message: '创建电影成功',
            id: result.insertId
        }
    },

    /**
     * 更新电影信息
     */
    updateMovie: async (id, movieData) => {
        // 检查电影是否存在
        const movies = await movieModel.findById(id)
        if (movies.length === 0) {
            throw new Error('电影不存在')
        }

        const result = await movieModel.update(id, movieData)
        if (result.affectedRows !== 1) {
            throw new Error('更新电影失败')
        }

        return { message: '更新电影成功' }
    },

    /**
     * 删除电影
     */
    deleteMovie: async (id) => {
        // 检查电影是否存在
        const movies = await movieModel.findById(id)
        if (movies.length === 0) {
            throw new Error('电影不存在')
        }

        const result = await movieModel.delete(id)
        if (result.affectedRows !== 1) {
            throw new Error('删除电影失败')
        }

        return { message: '删除电影成功' }
    }
}

module.exports = movieService