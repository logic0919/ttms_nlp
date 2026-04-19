const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(cors())
app.options('*', cors())

const responseHandler = require('./middleware/responseHandler')
app.use(responseHandler)

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// 只保留 json 和 urlencoded，不要全局 multer
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 删掉全局 multer 配置和 upload.any()，multer 只在具体路由里按需挂载

const router = require('./routes/index')
app.use(router)

app.use('/uploads', express.static('uploads'))

const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})