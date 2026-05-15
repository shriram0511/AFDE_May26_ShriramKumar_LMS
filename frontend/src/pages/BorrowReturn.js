import React, { useEffect, useState } from 'react';
import { getBooks } from '../services/bookService';
import { getBorrowers } from '../services/borrowerService';
import { getTransactions, borrowBook, returnBook } from '../services/transactionService';

function BorrowReturn({ role = 'admin' }) {
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
      .then(() => { showMsg('Book borrowed successfully!'); setBorrowForm({ book_id: '', borrower_id: '' }); loadAll(); })
      .catch(() => showMsg('Book is not available or request failed.', 'error'));
  }

  function handleReturn(e) {
    e.preventDefault();
    if (!returnForm.transaction_id) {
      showMsg('Please select a transaction.', 'error');
      return;
    }
    returnBook({ transaction_id: Number(returnForm.transaction_id) })
      .then(() => { showMsg('Book returned successfully!'); setReturnForm({ transaction_id: '' }); loadAll(); })
      .catch(() => showMsg('Return failed. Transaction may already be closed.', 'error'));
  }

  const availableBooks = books.filter(b => b.availability_status === 'available');
  const activeTransactions = transactions.filter(tx => !tx.return_date);

  /* ── Admin view: transactions table only ── */
  if (role === 'admin') {
    return (
      <div className="page">
        <h1 className="page-title">Transactions</h1>
        <div className="card">
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

  /* ── User view: borrow / return forms only ── */
  return (
    <div className="page">
      <h1 className="page-title">Borrow / Return</h1>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>

        {/* Borrow Card */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #e8eaf0', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
            padding: '1.5rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{
              width: '46px', height: '46px', background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
            }}>📤</div>
            <div>
              <div style={{ fontFamily: "'Poppins',sans-serif", color: '#fff', fontWeight: '700', fontSize: '1.05rem' }}>
                Borrow a Book
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                {availableBooks.length} book{availableBooks.length !== 1 ? 's' : ''} available
              </div>
            </div>
          </div>
          <form onSubmit={handleBorrow} style={{ padding: '1.75rem' }}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label>Select Book</label>
              <select value={borrowForm.book_id} onChange={e => setBorrowForm({ ...borrowForm, book_id: e.target.value })}>
                <option value="">— Choose available book —</option>
                {availableBooks.map(b => (
                  <option key={b.book_id} value={b.book_id}>{b.title} — {b.author}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Select Borrower</label>
              <select value={borrowForm.borrower_id} onChange={e => setBorrowForm({ ...borrowForm, borrower_id: e.target.value })}>
                <option value="">— Choose borrower —</option>
                {borrowers.map(b => (
                  <option key={b.borrower_id} value={b.borrower_id}>{b.borrower_name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}>
              Borrow Book
            </button>
          </form>
        </div>

        {/* Return Card */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #e8eaf0', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            padding: '1.5rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
          }}>
            <div style={{
              width: '46px', height: '46px', background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
            }}>📥</div>
            <div>
              <div style={{ fontFamily: "'Poppins',sans-serif", color: '#fff', fontWeight: '700', fontSize: '1.05rem' }}>
                Return a Book
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                {activeTransactions.length} active transaction{activeTransactions.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <form onSubmit={handleReturn} style={{ padding: '1.75rem' }}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Select Active Transaction</label>
              <select value={returnForm.transaction_id} onChange={e => setReturnForm({ transaction_id: e.target.value })}>
                <option value="">— Choose transaction —</option>
                {activeTransactions.map(tx => (
                  <option key={tx.transaction_id} value={tx.transaction_id}>
                    #{tx.transaction_id} — {tx.book_title} / {tx.borrower_name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-warning" style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}>
              Return Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BorrowReturn;
