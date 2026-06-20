import api from './axios';

export const getAssignments = (courseId) => api.get(`/courses/${courseId}/assignments`);
export const createAssignment = (courseId, data) => api.post(`/courses/${courseId}/assignments`, data);
export const updateAssignment = (courseId, id, data) => api.put(`/courses/${courseId}/assignments/${id}`, data);
export const deleteAssignment = (courseId, id) => api.delete(`/courses/${courseId}/assignments/${id}`);
export const submitAssignment = (courseId, id, data) => api.post(`/courses/${courseId}/assignments/${id}/submit`, data);
export const getSubmissions = (courseId, id) => api.get(`/courses/${courseId}/assignments/${id}/submissions`);
export const gradeSubmission = (id, data) => api.patch(`/enrollments/submissions/${id}/grade`, data);
export const getMySubmissions = () => api.get('/enrollments/my-submissions');
