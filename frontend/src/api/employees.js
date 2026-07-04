import { api } from './client'

export const getEmployees = () => api.get('/employees').then((r) => r.data)

export const getMyEmployee = () => api.get('/employees/me').then((r) => r.data)

export const getEmployee = (id) => api.get(`/employees/${id}`).then((r) => r.data)

export const searchEmployees = (name) =>
  api.get('/employees/search', { params: { name } }).then((r) => r.data)

export const createEmployee = (payload) => api.post('/employees', payload).then((r) => r.data)

export const updateEmployee = (id, payload) =>
  api.put(`/employees/${id}`, payload).then((r) => r.data)

export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then((r) => r.data)

export const updateMyContact = (payload) =>
  api.put('/employees/me/contact', payload).then((r) => r.data)

export const updateDepartment = (id, department) =>
  api.put(`/employees/${id}/department`, { department }).then((r) => r.data)

export const getHrStaff = () => api.get('/employees/hr-staff').then((r) => r.data)
