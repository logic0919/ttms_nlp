// 演示 Promise.reject 和异常抛出的区别

console.log('=== Promise.reject vs 异常抛出 ===\n')

// 方式1: 直接处理 rejected Promise
console.log('🔴 方式1: 不使用 await，直接处理 Promise')
const rejectedPromise = Promise.reject(new Error('数据库错误'))
console.log('rejectedPromise:', rejectedPromise) // Promise { <rejected> }

// 方式2: 使用 await，让 Promise 转换为异常
async function demonstrateAwait() {
    console.log('\n🟡 方式2: 使用 await，Promise 转换为异常')
    try {
        const result = await rejectedPromise
        console.log('这行不会执行')
    } catch (err) {
        console.log('await 捕获到异常:', err.message)
        console.log('类型:', typeof err) // object
        console.log('是 Error 实例:', err instanceof Error) // true
    }
}

demonstrateAwait()

// 模拟您的代码结构
console.log('\n=== 您的代码结构模拟 ===')

// 模型层
function mockModel() {
    console.log('🏗️  模型层: 返回 Promise.reject')
    return Promise.reject(new Error('数据库连接失败'))
}

// 服务层
async function mockService() {
    console.log('🔧 服务层: 调用 await model()')
    try {
        const data = await mockModel() // 这里会抛出异常！
        console.log('服务层: 得到数据', data)
    } catch (err) {
        console.log('服务层: 如果有 try-catch 会捕获:', err.message)
        throw err // 重新抛出，让上层处理
    }
}

// 控制器层
async function mockController() {
    console.log('🎯 控制器层: 调用 await service()')
    try {
        await mockService() // 这里也会抛出异常！
        console.log('控制器层: 处理成功')
    } catch (err) {
        console.log('🎯 控制器层: 最终捕获异常:', err.message)
        console.log('   发送 HTTP 错误响应')
    }
}

// 测试
setTimeout(() => {
    mockController()
}, 100)