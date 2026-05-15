import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService';
import { getBorrowers } from '../services/borrowerService';
import { getTransactions } from '../services/transactionService';

const statusLabels = {
  active: 'Active',
  returned: 'Returned',
  book_deleted: 'Book Deleted',
  borrower_deleted: 'Borrower Deleted',
};

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      {statusLabels[status] || status}
    </span>
  );
}

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBooks(), getTransactions(), getBorrowers()])
      .then(([booksRes, txRes, borRes]) => {
        setBooks(booksRes.data);
        setTransactions(txRes.data);
        setBorrowers(borRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.availability_status === 'available').length;
  const borrowedBooks = books.filter(b => b.availability_status === 'borrowed').length;

  const bookMap = Object.fromEntries(books.map(b => [b.book_id, b.title]));
  const borrowerMap = Object.fromEntries(borrowers.map(b => [b.borrower_id, b.borrower_name]));

  const recent = [...transactions]
    .sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date))
    .slice(0, 5);

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalBooks}</div>
          <div className="stat-label">Total Books</div>
        </div>
        <div className="stat-card available">
          <div className="stat-value">{availableBooks}</div>
          <div className="stat-label">Available Books</div>
        </div>
        <div className="stat-card borrowed">
          <div className="stat-value">{borrowedBooks}</div>
          <div className="stat-label">Borrowed Books</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{borrowers.length}</div>
          <div className="stat-label">Total Borrowers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{transactions.length}</div>
          <div className="stat-label">Total Transactions</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Transactions</div>
        {recent.length === 0 ? (
          <p style={{ color: '#888' }}>No transactions yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Borrower</th>
                  <th>Borrow Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => (
                  <tr key={tx.transaction_id}>
                    <td>{tx.transaction_id}</td>
                    <td>{bookMap[tx.book_id] || '—'}</td>
                    <td>{borrowerMap[tx.borrower_id] || '—'}</td>
                    <td>{new Date(tx.borrow_date).toLocaleDateString()}</td>
                    <td>{tx.return_date ? new Date(tx.return_date).toLocaleDateString() : '—'}</td>
                    <td><StatusBadge status={tx.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
