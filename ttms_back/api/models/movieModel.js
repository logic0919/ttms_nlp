// 电影数据模型层（数据库操作示例）
const db = require('../db/index.js')

const movieModel = {
    /**
     * 获取所有电影
     */
    findAll: () => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM movies ORDER BY create_time DESC'
            db.query(sqlStr, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    /**
     * 根据ID获取电影详情
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM movies WHERE id = ?'
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
     * 创建电影
     */
    create: (movieData) => {
        return new Promise((resolve, reject) => {
            const { name, director, actors, duration, description } = movieData
            const sqlStr = 'INSERT INTO movies (name, director, actors, duration, description) VALUES (?, ?, ?, ?, ?)'
            db.query(sqlStr, [name, director, actors, duration, description], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    /**
     * 更新电影信息
     */
    update: (id, movieData) => {
        return new Promise((resolve, reject) => {
            const { name, director, actors, duration, description } = movieData
            const sqlStr = 'UPDATE movies SET name = ?, director = ?, actors = ?, duration = ?, description = ? WHERE id = ?'
            db.query(sqlStr, [name, director, actors, duration, description, id], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },

    /**
     * 删除电影
     */
    delete: (id) => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'DELETE FROM movies WHERE id = ?'
            db.query(sqlStr, id, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    }
}

module.exports = movieModel