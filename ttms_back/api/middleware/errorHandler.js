// 全局错误处理中间件
const { error } = require('../utils/response.js')

module.exports = (err, req, res, next) => {
    // token 解析失败
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send(error('无效的token', 401))
    }
    // 未知错误
    res.status(500).send(error(err.message, 500))
}