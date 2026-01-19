// 数据库连接配置
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'my_db_04_ttms',
})

module.exports = db