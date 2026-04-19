import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const id = ref('')
  const status = ref('')

  const setToken = (usertoken) => {
    token.value = usertoken
  }
  const setId = (userid) => {
    id.value = userid
  }
  const setStatus = (userstatus) => {
    status.value = userstatus
  }

  const setAll = (obj) => {
    setToken(obj.token || '')
    setId(obj.id || '')
    setStatus(obj.status || '')
  }

  const setlocalToken = (usertoken) => {
    localStorage.setItem('ttms_token', usertoken)
  }
  const getlocalToken = () => {
    return localStorage.getItem('ttms_token')
  }
  const setlocalId = (userid) => {
    localStorage.setItem('ttms_id', userid)
  }
  const getlocalId = () => {
    return localStorage.getItem('ttms_id')
  }

  const clearAll = () => {
    localStorage.removeItem('ttms_token')
    localStorage.removeItem('ttms_id')
    token.value = ''
    id.value = ''
    status.value = ''
  }

  return {
    token,
    setToken,
    id,
    setId,
    status,
    setStatus,
    setAll,
    getlocalToken,
    setlocalToken,
    getlocalId,
    setlocalId,
    clearAll
  }
})
