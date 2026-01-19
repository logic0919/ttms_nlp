// 用户相关路由
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')
const { verifyToken } = require('../middleware/auth.js')

router.post('/register', userController.register)
router.post('/login', userController.login)

// 根据token解析用户信息（不需要认证中间件，因为需要处理过期token）
router.get('/parsetoken', userController.Parsetoken)

module.exports = router