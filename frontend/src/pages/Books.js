import React, { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/bookService';

const emptyForm = { title: '', author: '', category: '', isbn: '', availability_status: 'available' };

function BookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState(book || emptyForm);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.category.trim() || !form.isbn.trim()) {
      setError('Title, Author, Category and ISBN are required.');
      return;
    }
    if (!/^\d+$/.test(form.isbn.trim())) {
      setError('ISBN must contain numbers only.');
      return;
    }
    const trimmed = {
      ...form,
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      isbn: form.isbn.trim(),
    };
    onSave(trimmed, setError);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{book ? 'Edit Book' : 'Add Book'}</span>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Book title" />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input name="author" value={form.author} onChange={handleChange} placeholder="Author name" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Fiction" />
            </div>
            <div className="form-group">
              <label>ISBN * (numbers only)</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="e.g. 9780132350884" />
            </div>
          </div>
          {book && (
            <div className="form-row">
              <div className="form-group">
                <label>Availability</label>
                <select name="availability_status" value={form.availability_status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                </select>
              </div>
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{book ? 'Update' : 'Add'} Book</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Books() {
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState(null);
  const [msg, setMsg] = useState(null);

  function load() {
    getBooks().then(res => setBooks(res.data));
  }

  useEffect(() => { load(); }, []);

  function showMsg(text, type = 'success') {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  }

  function handleSave(form, setError) {
    const call = modal.book
      ? updateBook(modal.book.book_id, form)
      : createBook(form);
    call.then(() => {
      load();
      setModal(null);
      showMsg(modal.book ? 'Book updated.' : 'Book added.');
    }).catch((err) => setError(err.response?.data?.detail || 'Operation failed.'));
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this book?')) return;
    deleteBook(id).then(() => { load(); showMsg('Book deleted.'); })
      .catch(() => showMsg('Delete failed.', 'error'));
  }

  return (
    <div className="page">
      <div className="top-bar">
        <h1 className="page-title" style={{ margin: 0 }}>Book Management</h1>
        <button className="btn btn-primary" onClick={() => setModal({ book: null })}>+ Add Book</button>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No books found.</td></tr>
              )}
              {books.map(book => (
                <tr key={book.book_id}>
                  <td>{book.book_id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category || '—'}</td>
                  <td>{book.isbn || '—'}</td>
                  <td>
                    <span className={`badge badge-${book.availability_status}`}>
                      {book.availability_status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-warning btn-sm" onClick={() => setModal({ book })}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book.book_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <BookModal
          book={modal.book}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Books;
