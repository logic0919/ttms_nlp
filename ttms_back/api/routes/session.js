// 场次相关路由
const express = require('express')
const router = express.Router()
const sessionController = require('../controllers/sessionController.js')
const { verifyToken } = require('../middleware/auth.js')

// 获取场次列表（公开接口）
router.get('/list', sessionController.getAllSessions)

// 获取场次详情（公开接口）
router.get('/seabyid', sessionController.getSessionById)
router.get('/seabymovieanddate', sessionController.getSessionByMovieAndDate)
router.get('/getlockedseatbysessionid', sessionController.getLockedSeatBySessionId)

// 根据电影ID获取场次列表（公开接口）
router.get('/by-movie-id', sessionController.getSessionsByMovieId)

// 根据影厅ID获取场次列表（公开接口）
router.get('/by-hall-id', sessionController.getSessionsByHallId)

// 根据日期范围获取场次列表（公开接口）
router.get('/by-date-range', sessionController.getSessionsByDateRange)

// 以下路由需要认证（管理员权限）
router.post('/create', verifyToken, sessionController.createSession)
router.post('/update', verifyToken, sessionController.updateSession)
router.delete('/del', verifyToken, sessionController.deleteSession)

module.exports = router