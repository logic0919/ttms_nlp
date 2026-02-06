// 电影数据模型层（数据库操作示例）
const db = require('../db/index.js')

const movieModel = {
    /**
     * 获取所有电影
     */
    findAll: () => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM movie ORDER BY movie_id ASC'//desc或者asc,asc是顺序
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
     * 获取有场次安排的电影列表（正在热映）
     */
    findMoviesWithSessions: () => {
        return new Promise((resolve, reject) => {
            const sqlStr = `
                SELECT DISTINCT m.* 
                FROM movie m 
                INNER JOIN session s ON m.movie_id = s.movie_id
                WHERE s.stime >= NOW()
                ORDER BY m.movie_id ASC
            `;
            db.query(sqlStr, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
    /**
     * 根据ID获取电影详情
     */
    findById: (id) => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM movie WHERE movie_id = ?'
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
     * 根据标签（分类ID）搜索电影
     * @param {number} tab - 分类ID
     * @returns {Promise<Array>} 包含该分类下所有电影的数组
     */
    // 标签为一个整型数字
    findByTab: (tab) => {
        return new Promise((resolve, reject) => {
            // category_ids 数据库设为类似 '1,2,3' 的字符串，所以需要用 FIND_IN_SET 查找
            const sqlStr = 'SELECT * FROM movie WHERE FIND_IN_SET(?, category_ids)';
            db.query(sqlStr, [tab], (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            })
        })
    },
    /**
     * 根据chinese_name字段模糊搜索电影
     */
    findByChineseName: (name) => {
        return new Promise((resolve, reject) => {
            const sqlStr = 'SELECT * FROM movie WHERE chinese_name LIKE ?'
            db.query(sqlStr, [`%${name}%`], (err, results) => {
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
            const {
                chinese_name, english_name, category_ids, area, show_time,
                duration, directors, actors, introduction,
                movie_img, director_img, actor_img
            } = movieData
            

            const sqlStr = `INSERT INTO movie (
                chinese_name, english_name, category_ids, area, show_time,
                duration, directors, actors, introduction,
                movie_img, director_img, actor_img
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

            db.query(sqlStr, [
                chinese_name, english_name, category_ids, area, show_time,
                duration, directors, actors, introduction,
                movie_img, director_img, actor_img
            ], (err, results) => {
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
            const sqlStr = 'UPDATE movie SET name = ?, director = ?, actors = ?, duration = ?, description = ? WHERE id = ?'
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
            const sqlStr = 'DELETE FROM movie WHERE movie_id = ?'
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