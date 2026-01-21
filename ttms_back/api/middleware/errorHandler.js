// 全局错误处理中间件
module.exports = (err, req, res, next) => {
    // token 解析失败
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: '无效的token'
        })
    }
    // 未知错误
    res.status(500).json({
        success: false,
        message: err.message
    })
}