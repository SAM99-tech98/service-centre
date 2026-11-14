const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const vehicleRoutes = require('./routes/vehicles');
const jobRoutes = require('./routes/jobs');
const invoiceRoutes = require('./routes/invoices');
const authRoutes = require('./routes/auth');

// USE ROUTES
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Running'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ MongoDB Error:', err.message));

// Start Server
const PORT = process.env.PORT || 5000;
// The '0.0.0.0' is REQUIRED for Fly.io to work
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});