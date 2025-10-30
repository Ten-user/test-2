import React, { useEffect, useState } from 'react';
import api from './api';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data from backend
  const fetchData = async (searchParam = '', dateParam = '') => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (searchParam.trim()) queryParams.append('search', searchParam.trim());
      if (dateParam) queryParams.append('date', dateParam);

      const path = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await api.get(path);
      setRecords(data || []);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError('Failed to fetch attendance records. Please try again later.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchData();

    // Listen for new attendance additions
    const handler = () => fetchData();
    window.addEventListener('attendance-updated', handler);
    return () => window.removeEventListener('attendance-updated', handler);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/${id}`);
      fetchData(search, dateFilter); // refresh after delete
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert('Failed to delete this record.');
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchData(search, dateFilter); // fetch only when filter button is pressed
  };

  // ✅ Restrict search input to only letters, numbers, and spaces
  const handleSearchChange = (e) => {
    const value = e.target.value;
    const validValue = value.replace(/[^a-zA-Z0-9\s]/g, ''); // block special chars
    setSearch(validValue);
  };

  const formatDate = (d) => new Date(d).toISOString().split('T')[0];

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Attendance Dashboard</h5>

        <form className="row g-2 mb-3" onSubmit={handleFilter}>
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Search name or ID"
              value={search}
              onChange={handleSearchChange}
              title="Only letters, numbers, and spaces are allowed"
            />
          </div>
          <div className="col-4">
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <div className="col-2 d-grid">
            <button className="btn btn-outline-primary" type="submit" disabled={loading}>
              {loading ? 'Filtering...' : 'Filter'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger py-2">{error}</div>}

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
                      No records found
                    </td>
                  </tr>
                )}
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.date)}</td>
                    <td>{r.employee_name}</td>
                    <td>{r.employee_id}</td>
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
