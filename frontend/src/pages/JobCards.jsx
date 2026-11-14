import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Wrench, CheckCircle2, Clock } from 'lucide-react';

export default function JobCards() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    issue: '',
    estimatedCost: ''
  });

  // 1. Fetch Job Cards from backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Handle form typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit new Job Card
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', formData);
      alert('Job Card Created Successfully! 🔧');
      setFormData({ vehicleNumber: '', issue: '', estimatedCost: '' });
      setShowForm(false);
      fetchJobs(); // Refresh table
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  // 4. Update Job Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, { status: newStatus });
      fetchJobs(); // Refresh table to show new color
    } catch (err) {
      alert('Error updating status');
    }
  };

  // Helper for Status Badge Colors
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'In Service': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'Ready': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-slate-600">Manage Vehicle Repairs</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-amber hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus size={20} /> {showForm ? 'Close Form' : 'Create Job Card'}
        </button>
      </div>

      {/* Add Job Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">New Job Card</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle Number</label>
              <input required name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} type="text" placeholder="e.g. KA01AB1234" className="w-full p-2 border border-slate-300 rounded-lg uppercase" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Issue / Complaint</label>
              <input required name="issue" value={formData.issue} onChange={handleChange} type="text" placeholder="e.g. Brake pads broken" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Estimated Cost (₹)</label>
              <input required name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} type="number" placeholder="e.g. 1500" className="w-full p-2 border border-slate-300 rounded-lg" />
            </div>

            <div className="md:col-span-3 mt-2">
              <button type="submit" className="bg-brand-navy hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold w-full transition-all">
                Generate Job Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Cards Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">Vehicle No</th>
              <th className="p-4 font-semibold">Issue</th>
              <th className="p-4 font-semibold">Est. Cost</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Action (Update Status)</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No active job cards. Click "Create Job Card" to start.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{job.vehicleNumber}</td>
                  <td className="p-4 text-slate-600">{job.issue}</td>
                  <td className="p-4 text-slate-600">₹{job.estimatedCost}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={job.status}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className="p-2 border border-slate-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-brand-amber outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Service">In Service</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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