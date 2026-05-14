import API from './api';

export const getBooks = () => API.get('/books/');
export const getBook = (id) => API.get(`/books/${id}`);
export const createBook = (data) => API.post('/books/', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const searchBooks = (q) => API.get(`/search?q=${encodeURIComponent(q)}`);
