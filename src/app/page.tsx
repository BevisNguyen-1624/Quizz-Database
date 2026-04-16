'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { Search, Trash2, ArrowUpDown, RefreshCw, User, Trophy, Calendar } from 'lucide-react';

interface QuizResult {
  _id: string;
  userId: string;
  score: number;
  timestamp: string;
}

export default function Home() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/results?search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch results', error);
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      const res = await fetch(`/api/results/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchResults();
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Failed to delete', error);
      alert('An error occurred');
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Calculate stats
  const totalEntries = results.length;
  const uniqueUsers = new Set(results.map(r => r.userId)).size;
  const avgScore = totalEntries > 0 ? (results.reduce((acc, r) => acc + r.score, 0) / totalEntries).toFixed(1) : 0;

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="title">Quiz Dashboard</h1>
          <p className="subtitle">Database management for BinhNH Quiz application</p>
        </div>
        <div className="controls">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by Employee ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="refresh-btn" 
            onClick={fetchResults}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total Submissions</div>
          <div className="stat-value">{totalEntries}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique Participants</div>
          <div className="stat-value">{uniqueUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Score</div>
          <div className="stat-value">{avgScore}</div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('userId')}>
                  <div className="th-content">
                    <User size={16} /> Employee ID <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort('score')}>
                  <div className="th-content">
                    <Trophy size={16} /> Score <ArrowUpDown size={14} />
                  </div>
                </th>
                <th onClick={() => handleSort('timestamp')}>
                  <div className="th-content">
                    <Calendar size={16} /> Date Submitted <ArrowUpDown size={14} />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="loader">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      No results found matching your criteria.
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result._id}>
                    <td>
                      <span className="employee-badge">
                        <User size={14} />
                        {result.userId}
                      </span>
                    </td>
                    <td>
                      <span className={`score-badge ${result.score > 8 ? 'score-high' : result.score > 5 ? 'score-med' : 'score-low'}`}>
                        {result.score} pts
                      </span>
                    </td>
                    <td>
                      {format(new Date(result.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td>
                      <button 
                        className="action-btn"
                        onClick={() => handleDelete(result._id)}
                        title="Delete record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
