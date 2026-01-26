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

// 解析 multipart/form-data 文件上传中间件
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// 确保上传目录存在
const createDirIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// 创建必要的目录
createDirIfNotExists('uploads/movie')
createDirIfNotExists('uploads/director')
createDirIfNotExists('uploads/actor')

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 根据文件字段名决定存储目录
    let uploadPath = 'uploads/'
    if (file.fieldname === 'movie_img') {
      uploadPath = 'uploads/movie/'
    } else if (file.fieldname === 'director_img') {
      uploadPath = 'uploads/director/'
    } else if (file.fieldname === 'actor_img') {
      uploadPath = 'uploads/actor/'
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
    cb(null, uniqueName)
  }
})

const upload = multer({ storage: storage })
app.use(upload.any()) // 接受所有类型的文件上传

// 导入并注册所有路由
const router = require('./routes/index')
app.use(router)

// 配置静态文件服务，让uploads目录可以被前端访问
app.use('/uploads', express.static('uploads'))

// 全局错误处理中间件（必须在所有路由之后）
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

// 启动服务器
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})
