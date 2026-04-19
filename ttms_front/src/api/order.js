import request from '@/utils/request'

// 锁座（需要登录 token）
// seat 格式：[[row, col], [row, col], ...]
// 后端从 token 解析 user_id，无需前端传
// 返回 { data: { order_id, expireTime } }
const orderSetService = (session_id, seat) => {
  return request.post('/api/order/lock', { session_id, seat })
}

// 获取订单详情（需要登录 token），query: order_id
// 返回 { data: { order_id, movie_name, session_start_time, session_end_time, hall_name, order_price, seats, user_id, status, exp } }
const orderConfirmService = (order_id) =>
  request.get('/api/order/getinfo', { params: { order_id } })

// 支付订单（需要登录 token），body: { order_id }
// 返回 { data: { orderId } }
const orderPayService = (order_id) =>
  request.post('/api/order/pay', { order_id })

// 退票（需要登录 token），body: { order_id }
// 返回 { data: { orderId } }
const orderReturnService = (order_id) =>
  request.post('/api/order/refund', { order_id })

// 获取当前登录用户的订单列表（后端从 token 解析 user_id）
// 返回 { data: { orders: [ { order_id, session_id, user_id, exp, status, price, stime, etime, movie_name, movie_img, hall_name, seat_info, seat_positions } ], total } }
const orderGetUserService = () => request.get('/api/order/getbyuserid')

export {
  orderSetService,
  orderConfirmService,
  orderPayService,
  orderReturnService,
  orderGetUserService
}