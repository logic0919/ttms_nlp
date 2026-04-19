// 用户控制器（处理请求和响应）
// const { verifyToken } = require('../middleware/auth.js')
const  userService = require('../services/userService.js')

const userController = {
    /**
     * 用户注册
     */
    register: async (req, res) => {
        try {
            const result = await userService.register(req.body)
            res.status(200).json({
                success: true,
                message: '注册成功',
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
     * 用户登录
     */
    login: async (req, res) => {
        try {
            console.log();
            
            const result = await userService.login(req.body)
            res.status(200).json({
                success: true,
                message: '登录成功',
                data: result
            })
        } catch (err) {            
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
    // 验证登录并返回身份
    verifyToken: async (req, res) => {
        try {
            // 从请求中获取token（支持header或query参数）
            let token = req.headers.authorization?.replace('Bearer ', '')
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: '请提供token'
                })
            }
            const result = await userService.verifyTokenAndGetUserInfo(token)
            // 返回指定格式的数据：user_id, isexp, token, status
            res.status(200).json({
                success: true,
                message: '登录验证成功',
                data: result
            })
        } catch (err) {
            res.status(400).json({
                success: false,
                message: err.message
            })
        }
    },
    // 自动登录
    Parsetoken: async (req, res) => { 
        try {
            // 从请求中获取token（支持header或query参数）
            let token = req.headers.authorization?.replace('Bearer ', '')
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: '请提供token'
                })
            }
            const result = await userService.parseTokenAndGetUserInfo(token)
            
            // 返回指定格式的数据：user_id, isexp, token, status
            res.status(200).json({
                success: true,
                message: 'Token解析成功',
                data: result
            })
        } catch (err) {            
            res.status(400).json({
                success: false,
                message: 'token失效'
            })
        }
    }
}

module.exports = userController