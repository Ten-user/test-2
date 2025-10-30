import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import AttendanceForm from './AttendanceForm';
import Dashboard from './Dashboard';
import './styles.css'; 

export default function App() {
  return (
    <Router>
      <div className="container my-5">

        {/* Header & Navbar */}
        <header className="mb-4">
          <h1 className="display-6">Employee Attendance Tracker</h1>
         
          <nav className="navbar navbar-expand-lg navbar-light bg-light rounded mb-4">
            <div className="container-fluid">
              <div className="navbar-nav">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-bold text-primary" : "")
                  }
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/attendance"
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " active fw-bold text-primary" : "")
                  }
                >
                  Attendance
                </NavLink>
              </div>
            </div>
          </nav>
        </header>

        {/* Page content */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/attendance"
            element={
              <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '500px' }}>
                <AttendanceForm />
              </div>
            }
          />
        </Routes>

        {/* Footer */}
        <footer>
          <p>
            &copy; {new Date().getFullYear()} Employee Attendance Tracker. |  
            <a> Contact us here: +266 6349 9075</a>
          </p>
        </footer>
      </div>
    </Router>
  );
}
