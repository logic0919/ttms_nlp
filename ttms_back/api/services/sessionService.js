// 场次服务层（业务逻辑）
const sessionModel = require("../models/sessionModel.js");
const movieModel = require("../models/movieModel.js");

const sessionService = {
  /**
   * 获取所有场次列表
   */
  getSessionList: async () => {
    const sessions = await sessionModel.findAll();
    return {
      sessions,
      total: sessions.length,
      status: 200,
    };
  },

  /**
   * 根据场次ID获取场次详情
   */
  getSessionById: async (id) => {
    const sessions = await sessionModel.findById(id);
    if (sessions.length === 0) {
      throw new Error("场次不存在");
    }
    return sessions[0];
  },

  /**
   * 根据电影ID获取场次列表
   */
  getSessionsByMovieId: async (movieId) => {
    const sessions = await sessionModel.findByMovieId(movieId);
    return {
      sessions,
      total: sessions.length,
      status: 200,
    };
  },

  /**
   * 根据影厅ID获取场次列表
   */
  getSessionsByHallId: async (hallId) => {
    const sessions = await sessionModel.findByHallId(hallId);
    return {
      sessions,
      total: sessions.length,
      status: 200,
    };
  },

  /**
   * 根据日期范围获取场次列表
   */
  getSessionsByDateRange: async (startDate, endDate) => {
    const sessions = await sessionModel.findByDateRange(startDate, endDate);
    return {
      sessions,
      total: sessions.length,
      status: 200,
    };
  },

  /**
   * 创建场次
   */
  createSession: async (sessionData) => {
    // 验证必要字段
    // if (!sessionData.movie_id) {
    //     throw new Error('电影ID不能为空')
    // }
    // if (!sessionData.hall_id) {
    //     throw new Error('影厅ID不能为空')
    // }
    // if (!sessionData.stime) {
    //     throw new Error('开始时间不能为空')
    // }
    // if (!sessionData.etime) {
    //     throw new Error('结束时间不能为空')
    // }
    // if (!sessionData.price || sessionData.price <= 0) {
    //     throw new Error('票价必须大于0')
    // }

    const movieInfo = await movieModel.findById(sessionData.movie_id);
    const duration = Number(movieInfo[0].duration);
    // 原始数据是UTC时间
    const originalTime = sessionData.stime; // '2026-01-30T16:00:00.000Z'

    // 转换为北京时间（UTC+8）
    const beijingTime = new Date(originalTime);
    console.log("UTC时间:", beijingTime.toISOString());

    // 如果你想要存储北京时间到数据库
    const formatBeijingTime = (date) => {
      // 先转UTC，再加8小时得到北京时间
      const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijingDate.toISOString().slice(0, 19).replace("T", " ");
    };

    // 计算结束时间（北京时间）
    const endTime = new Date(beijingTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    sessionData.stime = formatBeijingTime(beijingTime); // 2026-01-31 00:00:00
    sessionData.etime = formatBeijingTime(endTime); // 2026-01-31 02:00:00

    // console.log("stime:", sessionData.stime);
    // console.log("etime:", sessionData.etime);
    // 检查影厅在指定时间段是否可用
    const isOccupied = await sessionModel.checkHallAvailability(
      sessionData.hall_id,
      sessionData.stime,
      sessionData.etime,
    );
    if (isOccupied) {
      throw new Error("该时间段影厅已被占用，请选择其他时间段");
    }
    const result = await sessionModel.create(sessionData);
    if (result.affectedRows !== 1) {
      throw new Error("创建场次失败");
    }

    return {
      message: "创建场次成功",
      id: result.insertId,
      status: 200,
    };
  },
  /**
   * 根据电影ID和日期获取场次列表
   */
  getSessionByMovieAndDate: async (movieId, date) => {
    // 验证参数
    if (!movieId) {
      throw new Error("电影ID不能为空");
    }

    if (!date) {
      throw new Error("日期不能为空");
    }

    // 验证日期格式
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("日期格式不正确");
    }

    const sessions = await sessionModel.findByMovieAndDate(movieId, date);

    return {
      sessions,
      total: sessions.length,
      date: date,
      movie_id: movieId,
      status: 200,
    };
  },

  /**
   * 更新场次信息
   */
  updateSession: async (id, sessionData) => {
    // 检查场次是否存在
    const sessions = await sessionModel.findById(id);
    if (sessions.length === 0) {
      throw new Error("场次不存在");
    }

    //888
    const movieInfo = await movieModel.findById(sessionData.movie_id);
    const duration = Number(movieInfo[0].duration);
    // 原始数据是UTC时间
    const originalTime = sessionData.stime; // '2026-01-30T16:00:00.000Z'

    // 转换为北京时间（UTC+8）
    const beijingTime = new Date(originalTime);
    console.log("UTC时间:", beijingTime.toISOString());

    // 如果你想要存储北京时间到数据库
    const formatBeijingTime = (date) => {
      // 先转UTC，再加8小时得到北京时间
      const beijingDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijingDate.toISOString().slice(0, 19).replace("T", " ");
    };

    // 计算结束时间（北京时间）
    const endTime = new Date(beijingTime);
    endTime.setMinutes(endTime.getMinutes() + duration);

    sessionData.stime = formatBeijingTime(beijingTime); // 2026-01-31 00:00:00
    sessionData.etime = formatBeijingTime(endTime);

    // 检查是否与其他场次时间冲突（排除当前更新的场次）
    const isOccupied = await sessionModel.checkHallAvailability(
      sessionData.hall_id,
      sessionData.stime,
      sessionData.etime,
    );
    // 检查是否与其他场次冲突（除了自己）
    if (isOccupied) {
      const otherSessions = await sessionModel.findByHallId(
        sessionData.hall_id,
      );
      const conflict = otherSessions.some(
        (session) =>
          session.session_id != id && // 不是当前更新的场次
          new Date(sessionData.stime) < new Date(session.etime) &&
          new Date(sessionData.etime) > new Date(session.stime),
      );

      if (conflict) {
        throw new Error("该时间段影厅已被占用，请选择其他时间段");
      }
    }

    // 验证价格
    if (sessionData.price !== undefined && sessionData.price <= 0) {
      throw new Error("票价必须大于0");
    }

    const result = await sessionModel.update(id, sessionData);
    if (result.affectedRows !== 1) {
      throw new Error("更新场次失败");
    }

    return { message: "更新场次成功" };
  },
  /**
   * 获取指定session_id的已锁座位数组
   */
  getLockedSeatBySessionId: async (sessionId) => {
    // 检查场次是否存在
    const sessions = await sessionModel.findById(sessionId);
    if (sessions.length === 0) {
      throw new Error("场次不存在");
    }
    
    const lockedSeats = await sessionModel.getLockedSeatBySessionId(sessionId);

    return {
      lockedSeats,
      total: lockedSeats.length,
    };
  },

  /**
   * 删除场次
   */
  deleteSession: async (id) => {
    // 检查场次是否存在
    const sessions = await sessionModel.findById(id);
    if (sessions.length === 0) {
      throw new Error("场次不存在");
    }

    const result = await sessionModel.delete(id);
    if (result.affectedRows !== 1) {
      throw new Error("删除场次失败");
    }

    return { message: "删除场次成功" };
  },
};

module.exports = sessionService;
