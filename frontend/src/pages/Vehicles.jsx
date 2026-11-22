import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: 'Car',
    model: '',
    ownerName: '',
    phone: ''
  });

  // 1. Fetch vehicles from backend when page loads
  const fetchVehicles = async () => {
    try {
      const res = await axios.get('https://service-centre-ck7p.onrender.com/api/vehicles');
      setVehicles(res.data.data);
    } catch (err) {
      console.error("Error fetching vehicles", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 2. Handle form typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://service-centre-ck7p.onrender.com/api/vehicles', formData);
      alert('Vehicle Added Successfully! 🚗');
      setFormData({ vehicleNumber: '', type: 'Car', model: '', ownerName: '', phone: '' });
      setShowForm(false); // Hide form
      fetchVehicles(); // Refresh the table
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search vehicle..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-amber"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-amber hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={20} /> {showForm ? 'Close Form' : 'Add Vehicle'}
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Register New Vehicle</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Number</label>
              <input required name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} type="text" placeholder="e.g. KA01AB1234" className="w-full p-2 border border-slate-300 rounded-lg uppercase" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-lg bg-white">
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Model Name</label>
              <input required name="model" value={formData.model} onChange={handleChange} type="text" placeholder="e.g. Honda City" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Owner Name</label>
              <input required name="ownerName" value={formData.ownerName} onChange={handleChange} type="text" placeholder="e.g. Rahul Kumar" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} type="text" placeholder="e.g. 9876543210" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" className="bg-brand-navy hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold w-full transition-all">
                Save to Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">Vehicle No</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Model</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold">Phone</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No vehicles found. Click "Add Vehicle" to register one.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{v.vehicleNumber}</td>
                  <td className="p-4 text-slate-600">{v.type}</td>
                  <td className="p-4 text-slate-600">{v.model}</td>
                  <td className="p-4 text-slate-600">{v.ownerName}</td>
                  <td className="p-4 text-slate-600">{v.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
