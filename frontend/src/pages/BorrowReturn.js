import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService';
import { getBorrowers } from '../services/borrowerService';
import { getTransactions, borrowBook, returnBook } from '../services/transactionService';

function BorrowReturn() {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [borrowForm, setBorrowForm] = useState({ book_id: '', borrower_id: '' });
  const [returnForm, setReturnForm] = useState({ transaction_id: '' });
  const [msg, setMsg] = useState(null);

  function loadAll() {
    Promise.all([getBooks(), getBorrowers(), getTransactions()]).then(([b, br, tx]) => {
      setBooks(b.data);
      setBorrowers(br.data);
      setTransactions(tx.data);
    });
  }

  useEffect(() => { loadAll(); }, []);

  function showMsg(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  }

  function handleBorrow(e) {
    e.preventDefault();
    if (!borrowForm.book_id || !borrowForm.borrower_id) {
      showMsg('Please select both a book and a borrower.', 'error');
      return;
    }
    borrowBook({ book_id: Number(borrowForm.book_id), borrower_id: Number(borrowForm.borrower_id) })
      .then(() => {
        showMsg('Book borrowed successfully!');
        setBorrowForm({ book_id: '', borrower_id: '' });
        loadAll();
      })
      .catch(() => showMsg('Book is not available or request failed.', 'error'));
  }

  function handleReturn(e) {
    e.preventDefault();
    if (!returnForm.transaction_id) {
      showMsg('Please select a transaction.', 'error');
      return;
    }
    returnBook({ transaction_id: Number(returnForm.transaction_id) })
      .then(() => {
        showMsg('Book returned successfully!');
        setReturnForm({ transaction_id: '' });
        loadAll();
      })
      .catch(() => showMsg('Return failed. Transaction may already be closed.', 'error'));
  }

  const availableBooks = books.filter(b => b.availability_status === 'available');
  const activeTransactions = transactions.filter(tx => !tx.return_date);

  return (
    <div className="page">
      <h1 className="page-title">Borrow / Return</h1>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Borrow a Book</div>
          <form onSubmit={handleBorrow}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Select Book</label>
              <select
                value={borrowForm.book_id}
                onChange={e => setBorrowForm({ ...borrowForm, book_id: e.target.value })}
              >
                <option value="">-- Choose available book --</option>
                {availableBooks.map(b => (
                  <option key={b.book_id} value={b.book_id}>{b.title} (by {b.author})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Select Borrower</label>
              <select
                value={borrowForm.borrower_id}
                onChange={e => setBorrowForm({ ...borrowForm, borrower_id: e.target.value })}
              >
                <option value="">-- Choose borrower --</option>
                {borrowers.map(b => (
                  <option key={b.borrower_id} value={b.borrower_id}>{b.borrower_name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-success">Borrow Book</button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">Return a Book</div>
          <form onSubmit={handleReturn}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Select Active Transaction</label>
              <select
                value={returnForm.transaction_id}
                onChange={e => setReturnForm({ transaction_id: e.target.value })}
              >
                <option value="">-- Choose transaction --</option>
                {activeTransactions.map(tx => (
                  <option key={tx.transaction_id} value={tx.transaction_id}>
                    #{tx.transaction_id} — {tx.book_title} / {tx.borrower_name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-warning">Return Book</button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">All Transactions</div>
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
              {transactions.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>No transactions yet.</td></tr>
              )}
              {transactions.map(tx => (
                <tr key={tx.transaction_id}>
                  <td>{tx.transaction_id}</td>
                  <td>{tx.book_title}</td>
                  <td>{tx.borrower_name}</td>
                  <td>{new Date(tx.borrow_date).toLocaleDateString()}</td>
                  <td>{tx.return_date ? new Date(tx.return_date).toLocaleDateString() : '—'}</td>
                  <td>
                    <span className={`badge ${tx.return_date ? 'badge-available' : 'badge-borrowed'}`}>
                      {tx.return_date ? 'Returned' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BorrowReturn;
