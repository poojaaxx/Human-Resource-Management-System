import { api } from './client'

export const getAllLeaves = () => api.get('/leaves').then((r) => r.data)

export const getLeavesByEmployee = (employeeId) =>
  api.get(`/leaves/employee/${employeeId}`).then((r) => r.data)

export const applyLeave = (payload) => api.post('/leaves', payload).then((r) => r.data)

export const updateLeave = (id, payload) => api.put(`/leaves/${id}`, payload).then((r) => r.data)

export const deleteLeave = (id) => api.delete(`/leaves/${id}`).then((r) => r.data)

export const approveLeave = (id) => api.put(`/leaves/approve/${id}`).then((r) => r.data)

export const rejectLeave = (id) => api.put(`/leaves/reject/${id}`).then((r) => r.data)
