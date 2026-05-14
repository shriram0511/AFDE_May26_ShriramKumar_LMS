import API from './api';

export const getTransactions = () => API.get('/transactions');
export const borrowBook = (data) => API.post('/borrow', data);
export const returnBook = (data) => API.post('/return', data);
