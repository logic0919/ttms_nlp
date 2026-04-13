import { myMessage } from './extend'
const isEmail = (email) => {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  const res = reg.test(email)
  if (!res) {
    myMessage('邮箱格式不正确', 'error')
  }
  return res
}
const isPwd = (pwd) => {
  const reg = /^[a-zA-Z0-9_-]{6,16}$/
  const res = reg.test(pwd)
  if (!res) {
    myMessage('密码格式不正确', 'error')
  }
  return res
}
const isId = (id) => {
  const reg = /^[0-9]{6}$/
  const res = reg.test(id)
  if (!res) {
    myMessage('id格式不正确', 'error')
  }
  return res
}
const isName = (name) => {
  const reg = /^[a-zA-Z0-9_-]{2,16}$/
  const res = reg.test(name)
  if (!res) {
    myMessage('昵称格式不正确', 'error')
  }
  return res
}
export { isEmail, isPwd, isId, isName }
