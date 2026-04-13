import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 5个数据
  const token = ref('')
  const id = ref('')
  const email = ref('')
  const name = ref('')
  const avatar = ref('')
  const status = ref('')
  // 6个set函数
  const setToken = (usertoken) => {
    token.value = usertoken
  }
  const setId = (userid) => {
    id.value = userid
  }
  const setEmail = (useremail) => {
    email.value = useremail
  }
  const setName = (username) => {
    name.value = username
  }
  const setAvatar = (useravatar) => {
    avatar.value = useravatar
  }
  const setStatus = (userstatus) => {
    status.value = userstatus
  }
  // 全部set函数
  const setAll = (obj) => {
    setToken(obj.token)
    setId(obj.id)
    setEmail(obj.email)
    setName(obj.name)
    setAvatar(obj.avatar)
    setStatus(obj.status)
  }
  const getlocalTime = () => {
    return localStorage.getItem('ttms_time')
  }
  const setlocalTime = () => {
    const time = new Date().getTime()
    localStorage.setItem('ttms_time', time)
  }
  const setlocalToken = (usertoken) => {
    localStorage.setItem('ttms_token', usertoken)
  }
  const getlocalToken = () => {
    return localStorage.getItem('ttms_token')
  }
  // 1个清除local函数
  const clearAll = () => {
    localStorage.clear('ttms_token')
    localStorage.clear('ttms_time')
  }
  return {
    token,
    setToken,
    id,
    setId,
    email,
    setEmail,
    name,
    setName,
    avatar,
    setAvatar,
    status,
    setStatus,
    setAll,
    getlocalToken,
    getlocalTime,
    setlocalToken,
    setlocalTime,
    clearAll
  }
})
