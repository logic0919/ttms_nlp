// 用户数据模型层（数据库操作）
const db = require('../db/index.js')

const userModel = {
    /**
     * 根据手机号查询用户
     */
    findById: (user_id) => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM users WHERE tel = ?'
            db.query(sqlStr, user_id, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    /**
     * 根据ID查询用户
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM users WHERE id = ?'
            db.query(sqlStr, id, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    /**
     * 创建用户
     */
    create: (userData) => {
        return new Promise((resolve, reject) => {
            const { tel, QQ, name, lesson, direction, gender, pwd } = userData
            const sqlStr = 'INSERT INTO users (tel, QQ, name, lesson, direction, gender, pwd, status) VALUES (?, ?, ?, ?, ?, ?, ?, 1)'
            db.query(sqlStr, [tel, QQ, name, lesson, direction, gender, pwd], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    /**
     * 更新用户信息
     */
    update: (tel, userData) => {
        return new Promise((resolve, reject) => {
            const { QQ, name, lesson, gender, direction } = userData
            const sqlStr = 'UPDATE users SET QQ = ?, name = ?, lesson = ?, gender = ?, direction = ? WHERE tel = ?'
            db.query(sqlStr, [QQ, name, lesson, gender, direction, tel], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = userModel