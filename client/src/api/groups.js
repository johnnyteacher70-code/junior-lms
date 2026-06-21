import api from './axios';

export const getGroups          = ()           => api.get('/groups');
export const getGroup           = (id)         => api.get(`/groups/${id}`);
export const createGroup        = (data)       => api.post('/groups', data);
export const updateGroup        = (id, data)   => api.put(`/groups/${id}`, data);
export const deleteGroup        = (id)         => api.delete(`/groups/${id}`);
export const addStudent         = (id, data)   => api.post(`/groups/${id}/students`, data);
export const removeStudent      = (id, sid)    => api.delete(`/groups/${id}/students/${sid}`);
export const getAvailableStudents = (id)       => api.get(`/groups/${id}/available-students`);
export const getTeachers        = ()           => api.get('/groups/teachers');
export const getMyGroups        = ()           => api.get('/groups/teacher/my');
export const getMyGroup         = ()           => api.get('/groups/student/my');
