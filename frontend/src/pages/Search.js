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
        .then(res => { setResults(res.data); setSearched(true); })
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="page">
      <h1 className="page-title">Search Books</h1>

      {/* Search Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(5,150,105,0.25)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔎</div>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          color: '#fff', fontSize: '1.4rem', fontWeight: '700',
          marginBottom: '0.4rem',
        }}>Find a Book</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Search by title, author or category
        </p>

        {/* Search Input */}
        <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
          <span style={{
            position: 'absolute', left: '1rem', top: '50%',
            transform: 'translateY(-50%)', fontSize: '1.1rem', pointerEvents: 'none',
          }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '0.95rem',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              fontFamily: 'Inter, sans-serif',
              color: '#1a1d23',
            }}
          />
          {loading && (
            <span style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#9ca3af',
            }}>Searching...</span>
          )}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}>
            <h3 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1rem', fontWeight: '700', color: '#064e3b',
            }}>
              {results.length > 0 ? `${results.length} result${results.length > 1 ? 's' : ''} for "${query}"` : `No results for "${query}"`}
            </h3>
          </div>

          {results.length === 0 ? (
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '3rem 2rem',
              textAlign: 'center', border: '1px solid #e8eaf0',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
                No books found
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Try a different title, author or category
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}>
              {results.map(book => (
                <div key={book.book_id} style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  border: '1px solid #e8eaf0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(5,150,105,0.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px',
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem', marginBottom: '1rem',
                  }}>📖</div>

                  <div style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '700', fontSize: '0.95rem',
                    color: '#0f172a', marginBottom: '0.3rem',
                    lineHeight: '1.4',
                  }}>{book.title}</div>

                  <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    by {book.author}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {book.category && (
                      <span style={{
                        background: '#f0fdf4', color: '#065f46',
                        padding: '0.2rem 0.65rem', borderRadius: '20px',
                        fontSize: '0.75rem', fontWeight: '600', border: '1px solid #d1fae5',
                      }}>{book.category}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      ISBN: {book.isbn || '—'}
                    </span>
                    <span className={`badge badge-${book.availability_status}`}>
                      {book.availability_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '3rem 2rem',
          textAlign: 'center', border: '1px solid #e8eaf0',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '600', color: '#374151', marginBottom: '0.4rem' }}>
            Start typing to search
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            Results will appear as you type
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
