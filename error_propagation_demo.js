// 错误传播演示：数据库错误如何从模型层直接到达控制器层

// 模拟模型层 (userModel)
const mockUserModel = {
    findById: (userId) => {
        return new Promise((resolve, reject) => {
            // 模拟数据库连接失败
            const dbError = new Error('数据库连接失败: ECONNREFUSED')
            console.log('📊 模型层：数据库查询失败，reject错误')
            reject(dbError)
        })
    }
}

// 模拟服务层 (userService) - 没有 try-catch
const mockUserService = {
    register: async (obj) => {
        console.log('🔧 服务层：开始注册流程')
        console.log('🔧 服务层：调用模型层查询用户')

        // 这里会抛出异常，但服务层不捕获
        const existingUsers = await mockUserModel.findById(obj.user_id)
        console.log('🔧 服务层：查询成功，继续处理...') // 这行不会执行

        return { message: '注册成功' }
    }
}

// 模拟控制器层 (userController) - 有 try-catch
const mockUserController = {
    register: async (req, res) => {
        console.log('🎯 控制器层：接收到注册请求')
        try {
            console.log('🎯 控制器层：调用服务层')
            const result = await mockUserService.register(req.body)
            console.log('🎯 控制器层：注册成功') // 这行不会执行
            return { success: true, data: result }
        } catch (err) {
            console.log('🎯 控制器层：捕获到错误')
            return { success: false, message: err.message }
        }
    }
}

// 测试错误传播
async function testErrorPropagation() {
    console.log('=== 错误传播测试 ===\n')

    const mockReq = { body: { user_id: 'test123' } }

    const response = await mockUserController.register(mockReq, {})

    console.log('\n=== 最终结果 ===')
    console.log('响应:', response)
}

// 运行测试
testErrorPropagation().catch(console.error)