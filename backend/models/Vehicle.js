const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  type: { 
    type: String, 
    enum: ['Car', 'Bike', 'Truck', 'Other'], 
    default: 'Car' 
  },
  model: { 
    type: String, 
    required: true 
  },
  ownerName: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);