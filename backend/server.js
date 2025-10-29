require('dotenv').config();
const express = require('express');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => res.send({status: 'Attendance API running'}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
