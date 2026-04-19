// 影厅数据模型层（数据库操作）
const db = require("../db/index.js");

const hallModel = {
  /**
   * 获取所有影厅
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM hall ORDER BY hall_id ASC";
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
   * 根据ID获取影厅详情
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM hall WHERE hall_id = ?";
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
   * 根据影厅名称搜索影厅（精准匹配）
   */
  findByName: (name) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM hall WHERE name = ?";
      db.query(sqlStr, name, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  /**
   * 根据影厅名称模糊搜索影厅
   */
  findByNameLike: (name) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "SELECT * FROM hall WHERE name LIKE ?";
      db.query(sqlStr, [`%${name}%`], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 检查影厅是否有关联的排片信息
   */
  hasRelatedSessions: (hallId) => {
    return new Promise((resolve, reject) => {
      const sqlStr =
        "SELECT COUNT(*) as count FROM session WHERE hall_id = ? AND stime> NOW()";
      db.query(sqlStr, hallId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  },

  /**
   * 创建影厅
   */
  create: (hallData) => {
    return new Promise((resolve, reject) => {
      const name = hallData.name;
      const rnum = hallData.rows;
      const cnum = hallData.cols;
      const seat = hallData.array;

      const sqlStr = `INSERT INTO hall (
                name, rnum, cnum,seat
            ) VALUES (?, ?, ?, ?)`;

      db.query(sqlStr, [name, rnum, cnum, seat], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  /**
   * 更新影厅信息
   */
  update: (id, hallData) => {
    return new Promise((resolve, reject) => {
      const { name, rnum, cnum, seat } = hallData;

      // 构建动态SQL语句
      const fields = [];
      const values = [];

      if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
      }
      if (rnum !== undefined) {
        fields.push("rnum = ?");
        values.push(rnum);
      }
      if (cnum !== undefined) {
        fields.push("cnum = ?");
        values.push(cnum);
      }
      if (seat !== undefined) {
        fields.push("seat = ?");
        values.push(seat);
      }

      if (fields.length === 1) {
        // 只有更新时间被添加
        reject(new Error("没有提供有效的更新字段"));
        return;
      }

      values.push(id); // ID作为WHERE条件的参数

      const sqlStr = `UPDATE hall SET ${fields.join(", ")} WHERE hall_id = ?`;

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
   * 删除影厅
   */
  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sqlStr = "DELETE FROM hall WHERE hall_id = ?";
      db.query(sqlStr, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = hallModel;
