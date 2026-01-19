# Node.js 后端项目结构说明

## 📁 目录结构

```
api/
├── app.js                    # 应用入口文件
├── config.js                 # 配置文件（JWT密钥等）
├── db/                       # 数据库相关
│   └── index.js             # 数据库连接配置
├── routes/                   # 路由定义（按模块划分）
│   ├── index.js             # 路由入口，统一注册所有路由
│   ├── user.js              # 用户相关路由
│   └── movie.js             # 电影相关路由（示例）
├── controllers/              # 控制器层（处理请求和响应）
│   ├── userController.js
│   └── movieController.js   # 示例
├── services/                 # 服务层（业务逻辑）
│   ├── userService.js
│   └── movieService.js      # 示例
├── models/                   # 数据模型层（数据库操作）
│   ├── userModel.js
│   └── movieModel.js        # 示例
├── middleware/               # 中间件
│   ├── auth.js              # JWT认证中间件
│   ├── responseHandler.js   # 统一响应格式中间件
│   └── errorHandler.js      # 错误处理中间件
└── utils/                    # 工具函数
    ├── validation.js        # 验证工具（原regular.js）
    └── response.js          # 响应工具
```

## 🏗️ 架构说明

### 分层架构

1. **Routes（路由层）**
   - 定义 API 端点
   - 绑定中间件（如认证）
   - 将请求转发到对应的 Controller

2. **Controllers（控制器层）**
   - 处理 HTTP 请求和响应
   - 调用 Service 层处理业务逻辑
   - 返回统一格式的响应

3. **Services（服务层）**
   - 包含业务逻辑
   - 调用 Model 层进行数据操作
   - 处理业务规则和验证

4. **Models（模型层）**
   - 封装数据库操作
   - 提供数据访问接口
   - 返回 Promise，便于使用 async/await

5. **Middleware（中间件）**
   - 认证、授权
   - 请求日志
   - 错误处理
   - 响应格式统一

6. **Utils（工具函数）**
   - 验证函数
   - 加密/解密
   - 格式化工具等

## 🚀 如何添加新功能模块

### 示例：添加订单（Order）模块

#### 1. 创建 Model 层
创建 `models/orderModel.js`，定义数据库操作：

```javascript
const db = require('../db/index.js')

const orderModel = {
    findAll: () => { /* ... */ },
    findById: (id) => { /* ... */ },
    create: (orderData) => { /* ... */ }
}

module.exports = orderModel
```

#### 2. 创建 Service 层
创建 `services/orderService.js`，实现业务逻辑：

```javascript
const orderModel = require('../models/orderModel.js')

const orderService = {
    getOrderList: async () => {
        // 业务逻辑
        const orders = await orderModel.findAll()
        return orders
    }
}

module.exports = orderService
```

#### 3. 创建 Controller 层
创建 `controllers/orderController.js`，处理请求响应：

```javascript
const orderService = require('../services/orderService.js')
const { cc } = require('../utils/response.js')

const orderController = {
    getOrderList: async (req, res) => {
        try {
            const result = await orderService.getOrderList()
            res.send(cc(result, 0))
        } catch (error) {
            res.send(cc(error.message))
        }
    }
}

module.exports = orderController
```

#### 4. 创建路由
创建 `routes/order.js`，定义 API 端点：

```javascript
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController.js')
const { verifyToken } = require('../middleware/auth.js')

router.get('/list', verifyToken, orderController.getOrderList)

module.exports = router
```

#### 5. 注册路由
在 `routes/index.js` 中导入并注册：

```javascript
const orderRoutes = require('./order.js')
router.use('/api/order', orderRoutes)
```

## 📝 使用说明

### 运行项目

```bash
cd api
node app.js
# 或使用 nodemon 自动重启
nodemon app.js
```

### API 端点示例

- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/infoGet` - 获取用户信息（需要token）
- `POST /api/user/infoChange` - 修改用户信息（需要token）

### 中间件使用

#### 认证中间件
在需要认证的路由上使用：

```javascript
const { verifyToken } = require('../middleware/auth.js')
router.get('/protected', verifyToken, controller.method)
```

认证后，用户信息会挂载到 `req.user` 上。

### 响应格式

统一使用 `res.cc()` 方法：

```javascript
// 成功
res.cc(data, 0)

// 失败
res.cc('错误信息')
```

## 🔄 迁移说明

原有的 `router_handler.js` 已经重构到新的分层结构中：
- 用户相关功能已迁移到新的模块化结构
- 原有的 `regular.js` 已迁移到 `utils/validation.js`
- 数据库连接已提取到 `db/index.js`

## 💡 最佳实践

1. **单一职责**：每个文件只负责一个模块/功能
2. **分层清晰**：严格遵守分层架构，避免跨层调用
3. **错误处理**：使用 try-catch 捕获异常，返回统一格式
4. **代码复用**：公共逻辑提取到 utils 或中间件
5. **命名规范**：使用清晰的命名，便于维护

## 📚 扩展建议

- 可以添加更多的中间件（如日志、限流等）
- 可以使用 ORM（如 Sequelize、TypeORM）替代原生 SQL
- 可以添加 API 文档（如 Swagger）
- 可以添加单元测试
- 可以配置环境变量管理配置信息