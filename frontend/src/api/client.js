import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hrms_token')
      localStorage.removeItem('hrms_user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data
  if (!data) return error?.message || fallback
  if (typeof data === 'string') return data
  if (data.message) return data.message
  if (Array.isArray(data.errors) && data.errors.length) return data.errors[0]
  return fallback
}
