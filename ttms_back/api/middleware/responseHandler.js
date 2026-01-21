// 响应处理中间件
module.exports = (req, res, next) => {
    // 统一响应格式方法（兼容旧代码，但推荐使用HTTP状态码）
    res.cc = (data, statusCode = 200) => {
        let response;
        if (statusCode === 200) {
            response = {
                success: true,
                message: '操作成功',
                data: data
            }
        } else {
            response = {
                success: false,
                message: data
            }
        }
        // 设置HTTP响应状态码
        res.status(statusCode)
        res.json(response)
    }
    next()
}