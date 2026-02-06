// 场次数据模型层（数据库操作）
const db = require("../db/index.js");

const sessionModel = {
  /**
   * 获取所有场次
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM session ORDER BY session_id ASC";
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
   * 根据ID获取场次详情
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM session WHERE session_id = ?";
      db.query(sqlStr, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  /**
   * 获取指定session_id的锁定座位信息
   */
  getLockedSeatBySessionId: async (sessionId) => {
    return new Promise((resolve, reject) => {
      const sqlStr = `
        SELECT os.myrow, os.mycol
        FROM order_seat os
        INNER JOIN \`order\` o ON os.order_id = o.order_id
        WHERE os.session_id = ?
          AND o.status = 1
          AND o.exp > NOW()
      `;
      
      db.query(sqlStr, [sessionId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          // 转换为二维数组格式 [[myrow, mycol], ...]
          const seatArray = results.map(row => [row.myrow, row.mycol]);
          resolve(seatArray);
        }
      });
    });
  },
  /**
   * 根据电影ID获取场次列表
   */
  findByMovieId: (movieId) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM session WHERE movie_id = ?";
      db.query(sqlStr, movieId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 根据影厅ID获取场次列表
   */
  findByHallId: (hallId) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM session WHERE hall_id = ?";
      db.query(sqlStr, hallId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  /**
   * 检查电影是否有场次安排
   */
  checkMovieHasSessions: (movieId) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT COUNT(*) as count FROM session WHERE movie_id = ?";
      db.query(sqlStr, [movieId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  },

  /**
   * 根据日期范围获取场次列表
   */
  findByDateRange: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM session WHERE stime BETWEEN ? AND ?";
      db.query(sqlStr, [startDate, endDate], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 创建场次
   */
  create: (sessionData) => {
    return new Promise((resolve, reject) => {
      const { movie_id, hall_id, stime, etime, price } = sessionData;
      console.log("model:");
      console.log(stime);
      console.log(etime);

      const sqlStr = `INSERT INTO session (
                movie_id, hall_id, stime, etime, price
            ) VALUES (?, ?, ?, ?, ?)`;

      db.query(
        sqlStr,
        [movie_id, hall_id, stime, etime, price],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        },
      );
    });
  },
  /**
   * 根据电影ID和日期获取场次列表
   */
  findByMovieAndDate: (movieId, date) => {
    return new Promise((resolve, reject) => {
      // 将日期转换为当天的开始时间和结束时间
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const sqlStr = `
        SELECT s.*, m.*, h.*
        FROM session s
        LEFT JOIN movie m ON s.movie_id = m.movie_id
        LEFT JOIN hall h ON s.hall_id = h.hall_id
        WHERE s.movie_id = ? 
        AND DATE(s.stime) = DATE(?)
        ORDER BY s.stime ASC
      `;

      db.query(sqlStr, [movieId, date], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 更新场次信息
   */
  update: (id, sessionData) => {
    return new Promise((resolve, reject) => {
      const { movie_id, hall_id, stime, etime, price } = sessionData;

      // 构建动态SQL语句
      const fields = [];
      const values = [];

      if (movie_id !== undefined) {
        fields.push("movie_id = ?");
        values.push(movie_id);
      }
      if (hall_id !== undefined) {
        fields.push("hall_id = ?");
        values.push(hall_id);
      }
      if (stime !== undefined) {
        fields.push("stime = ?");
        values.push(stime);
      }
      if (etime !== undefined) {
        fields.push("etime = ?");
        values.push(etime);
      }
      if (price !== undefined) {
        fields.push("price = ?");
        values.push(price);
      }

      if (fields.length === 0) {
        reject(new Error("没有提供有效的更新字段"));
        return;
      }

      values.push(id); // ID作为WHERE条件的参数

      const sqlStr = `UPDATE session SET ${fields.join(", ")} WHERE session_id = ?`;

      db.query(sqlStr, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 删除场次
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "DELETE FROM session WHERE session_id = ?";
      db.query(sqlStr, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 检查影厅在指定时间段是否已被占用
   */
  /*
    sql语句:
    原本生成的：
    SELECT * FROM session 
                WHERE hall_id = ? 
                AND ((stime < ? AND etime > ?) 
                     OR (stime < ? AND etime > ?) 
                     OR (stime >= ? AND etime <= ?))
    我想出的（去除重复）：
    SELECT * FROM session 
    WHERE hall_id = ? 
    AND (
        -- 情况1：新场次开始时，已有场次正在进行
        (stime < ? AND etime > ?)
        OR
        -- 情况2：已有场次完全在新场次内
        (stime >= ? AND etime <= ?)
        OR
        -- 情况3：新场次结束时，已有场次正在进行  
        (stime < ? AND etime > ?)
        OR
        -- 情况4：新场次完全在已有场次内
        (stime <= ? AND etime >= ?)
    )

    ds给出的精简版：
    SELECT * FROM session 
    WHERE hall_id = ? 
    AND stime < ?   -- 新场次结束时间
    AND etime > ?     -- 新场次开始时间
    */
  checkHallAvailability: (hall_id, stime, etime) => {
    return new Promise((resolve, reject) => {
      const sqlStr = `
                SELECT * FROM session 
                WHERE hall_id = ? 
                AND (
                    (stime < ? AND etime > ?)
                    OR
                    (stime >= ? AND etime <= ?)
                    OR
                    (stime < ? AND etime > ?)
                )
            `;
      db.query(
        sqlStr,
        [hall_id, stime, stime, stime, etime, etime, etime],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.length > 0);
          }
        },
      );
    });
  },
};

module.exports = sessionModel;
