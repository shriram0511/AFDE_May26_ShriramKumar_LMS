import API from './api';

export const getBorrowers = () => API.get('/borrowers/');
export const createBorrower = (data) => API.post('/borrowers/', data);
export const updateBorrower = (id, data) => API.put(`/borrowers/${id}`, data);
export const deleteBorrower = (id) => API.delete(`/borrowers/${id}`);
