// 订单控制器（处理请求和响应）
const orderService = require("../services/orderService.js");

const orderController = {
  /**
   * 锁定座位
   */
  lockSeat: async (req, res) => {
    try {
      const { session_id, seat } = req.body;
      const { user_id } = req.user;

      const orderData = {
        session_id,
        seat,
        user_id,
      };

      const result = await orderService.lockSeat(orderData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          order_id: result.order_id,
          expireTime: result.expireTime,
        },
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  /**
   * 支付订单
   */
  payOrder: async (req, res) => {
    try {
      const order_id= Number(req.body.order_id);
      const user_id = Number(req.user.user_id); // 从token获取用户ID
      
      if (!order_id) {
        return res.status(400).json({
          success: false,
          message: "订单ID不能为空",
        });
      }

      const result = await orderService.payOrder(order_id, user_id);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          orderId: result.orderId,
        },
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  /**
   * 退票
   */
  refundOrder: async (req, res) => {
    try {
      const { order_id } = req.body
      const userId = Number(req.user.user_id)

      if (!order_id) {
        return res.status(400).json({
          success: false,
          message: "订单ID不能为空",
        });
      }

      const result = await orderService.refundOrder(order_id, userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          orderId: result.orderId,
        },
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  /**
   * 根据用户ID查询订单
   */
  getOrderByUserId: async (req, res) => {
    try {
      const user_id = req.user.user_id

      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: "用户ID不能为空",
        });
      }

      const result = await orderService.getOrderByUserId(user_id);

      res.status(200).json({
        success: true,
        message: "获取订单列表成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  /**
   * 获取订单详情
   */
  getOrderInfo: async (req, res) => {
    try {
      const { order_id } = req.query;
      const user_id = req.user; // 从token获取用户ID

      if (!order_id) {
        return res.status(400).json({
          success: false,
          message: "订单ID不能为空",
        });
      }

      const order = await orderService.getOrderInfo(order_id, user_id);

      res.status(200).json({
        success: true,
        message: "获取订单详情成功",
        data: order,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },

  /**
   * 获取所有订单（管理功能）
   */
  getAllOrder: async (req, res) => {
    try {
      const result = await orderService.getAllOrder();

      res.status(200).json({
        success: true,
        message: "获取订单列表成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
  getAllOrderSeat: async (req, res) => {
    try {
      const result = await orderService.getAllOrderSeat();

      res.status(200).json({
        success: true,
        message: "获取订单列表成功",
        data: result,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
};

module.exports = orderController;
