import React, { useEffect, useState } from 'react';
import { getBorrowers, createBorrower, updateBorrower, deleteBorrower } from '../services/borrowerService';

const emptyForm = { borrower_name: '', email: '', phone: '' };

function BorrowerModal({ borrower, onClose, onSave }) {
  const [form, setForm] = useState(borrower || emptyForm);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.borrower_name.trim()) {
      setError('Borrower name is required.');
      return;
    }
    onSave(form);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{borrower ? 'Edit Borrower' : 'Add Borrower'}</span>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="borrower_name" value={form.borrower_name} onChange={handleChange} placeholder="Full name" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Contact number" />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{borrower ? 'Update' : 'Add'} Borrower</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);
  const [modal, setModal] = useState(null);
  const [msg, setMsg] = useState(null);

  function load() {
    getBorrowers().then(res => setBorrowers(res.data));
  }

  useEffect(() => { load(); }, []);

  function showMsg(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  }

  function handleSave(form) {
    const call = modal.borrower
      ? updateBorrower(modal.borrower.borrower_id, form)
      : createBorrower(form);
    call.then(() => {
      load();
      setModal(null);
      showMsg(modal.borrower ? 'Borrower updated.' : 'Borrower added.');
    }).catch(() => showMsg('Operation failed.', 'error'));
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this borrower?')) return;
    deleteBorrower(id).then(() => { load(); showMsg('Borrower deleted.'); })
      .catch(() => showMsg('Delete failed.', 'error'));
  }

  return (
    <div className="page">
      <div className="top-bar">
        <h1 className="page-title" style={{ margin: 0 }}>Borrower Management</h1>
        <button className="btn btn-primary" onClick={() => setModal({ borrower: null })}>+ Add Borrower</button>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No borrowers found.</td></tr>
              )}
              {borrowers.map(b => (
                <tr key={b.borrower_id}>
                  <td>{b.borrower_id}</td>
                  <td>{b.borrower_name}</td>
                  <td>{b.email || '—'}</td>
                  <td>{b.phone || '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-warning btn-sm" onClick={() => setModal({ borrower: b })}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.borrower_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <BorrowerModal
          borrower={modal.borrower}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Borrowers;
