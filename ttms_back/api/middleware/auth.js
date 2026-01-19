// 认证中间件
const jwt = require('jsonwebtoken')
const config = require('../config.js')
const { error } = require('../utils/response.js')

/**
 * JWT Token 验证中间件
 */
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token
    
    if (!token) {
        return res.status(401).send(error('请提供token', 401))
    }

    jwt.verify(token, config.jwtSerectKey, (err, data) => {
        if (err) {
            return res.status(401).send(error('无效的token', 401))
        }
        // 将用户信息挂载到req对象上，方便后续使用
        req.user = data
        next()
    })
}

module.exports = {
    verifyToken
}