// 认证中间件
const jwt = require('jsonwebtoken')
const config = require('../config.js')

/**
 * JWT Token 验证中间件
 */
const verifyToken = (req, res, next) => {
    console.log('sss');
    // console.log(req.headers.authorization);
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token
console.log(req.body);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: '请提供token'
        })
    }

    jwt.verify(token, config.jwtSerectKey, (err, data) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: '无效的token'
            })
        }
        // 将用户信息挂载到req对象上，方便后续使用
        req.user = data
        // console.log('aa');
        // console.log(data);req.headers.authorization
        next()
    })
}

module.exports = {
    verifyToken
}