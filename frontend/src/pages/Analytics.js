import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { uploadAndRunETL, getMostBorrowed, getCategoryTrends, getMonthlyTrends, getOverdue } from '../services/analyticsService';

const FILE_CONFIGS = [
  { key: 'books',        label: 'Books CSV',        hint: 'books.csv',        icon: '📖' },
  { key: 'borrowers',    label: 'Borrowers CSV',     hint: 'borrowers.csv',    icon: '👥' },
  { key: 'transactions', label: 'Transactions CSV',  hint: 'transactions.csv', icon: '🔄' },
];

function FilePicker({ icon, label, hint, file, onChange, inputRef }) {
  return (
    <div style={{
      flex: 1, minWidth: '200px',
      border: `2px dashed ${file ? '#059669' : '#d1d5db'}`,
      borderRadius: '10px',
      padding: '0.9rem 1rem',
      background: file ? '#f0fdf4' : '#fafafa',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#374151' }}>{label}</span>
        {file && <span style={{ marginLeft: 'auto', color: '#059669', fontSize: '0.75rem' }}>✓ Ready</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={onChange}
        style={{ fontSize: '0.78rem', width: '100%', cursor: 'pointer' }}
      />
      {file ? (
        <p style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.35rem', marginBottom: 0 }}>
          {file.name} <span style={{ color: '#6b7280' }}>({(file.size / 1024).toFixed(1)} KB)</span>
        </p>
      ) : (
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.35rem', marginBottom: 0 }}>
          Expected: <em>{hint}</em>
        </p>
      )}
    </div>
  );
}

function Analytics() {
  const [mostBorrowed,    setMostBorrowed]    = useState([]);
  const [categoryTrends,  setCategoryTrends]  = useState([]);
  const [monthlyTrends,   setMonthlyTrends]   = useState([]);
  const [overdue,         setOverdue]         = useState([]);
  const [etlMsg,          setEtlMsg]          = useState(null);
  const [etlLoading,      setEtlLoading]      = useState(false);
  const [loading,         setLoading]         = useState(true);

  const [booksFile,        setBooksFile]        = useState(null);
  const [borrowersFile,    setBorrowersFile]    = useState(null);
  const [transactionsFile, setTransactionsFile] = useState(null);

  const booksRef        = useRef(null);
  const borrowersRef    = useRef(null);
  const transactionsRef = useRef(null);

  const allSelected = booksFile && borrowersFile && transactionsFile;

  function loadAll() {
    setLoading(true);
    Promise.all([getMostBorrowed(), getCategoryTrends(), getMonthlyTrends(), getOverdue()])
      .then(([mb, ct, mt, od]) => {
        setMostBorrowed(mb.data);
        setCategoryTrends(ct.data);
        setMonthlyTrends(mt.data);
        setOverdue(od.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadAll(); }, []);

  function clearFiles() {
    setBooksFile(null);
    setBorrowersFile(null);
    setTransactionsFile(null);
    [booksRef, borrowersRef, transactionsRef].forEach(r => { if (r.current) r.current.value = ''; });
  }

  function handleUploadETL() {
    if (!allSelected) return;
    setEtlLoading(true);
    setEtlMsg(null);
    uploadAndRunETL(booksFile, borrowersFile, transactionsFile)
      .then(res => {
        setEtlMsg({ text: res.data.message, type: 'success' });
        clearFiles();
        loadAll();
      })
      .catch(err => {
        const detail = err.response?.data?.detail || 'ETL pipeline failed.';
        setEtlMsg({ text: detail, type: 'error' });
      })
      .finally(() => setEtlLoading(false));
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Analytics & Reports</h1>
      </div>

      {/* ETL Upload Panel */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-title">⚙️ ETL Pipeline — Upload Datasets</div>
        <p style={{ fontSize: '0.83rem', color: '#6b7280', marginBottom: '1rem' }}>
          Generate the 3 CSV files using <code>python -m etl.generate_raw_datasets</code> from the <code>backend/</code> folder, then upload all three below.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <FilePicker icon="📖" label="Books CSV"       hint="books.csv"
            file={booksFile}        onChange={e => setBooksFile(e.target.files[0] || null)}
            inputRef={booksRef} />
          <FilePicker icon="👥" label="Borrowers CSV"   hint="borrowers.csv"
            file={borrowersFile}    onChange={e => setBorrowersFile(e.target.files[0] || null)}
            inputRef={borrowersRef} />
          <FilePicker icon="🔄" label="Transactions CSV" hint="transactions.csv"
            file={transactionsFile} onChange={e => setTransactionsFile(e.target.files[0] || null)}
            inputRef={transactionsRef} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleUploadETL}
            disabled={etlLoading || !allSelected}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {etlLoading ? '⏳ Running...' : '▶ Upload & Run ETL'}
          </button>
          {!allSelected && !etlLoading && (
            <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
              {[!booksFile && 'Books', !borrowersFile && 'Borrowers', !transactionsFile && 'Transactions']
                .filter(Boolean).join(', ')} CSV missing
            </span>
          )}
        </div>
        {etlMsg && (
          <div className={`alert alert-${etlMsg.type}`} style={{ marginTop: '0.75rem', marginBottom: 0 }}>
            {etlMsg.text}
          </div>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#888' }}>Loading analytics...</p>
      ) : (
        <>
          {/* Most Borrowed Books */}
          <div className="card">
            <div className="card-title">📊 Most Borrowed Books (Top 10)</div>
            {mostBorrowed.length === 0 ? (
              <p style={{ color: '#888', fontSize: '0.875rem' }}>No data — upload the 3 CSVs and run the ETL pipeline first.</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mostBorrowed} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="book_title" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="borrow_count" fill="#059669" radius={[4, 4, 0, 0]} name="Borrows" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.75rem' }}>
            {/* Category Trends */}
            <div className="card">
              <div className="card-title">📚 Category-wise Borrowing</div>
              {categoryTrends.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.875rem' }}>No data — run ETL first.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryTrends} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="borrow_count" fill="#10b981" radius={[0, 4, 4, 0]} name="Borrows" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Monthly Trends */}
            <div className="card">
              <div className="card-title">📈 Monthly Borrowing Trends</div>
              {monthlyTrends.length === 0 ? (
                <p style={{ color: '#888', fontSize: '0.875rem' }}>No data — run ETL first.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={monthlyTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month_year" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="borrow_count" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="Borrows" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Overdue Transactions */}
          <div className="card" style={{ marginTop: '1.75rem' }}>
            <div className="card-title">⚠️ Overdue Transactions</div>
            {overdue.length === 0 ? (
              <p style={{ color: '#888', fontSize: '0.875rem' }}>No overdue transactions found.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th><th>Book</th><th>Borrower</th><th>Borrow Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdue.map((tx, i) => (
                      <tr key={i}>
                        <td>{tx.transaction_id}</td>
                        <td>{tx.book_title}</td>
                        <td>{tx.borrower_name}</td>
                        <td>{new Date(tx.borrow_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;
