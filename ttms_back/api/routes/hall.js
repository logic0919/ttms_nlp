// 影厅相关路由
const express = require('express')
const router = express.Router()
const hallController = require('../controllers/hallController.js')
const { verifyToken } = require('../middleware/auth.js')

// 获取影厅列表（公开接口）
router.get('/list', hallController.getAllHalls)

// 获取影厅详情（公开接口）
router.get('/seabyid', hallController.getHallById)

// 以下路由需要认证（管理员权限）
router.post('/create', verifyToken, hallController.createHall)
router.post('/update', verifyToken, hallController.updateHall)
router.delete('/del', verifyToken, hallController.deleteHall)

module.exports = router