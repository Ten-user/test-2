-- SQL to create the Attendance table (Postgres / Neon ready)
CREATE TABLE IF NOT EXISTS Attendance (
  id SERIAL PRIMARY KEY,
  employeeName VARCHAR(255) NOT NULL,
  employeeID VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(10) NOT NULL CHECK (status IN ('Present','Absent'))
);
