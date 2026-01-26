// 电影相关路由（示例）
const express = require('express')
const router = express.Router()
const movieController = require('../controllers/movieController.js')
const { verifyToken } = require('../middleware/auth.js')

// 获取电影列表（公开接口）
router.get('/list', movieController.getMovieList)

// 获取电影详情（公开接口）
router.get('/seabyid', movieController.searchMoviesById)
router.get('/seabyname', movieController.searchMoviesByChineseName)
router.get('/seabytab', movieController.searchMoviesByTab)

// 以下路由需要认证（管理员权限）
router.post('/create', verifyToken, movieController.createMovie)
router.put('/:id', verifyToken, movieController.updateMovie)
router.delete('/delmovie', verifyToken, movieController.deleteMovie)

module.exports = router