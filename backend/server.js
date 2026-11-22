const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ⚠️ THIS IS THE CRITICAL FIX FOR VERCEL -> RENDER
app.use(cors({
  origin: "https://service-centre-one.vercel.app", // Your live Vercel URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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

// Connect to MongoDB (Added timeout so it doesn't crash immediately)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000 // Give it 30 seconds to connect
})
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.log('❌ MongoDB Error:', err.message));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});