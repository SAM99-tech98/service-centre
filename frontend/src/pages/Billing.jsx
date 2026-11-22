import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle } from 'lucide-react';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    partsCost: '',
    labourCost: ''
  });

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('https://service-centre-ck7p.onrender.com/api/invoices');
      setInvoices(res.data.data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const total = Number(formData.partsCost) + Number(formData.labourCost);
      const payload = {
        vehicleNumber: formData.vehicleNumber,
        partsCost: Number(formData.partsCost),
        labourCost: Number(formData.labourCost),
        totalAmount: total
      };
      
      await axios.post('https://service-centre-ck7p.onrender.com/api/invoices', payload);
      alert('Invoice Generated! 🧾');
      setFormData({ vehicleNumber: '', partsCost: '', labourCost: '' });
      setShowForm(false);
      fetchInvoices();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axios.put(`https://service-centre-ck7p.onrender.com/api/invoices/${id}`, { status: 'Paid' });
      fetchInvoices();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-slate-600">Invoices & Billing</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-amber hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={20} /> {showForm ? 'Close Form' : 'Create Invoice'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Generate Bill</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Number</label>
              <input required name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} type="text" placeholder="e.g. KA01AB1234" className="w-full p-2 border border-slate-300 rounded-lg uppercase" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Parts Cost (₹)</label>
              <input required name="partsCost" value={formData.partsCost} onChange={handleChange} type="number" placeholder="e.g. 1000" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Labour Cost (₹)</label>
              <input required name="labourCost" value={formData.labourCost} onChange={handleChange} type="number" placeholder="e.g. 500" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div className="flex items-end">
              <button type="submit" className="bg-brand-navy hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold w-full transition-all">
                Generate Bill
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">Invoice Date</th>
              <th className="p-4 font-semibold">Vehicle No</th>
              <th className="p-4 font-semibold">Parts</th>
              <th className="p-4 font-semibold">Labour</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  No invoices generated yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-800">{inv.vehicleNumber}</td>
                  <td className="p-4 text-slate-600">₹{inv.partsCost}</td>
                  <td className="p-4 text-slate-600">₹{inv.labourCost}</td>
                  <td className="p-4 font-bold text-brand-amber text-lg">₹{inv.totalAmount}</td>
                  <td className="p-4">
                    {inv.status === 'Paid' ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                        <CheckCircle size={16} /> Paid
                      </span>
                    ) : (
                      <button 
                        onClick={() => markAsPaid(inv._id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-full text-xs font-bold transition-all"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
