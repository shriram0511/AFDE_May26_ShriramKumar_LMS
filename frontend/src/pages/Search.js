import React, { useState, useEffect, useRef } from 'react';
import { searchBooks } from '../services/bookService';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      searchBooks(query)
        .then(res => {
          setResults(res.data);
          setSearched(true);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="page">
      <h1 className="page-title">Search Books</h1>

      <div className="card">
        <div className="search-bar">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, author, or category..."
          />
          {loading && <span style={{ color: '#888', alignSelf: 'center', fontSize: '0.9rem' }}>Searching...</span>}
        </div>
      </div>

      {searched && (
        <div className="card">
          <div className="card-title">
            Results {results.length > 0 ? `(${results.length} found)` : ''}
          </div>
          {results.length === 0 ? (
            <p style={{ color: '#888' }}>No books found for "{query}".</p>
          ) : (
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
                  </tr>
                </thead>
                <tbody>
                  {results.map(book => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
