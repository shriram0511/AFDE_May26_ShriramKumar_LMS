import api from './api';

export const uploadAndRunETL = (booksFile, borrowersFile, transactionsFile) => {
  const formData = new FormData();
  formData.append('books_file', booksFile);
  formData.append('borrowers_file', borrowersFile);
  formData.append('transactions_file', transactionsFile);
  return api.post('/analytics/upload-and-run', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMostBorrowed    = () => api.get('/analytics/most-borrowed');
export const getCategoryTrends  = () => api.get('/analytics/category-trends');
export const getMonthlyTrends   = () => api.get('/analytics/monthly-trends');
export const getOverdue         = () => api.get('/analytics/overdue');
