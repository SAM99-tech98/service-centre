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
const authRoutes = require('./routes/auth'); // Added Auth

// USE ROUTES
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/auth', authRoutes); // Using Auth

app.get('/', (req, res) => res.send('API Running'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ MongoDB Error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));