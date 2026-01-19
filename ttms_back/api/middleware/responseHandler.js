// 响应处理中间件
const { cc } = require('../utils/response.js')

module.exports = (req, res, next) => {
    // 统一响应格式方法（兼容旧代码，但推荐使用HTTP状态码）
    res.cc = (data, statusCode = 200) => {
        const response = cc(data, statusCode)
        // 设置HTTP响应状态码
        res.status(response.status)
        res.send(response)
    }
    next()
}