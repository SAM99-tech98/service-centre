const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, uppercase: true },
  partsCost: { type: Number, required: true, default: 0 },
  labourCost: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);