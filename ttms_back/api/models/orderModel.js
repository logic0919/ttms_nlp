// 订单数据模型层（数据库操作）
const db = require("../db/index.js");

const orderModel = {
  /**
   * 创建订单
   */
  create: (orderData) => {
    return new Promise((resolve, reject) => {
      const { session_id, hall_id, seat, user_id, status, exp } = orderData;
      const sqlStr = `INSERT INTO order (
        session_id, hall_id, seat, user_id, status, exp
      ) VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(
        sqlStr,
        [session_id, hall_id, seat, user_id, status, exp],
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
   * 锁定座位（创建订单并设置状态为1，过期时间为当前时间+15分钟）
   */
  lockSeat: (orderData) => {
    return new Promise((resolve, reject) => {
      const { session_id, user_id, exp, price, seat } = orderData;

      // 1. 插入order表
      const orderSql = `INSERT INTO \`order\` (session_id, user_id, status, exp, price) VALUES (?, ?, 1, ?, ?)`;

      db.query(
        orderSql,
        [session_id, user_id, exp, price],
        (err, orderResult) => {
          if (err) {
            reject(err);
            return;
          }

          const orderId = orderResult.insertId;

          // 2. 批量插入座位（处理二维数组）
          if (seat && Array.isArray(seat) && seat.length > 0) {
            const seatValues = seat
              .map(
                ([row, col]) => `(${orderId}, ${session_id}, ${row}, ${col})`,
              )
              .join(",");

            const seatSql = `INSERT INTO order_seat (order_id, session_id, myrow, mycol) VALUES ${seatValues}`;

            db.query(seatSql, (err) => {
              if (err) reject(err);
              else resolve({ orderId, seatCount: seat.length });
            });
          } else {
            resolve({ orderId, seatCount: 0 });
          }
        },
      );
    });
  },

  /**
   * 支付订单（将status设为1，exp设为很远的未来时间）
   */
  payOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      // 设置一个非常大的时间，比如公元3000年
      const futureDate = new Date(3000, 0, 1); // 公元3000年1月1日
      const formattedDate =
        futureDate.getFullYear() +
        "-" +
        ("0" + (futureDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + futureDate.getDate()).slice(-2) +
        " " +
        ("0" + futureDate.getHours()).slice(-2) +
        ":" +
        ("0" + futureDate.getMinutes()).slice(-2) +
        ":" +
        ("0" + futureDate.getSeconds()).slice(-2);
      const sqlStr =
        "UPDATE \`order\` SET status = 1, exp = ? WHERE order_id = ?";

      db.query(sqlStr, [formattedDate, orderId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 退票（将status设为0）
   */
  refundOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "UPDATE \`order\` SET status = 0 WHERE order_id = ?";

      db.query(sqlStr, [orderId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 根据用户ID查询订单
   */
  findByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const sqlStr = `SELECT 
                          o.*, 
                          s.stime, 
                          s.etime, 
                          s.price as session_price,
                          s.hall_id,
                          m.chinese_name as movie_name, 
                          m.english_name as movie_english_name,
                          m.movie_img,
                          h.name as hall_name,
                          h.rnum,
                          h.cnum,
                          GROUP_CONCAT(CONCAT('第', os.myrow, '排第', os.mycol, '座')) as seat_info,
                          GROUP_CONCAT(CONCAT(os.myrow, '-', os.mycol)) as seat_positions
                      FROM \`order\` o
                      LEFT JOIN session s ON o.session_id = s.session_id
                      LEFT JOIN movie m ON s.movie_id = m.movie_id
                      LEFT JOIN hall h ON s.hall_id = h.hall_id
                      LEFT JOIN order_seat os ON o.order_id = os.order_id
                      WHERE o.user_id = ?
                      GROUP BY o.order_id  -- 按订单分组
                      ORDER BY o.order_id DESC`;

      db.query(sqlStr, [userId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  /**
   * 根据场次ID和座位号查询订单
   */
  findBySessionAndSeat: (session_id, row, col) => {
    return new Promise((resolve, reject) => {
      // 第一步：在order_seat表中查找对应的order_id
      const findOrderSql = `
      SELECT order_id 
      FROM order_seat 
      WHERE session_id = ? AND myrow = ? AND mycol = ?
    `;

      db.query(findOrderSql, [session_id, row, col], (err, seatResults) => {
        if (err) {
          reject(err);
          return;
        }

        // 如果没找到对应的座位记录，说明座位可用
        if (seatResults.length === 0) {
          resolve(0); // 返回0表示座位可用
          return;
        }
        const orderId = seatResults[seatResults.length - 1].order_id;

        // 第二步：根据order_id查询order表
        const checkOrderSql = `
        SELECT status, exp 
        FROM \`order\` 
        WHERE order_id = ? 
          AND status = 1
          AND exp >= NOW()
        LIMIT 1
      `;

        db.query(checkOrderSql, [orderId], (err, orderResults) => {
          if (err) {
            reject(err);
            return;
          }

          // 如果找到符合条件的订单，说明座位已被占用
          if (orderResults.length > 0) {
            resolve(1); // 返回1表示座位已被占用
          } else {
            resolve(0); // 返回0表示座位可用
          }
        });
      });
    });
  },
  /**
   * 根据订单ID查询订单详情
   */
  findById: async (user_id, order_id) => {
    console.log("orderModel");
    console.log(user_id, order_id);

    try {
      // 验证和查询订单信息
      const orderSql = `
        SELECT 
          o.order_id,
          o.price as order_price,
          o.user_id,
          o.status,
          o.exp,
          s.stime as session_start_time,
          s.etime as session_end_time,
          m.chinese_name as movie_name,
          h.name as hall_name
        FROM \`order\` o
        LEFT JOIN session s ON o.session_id = s.session_id
        LEFT JOIN movie m ON s.movie_id = m.movie_id
        LEFT JOIN hall h ON s.hall_id = h.hall_id
        WHERE o.order_id = ?
          AND o.user_id = ?
      `;
      // 使用Promise封装查询
      const [orderResults] = await new Promise((resolve, reject) => {
        db.query(orderSql, [order_id, user_id], (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve([results]);
          }
        });
      });
      if (orderResults.length === 0) {
        throw new Error(
          "订单验证失败：可能订单不存在、用户不匹配、状态无效或已过期",
        );
      }

      const orderInfo = orderResults[0];

      // 查询座位信息
      const seatSql = `SELECT myrow, mycol FROM order_seat WHERE order_id = ? ORDER BY myrow, mycol`;

      const [seatResults] = await new Promise((resolve, reject) => {
        db.query(seatSql, [order_id], (err, results) => {
          if (err) reject(err);
          else resolve([results]);
        });
      });

      const seats = seatResults.map((seat) => [seat.myrow, seat.mycol]);

      return {
        success: true,
        data: {
          order_id: orderInfo.order_id,
          movie_name: orderInfo.movie_name,
          session_start_time: orderInfo.session_start_time,
          session_end_time: orderInfo.session_end_time,
          hall_name: orderInfo.hall_name,
          order_price: orderInfo.order_price,
          seats: seats,
          user_id: orderInfo.user_id,
          status: orderInfo.status,
          exp: orderInfo.exp,
        },
      };
    } catch (error) {
      // 根据错误类型返回不同的错误信息
      if (error.message.includes("订单验证失败")) {
        return {
          success: false,
          code: "VALIDATION_FAILED",
          message: error.message,
        };
      }

      return {
        success: false,
        code: "SYSTEM_ERROR",
        message: "系统错误，请稍后重试",
        error: error.message,
      };
    }
  },

  /**
   * 检查订单是否有效（status=1 且未过期）
   */
  isValidOrder: (orderId) => {
    return new Promise((resolve, reject) => {
      const now = new Date();

      const sqlStr =
        "SELECT * FROM \`order\` WHERE order_id = ? AND status = 1 AND exp > ? AND exp != '3000-01-01 00:00:00'";

      db.query(sqlStr, [orderId, now], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0);
        }
      });
    });
  },

  /**
   * 获取所有订单
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sqlStr = `SELECT o.*, s.stime, s.etime, m.chinese_name as movie_name, h.hall_name, u.username
                      FROM order o
                      LEFT JOIN session s ON o.session_id = s.session_id
                      LEFT JOIN movie m ON s.movie_id = m.movie_id
                      LEFT JOIN hall h ON o.hall_id = h.hall_id
                      LEFT JOIN user u ON o.user_id = u.user_id
                      ORDER BY o.order_id DESC`;

      db.query(sqlStr, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  findAllOrder: () => {
    return new Promise((resolve, reject) => {
      const sqlStr = `SELECT * FROM \`order\` ORDER BY order_id DESC`;

      db.query(sqlStr, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  findAllOrderSeat: () => {
    return new Promise((resolve, reject) => {
      const sqlStr = `SELECT * FROM order_seat ORDER BY order_id DESC`;

      db.query(sqlStr, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = orderModel;
