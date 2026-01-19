const express = require('express')
const app = express()

// 导入cors允许跨域资源共享 - 必须在所有路由之前配置
const cors = require('cors')
app.use(cors())

// 显式处理 OPTIONS 预检请求
app.options('*', cors())

// 响应处理中间件（统一响应格式）
const responseHandler = require('./middleware/responseHandler')
app.use(responseHandler)

// 日志中间件（可选）
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// 解析 post 表单数据的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 导入并注册所有路由
const router = require('./routes/index')
app.use(router)

// 全局错误处理中间件（必须在所有路由之后）
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

// 启动服务器
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})
