// 用户控制器（处理请求和响应）
const userService = require('../services/userService.js')
const { success, error } = require('../utils/response.js')

const userController = {
    /**
     * 用户注册
     */
    register: async (req, res) => {
        console.log(req.body);
        
        try {
            const result = await userService.register(req.body)
            res.status(200).send(success(result, '注册成功'))
        } catch (err) {
            res.status(400).send(error(err.message, 400))
        }
    },

    /**
     * 用户登录
     */
    login: async (req, res) => {
        try {
            const result = await userService.login(req.body)
            res.status(200).send(success(result, '登录成功'))
        } catch (err) {
            res.status(400).send(error(err.message, 400))
        }
    },

    Parsetoken: async (req, res) => {
        try {
            // 从请求中获取token（支持header或query参数）
            let token = req.headers.authorization?.replace('Bearer ', '') || req.query.token || req.body.token
            
            if (!token) {
                return res.status(400).send(error('请提供token', 400))
            }

            const result = await userService.parseTokenAndGetUserInfo(token)
            
            // 返回指定格式的数据：user_id, isexp, token, status
            res.status(200).send(success({
                user_id: result.user_id,
                isexp: result.isexp,
                token: result.token
            }))
        } catch (err) {
            res.status(400).send(error(err.message, 400))
        }
    }
}

module.exports = userController