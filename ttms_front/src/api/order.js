import request from '@/utils/request'
// 创建订单
const orderSetService = (id, seat, movie_id, num) => {
  console.log(id, seat, movie_id, num)
  return request.post('/api/v1/submit-order', {
    session_id: id,
    seat: seat,
    movie_id: movie_id,
    num
  })
}
// 倒计时confirm
// order_id
const orderConfirmService = (order_id) => {
  console.log(order_id)
  return request.post('/api/v1/confirm-order', {
    order_id
  })
}

// 支付pay
// order_id
const orderPayService = (order_id) => {
  return request.post('/api/v1/pay-order', {
    order_id
  })
}

// 退款return
// order_id
const orderReturnService = (order_id) => {
  console.log(order_id)
  return request.delete('/api/v1/return-order', {
    params: { order_id }
  })
}

// get个人订单
// user_id
// 0:待支付
// 1：已支付
// 2：已完成
// 3：已退款

const orderGetUserService = (user_id) => {
  return request.get('/api/v1/user-orders', {
    params: { user_id }
  })
}

export {
  orderSetService,
  orderConfirmService,
  orderPayService,
  orderReturnService,
  orderGetUserService
}
