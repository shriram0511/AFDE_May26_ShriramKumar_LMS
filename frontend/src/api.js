import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

export const getBooks = () => API.get('/books/');
export const getBook = (id) => API.get(`/books/${id}`);
export const createBook = (data) => API.post('/books/', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

export const getBorrowers = () => API.get('/borrowers/');
export const createBorrower = (data) => API.post('/borrowers/', data);
export const updateBorrower = (id, data) => API.put(`/borrowers/${id}`, data);
export const deleteBorrower = (id) => API.delete(`/borrowers/${id}`);

export const getTransactions = () => API.get('/transactions');
export const borrowBook = (data) => API.post('/borrow', data);
export const returnBook = (data) => API.post('/return', data);

export const searchBooks = (q) => API.get(`/search?q=${encodeURIComponent(q)}`);
