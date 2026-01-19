// 统一响应格式工具
/**
 * 统一响应格式
 * @param {*} data - 数据或错误信息
 * @param {number} statusCode - HTTP状态码，默认200
 * @param {string} message - 消息（可选）
 */
const success = (data, message = '操作成功') => {
    return {
        status: 200,
        code: 200,
        message,
        data
    }
}

const error = (message, statusCode = 400) => {
    return {
        status: statusCode,
        code: statusCode,
        message: message instanceof Error ? message.message : message
    }
}

/**
 * 便捷方法：成功响应
 */
const cc = (data, statusCode = 200) => {
    if (statusCode === 200) {
        return {
            status: 200,
            code: 200,
            message: typeof data === 'string' ? data : '操作成功',
            data: typeof data === 'string' ? null : data
        }
    } else {
        return {
            status: statusCode,
            code: statusCode,
            message: data instanceof Error ? data.message : data
        }
    }
}

module.exports = { 
    success, 
    error, 
    cc 
}