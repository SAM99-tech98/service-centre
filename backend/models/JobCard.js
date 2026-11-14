const mongoose = require('mongoose');

const jobCardSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, uppercase: true },
  issue: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Service', 'Ready', 'Delivered'], 
    default: 'Pending' 
  },
  estimatedCost: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('JobCard', jobCardSchema);