require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

const app = express();

connectDB();

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/courses', require('./src/routes/courses'));
app.use('/api/lessons', require('./src/routes/lessons'));
app.use('/api/assignments', require('./src/routes/assignments'));
app.use('/api/enrollments', require('./src/routes/enrollments'));
app.use('/api/admin', require('./src/routes/admin'));

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
