// 详细演示数据库错误从模型层到控制器层的完整传播过程

console.log('=== 数据库错误传播流程演示 ===\n')

// 第1步：模拟数据库连接失败
console.log('📊 步骤1：数据库查询失败')
console.log('   db.query() 回调函数收到 err 参数')
console.log('   err = { message: "数据库连接失败", code: "ECONNREFUSED" }\n')

// 第2步：模型层处理错误
console.log('🏗️  步骤2：模型层 (userModel.findById)')
console.log('   执行: if (err) { reject(err) }')
console.log('   返回: Promise.reject(err) ← 包装成rejected Promise\n')

// 第3步：服务层等待Promise
console.log('🔧 步骤3：服务层 (userService.register)')
console.log('   执行: const existingUsers = await userModel.findById(obj.user_id)')
console.log('   遇到 rejected Promise，await 抛出异常')
console.log('   异常: err = { message: "数据库连接失败", code: "ECONNREFUSED" }')
console.log('   第14行代码不会执行\n')

// 第4步：控制器层捕获异常
console.log('🎯 步骤4：控制器层 (userController.register)')
console.log('   try 块中的 await userService.register(req.body) 抛出异常')
console.log('   跳转到 catch (err) 块')
console.log('   执行: res.status(400).json({ success: false, message: err.message })\n')

// 第5步：最终响应
console.log('📤 步骤5：发送HTTP响应')
console.log('   响应状态码: 400')
console.log('   响应内容: { "success": false, "message": "数据库连接失败" }\n')

// 模拟实际的错误对象
const mockDbError = new Error('数据库连接失败')
mockDbError.code = 'ECONNREFUSED'

// 模拟各层的行为
function simulateModelLayer(error) {
    console.log('🏗️  模型层执行: reject(error)')
    return Promise.reject(error)
}

async function simulateServiceLayer() {
    console.log('🔧 服务层执行: await userModel.findById()')
    try {
        const result = await simulateModelLayer(mockDbError)
        console.log('   这行不会执行')
    } catch (err) {
        console.log('   服务层抛出异常:', err.message)
        throw err // 重新抛出，让控制器捕获
    }
}

async function simulateControllerLayer() {
    console.log('🎯 控制器层执行: try { await userService.register() }')
    try {
        await simulateServiceLayer()
        console.log('   这行不会执行')
    } catch (err) {
        console.log('   控制器层捕获异常:', err.message)
        console.log('   发送错误响应')
        return { success: false, message: err.message }
    }
}

// 运行模拟
simulateControllerLayer().then(response => {
    console.log('\n📤 最终响应:', JSON.stringify(response, null, 2))
})