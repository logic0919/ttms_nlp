import request from '@/utils/request'

// 注册：传 user_id 和 pwd
const userRegisterService = (obj) =>
  request.post('/api/user/register', { user_id: obj.id, pwd: obj.pwd })

// 登录：传 user_id 和 pwd，后端返回 { success, data: { token, user_id, status } }
const userLoginService = (obj) =>
  request.post('/api/user/login', { user_id: obj.user_id, pwd: obj.pwd })

// 自动登录（parsetoken）：从 header 中读 token，返回 { data: { user_id, isexp, token, status } }
const userParseTokenService = () => request.get('/api/user/parsetoken')

export { userRegisterService, userLoginService, userParseTokenService }

