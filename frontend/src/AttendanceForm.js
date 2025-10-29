import React, { useState } from 'react';
import api from './api';

export default function AttendanceForm() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeID, setEmployeeID] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('Present');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success'); // 'success' or 'error'

  const submit = async (e) => {
    e.preventDefault();

    if (!employeeName || !employeeID) {
      setMsgType('error');
      setMsg('Please provide name and ID.');
      return;
    }

    try {
      await api.post('/attendance', { employeeName, employeeID, date, status });
      setMsgType('success');
      setMsg('Attendance recorded.');
      setEmployeeName('');
      setEmployeeID('');
      setStatus('Present');
      setDate(new Date().toISOString().slice(0, 10));
      window.dispatchEvent(new Event('attendance-updated'));
    } catch (err) {
      console.error(err);
      setMsgType('error');
      setMsg('Failed to submit attendance.');
    }
  };

  // Real-time input handlers
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only letters and spaces allowed
    const filtered = value.replace(/[^a-zA-Z\s]/g, '');
    setEmployeeName(filtered);
  };

  const handleIDChange = (e) => {
    const value = e.target.value;
    // Only numbers allowed
    const filtered = value.replace(/[^0-9]/g, '');
    setEmployeeID(filtered);
  };

  return (
    <form onSubmit={submit}>
      <div className="mb-3">
        <label className="form-label">Employee Name</label>
        <input
          className="form-control"
          value={employeeName}
          onChange={handleNameChange}
          placeholder="Enter name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Employee ID</label>
        <input
          className="form-control"
          value={employeeID}
          onChange={handleIDChange}
          placeholder="Enter ID"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option>Present</option>
          <option>Absent</option>
        </select>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" type="submit">Mark Attendance</button>
        {msg && (
          <small className={msgType === 'success' ? 'text-success' : 'text-danger'}>
            {msg}
          </small>
        )}
      </div>
    </form>
  );
}
