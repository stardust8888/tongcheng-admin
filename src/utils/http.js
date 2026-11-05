import axios from 'axios'
import { message } from 'antd'
import { getToken, logout } from './auth'

const http = axios.create({
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 200) {
      return res
    }
    // 401 HTTP 未授权，或 10004 后端 CodeUnauthorized（token 无效/过期/无权限）
    if (res.code === 401 || res.code === 10004) {
      logout()
      window.location.href = '/login'
      return Promise.reject(new Error('登录已过期'))
    }
    message.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    message.error('网络错误，请重试')
    return Promise.reject(error)
  }
)

export default http
