// 订单相关路由
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');
const { verifyToken } = require('../middleware/auth.js');
// 锁定座位（需要登录）
router.post('/lock', verifyToken, orderController.lockSeat);

// 支付订单（需要登录）
router.post('/pay', verifyToken, orderController.payOrder);

// 退票（需要登录）
router.post('/refund', verifyToken, orderController.refundOrder);

// 获取用户订单列表（需要登录）
router.get('/getbyuserid', verifyToken, orderController.getOrderByUserId);

// 获取订单详情（需要登录）
router.get('/getinfo', verifyToken, orderController.getOrderInfo);

// 获取所有订单（管理员权限）
router.get('/all', verifyToken, orderController.getAllOrders);

module.exports = router;