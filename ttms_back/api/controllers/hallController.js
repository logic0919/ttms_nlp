// 关于影厅的控制层
const hallService = require("../services/hallService"); // 假设存在Hall模型
const hallController = {
  /**
   * 添加影厅
   */
  createHall: async (req, res) => {
    try {
      const savedHall = await hallService.createHall(req.body);

      res.status(200).json({
        success: true,
        message: "影厅创建成功",
        data: savedHall,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  /**
   * 删除影厅
   */
  deleteHall: async (req, res) => {
    try {
        const hall_id = req.query.id;
        
      const deletedHall = await hallService.findByIdAndDelete(hall_id);

      if (!deletedHall) {
        return res.status(404).json({
          success: false,
          message: "未找到指定影厅",
        });
      }

      res.status(200).json({
        success: true,
        message: "影厅删除成功",
      });
    } catch (error) {
      console.error("删除影厅错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 查看所有影厅信息
   */
  getAllHalls: async (req, res) => {
    try {
      const halls = await hallService.getHallList();

      res.status(200).json({
        success: true,
        message: "获取影厅列表成功",
        data: {
          halls,
        },
      });
    } catch (error) {
      console.error("获取影厅列表错误:", error);
      res.status(500).json({
        success: false,
        message: "服务器内部错误",
        error: error.message,
      });
    }
  },

  /**
   * 查看某个影厅信息
   */
  getHallById: async (req, res) => {
    try {
      const { hall_id } = req.query;
      const hall = await hallService.getHallById(hall_id);

      if (!hall) {
        return res.status(404).json({
          success: false,
          message: "未找到指定影厅",
        });
      }

      res.status(200).json({
        success: true,
        message: "获取影厅信息成功",
        data: hall,
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
   * 修改影厅信息
   */
  updateHall: async (req, res) => {
    try {
      const { hall_id, name, rnum, cnum, seat } = req.body;
      // {hall_id, name, rnum, cnum, seat}
      const updateHall = await hallService.updateHall(hall_id, req.body);

      res.status(200).json({
        success: true,
        message: "影厅信息更新成功",
        data: updateHall,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },
};
module.exports = hallController;
