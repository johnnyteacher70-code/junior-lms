import api from './axios';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const publishCourse = (id) => api.patch(`/courses/${id}/publish`);
export const getTeacherCourses = () => api.get('/courses/my');
