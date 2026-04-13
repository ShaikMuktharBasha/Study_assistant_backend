const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Main health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Study Assistant API is running perfectly!', environment: process.env.NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

module.exports = app;