import React, { useEffect, useState, useCallback } from 'react';
import api from './api';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // useCallback to prevent recreating the function on every render
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (dateFilter) queryParams.append('date', dateFilter);

      const path = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const data = await api.get(path);
      setRecords(data || []);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [search, dateFilter]);

  useEffect(() => {
    // initial fetch
    fetchData();

    // listen for new attendance events
    const handler = () => fetchData();
    window.addEventListener('attendance-updated', handler);

    return () => window.removeEventListener('attendance-updated', handler);
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete record:', err);
      alert('Failed to delete');
    }
  };

  const formatDate = (d) => new Date(d).toISOString().split('T')[0];

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Attendance Dashboard</h5>

        <form
          className="row g-2 mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            fetchData();
          }}
        >
          <div className="col-6">
            <input
              className="form-control"
              placeholder="Search name or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
