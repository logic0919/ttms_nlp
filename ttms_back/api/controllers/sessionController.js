// 关于场次的控制层
const sessionService = require("../services/sessionService");

const sessionController = {
  /**
   * 添加场次
   */
  createSession: async (req, res) => {
    try {
      const createdSession = await sessionService.createSession(req.body);

      res.status(200).json({
        success: true,
        message: "场次创建成功",
        data: createdSession,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  /**
   * 根据电影ID和日期获取场次列表
   */
  getSessionByMovieAndDate: async (req, res) => {
    try {
      const { movie_id, date } = req.query;

      if (!movie_id) {
        return res.status(400).json({
          success: false,
          message: "电影ID不能为空",
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,
          message: "日期不能为空",
        });
      }

      const result = await sessionService.getSessionByMovieAndDate(
        movie_id,
        date,
      );

      res.status(200).json({
        success: true,
        message: "获取电影场次列表成功",
        data: result,
      });
    } catch (error) {
      console.error("获取电影场次列表错误:", error);
      res.status(500).json({
        success: false,
        message: error.message || "服务器内部错误",
        error: error.message,
      });
    }
  },
  
  /**
   * 根据session_id获得锁定的座位
   */
  getLockedSeatBySessionId: async (req, res) => { 
    try {
      const result = await sessionService.getLockedSeatBySessionId(req.query.session_id);
      res.status(200).json({
        success: true,
        message: "获取锁定的座位成功",
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "服务器内部错误",
        error: error.message
      });
    }
  },

  /**
   * 删除场次
   */
  deleteSession: async (req, res) => {
    try {
      const { session_id } = req.query;

      const deletedSession = await sessionService.deleteSession(session_id);

      if (!deletedSession) {
        return res.status(404).json({
          success: false,
          message: "未找到指定场次",
        });
      }

      res.status(200).json({
        success: true,
        message: "场次删除成功",
      });
    } catch (error) {
      console.error("删除场次错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 查看所有场次信息
   */
  getAllSessions: async (req, res) => {
    try {
      const sessions = await sessionService.getSessionList();

      res.status(200).json({
        success: true,
        message: "获取场次列表成功",
        data: {
          sessions,
        },
      });
    } catch (error) {
      console.error("获取场次列表错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 查看某个场次信息
   */
  getSessionById: async (req, res) => {
    try {
      const session_id = req.query.id;
      const session = await sessionService.getSessionById(session_id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "未找到指定场次",
        });
      }

      res.status(200).json({
        success: true,
        message: "获取场次信息成功",
        data: session,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 根据电影ID查看场次列表
   */
  getSessionsByMovieId: async (req, res) => {
    try {
      const { movie_id } = req.query;
      const sessions = await sessionService.getSessionsByMovieId(movie_id);

      res.status(200).json({
        success: true,
        message: "获取电影场次列表成功",
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 根据影厅ID查看场次列表
   */
  getSessionsByHallId: async (req, res) => {
    try {
      const { hall_id } = req.query;
      const sessions = await sessionService.getSessionsByHallId(hall_id);

      res.status(200).json({
        success: true,
        message: "获取影厅场次列表成功",
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 根据日期范围查看场次列表
   */
  getSessionsByDateRange: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const sessions = await sessionService.getSessionsByDateRange(
        start_date,
        end_date,
      );

      res.status(200).json({
        success: true,
        message: "获取日期范围内场次列表成功",
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 修改场次信息
   */
  updateSession: async (req, res) => {
    try {
      const { session_id, movie_id, hall_id, stime, etime, price } = req.body;

      const updatedSession = await sessionService.updateSession(
        session_id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: "场次信息更新成功",
        data: updatedSession,
      });
    } catch (error) {
      console.error("更新场次信息错误:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = sessionController;
