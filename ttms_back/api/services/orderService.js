// 订单服务层（业务逻辑）
const orderModel = require("../models/orderModel.js");
const sessionModel = require("../models/sessionModel.js");

const orderService = {
  /**
   * 锁定座位
   */
  lockSeat: async (orderData) => {
    // 检查场次是否存在

    const { seat, user_id, session_id } = orderData;
    const session = await sessionModel.findById(session_id);

    if (session.length === 0) {
      throw new Error("场次不存在");
    }

    // 检查座位是否被占用
    const checkPromises = seat.map((seat) => {
      return orderModel.findBySessionAndSeat(session_id, seat[0], seat[1]);
    });
    const checkResults = await Promise.all(checkPromises);

    const hasOccupiedSeat = checkResults.some((result) => result === 1);
    if (hasOccupiedSeat) {
      // 找出具体哪些座位被占用（可选，用于详细错误信息）
      const occupiedSeats = [];
      seat.forEach((seatItem, index) => {
        if (checkResults[index] === 1) {
          occupiedSeats.push(`${seatItem[0]}排${seatItem[1]}座`);
        }
      });

      throw new Error(`以下座位已被占用：${occupiedSeats.join("、")}`);
    }

    // 锁座
    const now = new Date();
    const after15Min = new Date(now.getTime() + 15 * 60 * 1000);

    // 格式化为 'YYYY-MM-DD HH:MM:SS'
    const year = after15Min.getFullYear();
    const month = String(after15Min.getMonth() + 1).padStart(2, "0");
    const day = String(after15Min.getDate()).padStart(2, "0");
    const hours = String(after15Min.getHours()).padStart(2, "0");
    const minutes = String(after15Min.getMinutes()).padStart(2, "0");
    const seconds = String(after15Min.getSeconds()).padStart(2, "0");

    const obj = {
      user_id,
      session_id,
      price: session[0].price * seat.length,
      exp: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
      status: 1,
      seat,
    };
    const result = await orderModel.lockSeat(obj);
    if (result.seatCount == 0) {
      throw new Error("锁座失败");
    }

    return {
      message: "锁座成功",
      order_id: result.orderId,
      expireTime: new Date(Date.now() + 15 * 60 * 1000), // 15分钟后过期
      status: 200,
    };
  },

  /**
   * 支付订单
   */
  payOrder: async (orderId, userId) => {
    // 验证订单是否存在且属于当前用户
    const order = await orderModel.findById(userId, orderId);
    if (order.length === 0) {
      throw new Error("订单不存在");
    }
    if (order.data.user_id != userId) {
      throw new Error("无权操作此订单");
    }
    // 检查订单状态和是否过期
    const isValid = await orderModel.isValidOrder(orderId);
    if (!isValid) {
      throw new Error("无法支付");
    }
    const result = await orderModel.payOrder(orderId);
    if (result.affectedRows !== 1) {
      throw new Error("支付失败");
    }

    return {
      message: "支付成功",
      orderId: orderId,
      status: 200,
    };
  },

  /**
   * 退票
   */
  refundOrder: async (orderId, userId) => {
    // 验证订单是否存在且属于当前用户
    const order = await orderModel.findById(userId,orderId);
    if (order.length === 0) {
      throw new Error("订单不存在");
    }
    console.log(order);
    
    if (order.data.user_id != userId) {
      throw new Error("无权操作此订单");
    }

    // 检查订单是否可以退票（已支付的订单才能退票）
    if (order.data.status !== 1||order.data.exp!='3000-01-01 00:00:00') {
      throw new Error("订单状态不允许退票");
    }

    const result = await orderModel.refundOrder(orderId);
    if (result.affectedRows !== 1) {
      throw new Error("退票失败");
    }

    return {
      message: "退票成功",
      orderId: orderId,
      status: 200,
    };
  },

  /**
   * 根据用户ID查询订单
   */
  getOrderByUserId: async (userId) => {
    const orders = await orderModel.findByUserId(userId);
    console.log(orders);
    
    return {
      orders,
      total: orders.length,
      status: 200,
    };
  },

  /**
   * 获取订单详情
   */
  getOrderInfo: async (orderId, userId) => {
    // order_id->session_id->movie_id->chinese_name stime
    //                     ->hall_id->name
    //         ->row col
    //         ->price
    const user_id = Number(userId.user_id);
    const order_id = Number(orderId);
    const order = await orderModel.findById(user_id, order_id);    
    /*
      console.log(order);
      {
        success: true,
        data: {
          order_id: 13,
          movie_name: 'a',
          session_start_time: 2026-01-30T13:10:00.000Z,
          session_end_time: 2026-01-30T14:10:00.000Z,
          hall_name: '哈',
          order_price: 12,
          seats: [ [Array] ],
          user_id: 2,
          status: 1,
          exp: '2026-01-30 15:05:09'
        }
      }
    */
    if (!order.success) {
      throw new Error("订单无效");
    }

    if (order.data.user_id != user_id) {
      throw new Error("无权查看此订单");
    }
    return order.data;
  },

  /**
   * 获取所有订单（管理功能）
   */
  getAllOrder: async () => {
    const orders = await orderModel.findAllOrder();
    return {
      orders,
      total: orders.length,
      status: 200,
    };
  },
  getAllOrderSeat: async () => {
    const orders = await orderModel.findAllOrderSeat();
    return {
      orders,
      total: orders.length,
      status: 200,
    };
  },
};

module.exports = orderService;
