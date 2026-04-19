import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/index'

const baseURL = 'http://localhost:8080'

const instance = axios.create({ baseURL, timeout: 100000 })

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    } else if (userStore.getlocalToken()) {
      config.headers.Authorization = userStore.getlocalToken()
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    if (res.data.success === true) return res
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({ message: err.response?.data?.message || '服务异常', type: 'error' })
    if (err.response?.status === 401) router.push('/login')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
