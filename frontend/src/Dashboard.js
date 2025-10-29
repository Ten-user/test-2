import React, { useEffect, useState } from 'react';
import api from './api';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search.trim());
      if (dateFilter) params.append('date', dateFilter);
      const data = await api.get('/attendance?' + params.toString());
      setRecords(data || []);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const handler = () => fetchData();
    window.addEventListener('attendance-updated', handler);
    return () => window.removeEventListener('attendance-updated', handler);
  }, []); // eslint-disable-line

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete('/attendance/' + id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const formatDate = (d) => {
    const dateObj = new Date(d);
    return dateObj.toISOString().split('T')[0];
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Attendance Dashboard</h5>

        <form className="row g-2 mb-3" onSubmit={handleSearch}>
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Search name or ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-4">
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            />
          </div>
          <div className="col-2 d-grid">
            <button className="btn btn-outline-primary" type="submit">
              Filter
            </button>
          </div>
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No records
                    </td>
                  </tr>
                )}
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.date)}</td>
                    <td>{r.employeeName}</td>
                    <td>{r.employeeID}</td>
                    <td>{r.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </td>
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
