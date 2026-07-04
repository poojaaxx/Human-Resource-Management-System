import { api } from './client'

export const getMyAttendance = () => api.get('/attendance/me').then((r) => r.data)

export const checkIn = () => api.post('/attendance/checkin').then((r) => r.data)

export const checkOut = () => api.post('/attendance/checkout').then((r) => r.data)

export const setDayStatus = (date, status) =>
  api.put('/attendance/day', { date, status }).then((r) => r.data)
