// 路由入口文件，统一注册所有路由模块
const express = require('express')
const router = express.Router()

// 导入各个模块的路由
const userRoutes = require('./user.js')
// const movieRoutes = require('./movie.js')  // 取消注释以启用电影模块
// const orderRoutes = require('./order.js')  // 取消注释以启用订单模块

// 注册路由
router.use('/api/user', userRoutes)
// router.use('/api/movie', movieRoutes)      // 取消注释以启用电影模块
// router.use('/api/order', orderRoutes)      // 取消注释以启用订单模块

// 测试路由（可以保留或删除）
const { success } = require('../utils/response.js')
router.get('/api/test', (req, res) => {
    console.log(req.query.a)
    console.log(req.query.b)
    res.status(200).send(success(null, 'test成功'))
})

module.exports = router