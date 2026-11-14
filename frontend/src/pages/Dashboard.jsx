import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, Wrench, ShieldCheck, Search } from 'lucide-react';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'admin';
  
  // ==========================================
  // ADMIN DASHBOARD LOGIC
  // ==========================================
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    if (role === 'admin') {
      axios.get('http://localhost:5000/api/jobs').then(res => setJobs(res.data.data));
    }
  }, [role]);

  const inServiceCount = jobs.filter(j => j.status === 'In Service' || j.status === 'Pending').length;
  const readyCount = jobs.filter(j => j.status === 'Ready').length;
  const deliveredCount = jobs.filter(j => j.status === 'Delivered').length;

  // ==========================================
  // CUSTOMER DASHBOARD LOGIC
  // ==========================================
  const [searchQuery, setSearchQuery] = useState('');
  const [customerJob, setCustomerJob] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // Fetch all jobs and find the one matching the vehicle number
      const res = await axios.get('http://localhost:5000/api/jobs');
      const found = res.data.data.find(
        j => j.vehicleNumber.toUpperCase() === searchQuery.toUpperCase() && j.status !== 'Delivered'
      );
      setCustomerJob(found || null);
      setSearched(true);
    } catch (err) {
      alert("Error connecting to server");
    }
  };


  // ==========================================
  // RENDER ADMIN VIEW
  // ==========================================
  if (role === 'admin') {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-1">Vehicles in Service</p>
            <p className="text-3xl font-bold text-slate-800">{inServiceCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-1">Ready for Delivery</p>
            <p className="text-3xl font-bold text-brand-amber">{readyCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 mb-1">Delivered</p>
            <p className="text-3xl font-bold text-emerald-500">{deliveredCount}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center h-64 text-slate-500">
          <Wrench size={48} className="text-slate-300 mb-4" />
          <p>Welcome back, Admin. Use the sidebar to manage the service center.</p>
        </div>
      </>
    );
  }

  // ==========================================
  // RENDER CUSTOMER VIEW
  // ==========================================
  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Search Bar */}
      <div className="bg-brand-navy text-white p-8 rounded-xl shadow-md mb-8">
        <h1 className="text-2xl font-bold mb-4">Track Your Vehicle</h1>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="text" 
            placeholder="Enter Vehicle Number (e.g. TG2006)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-lg text-slate-800 font-bold uppercase outline-none focus:ring-4 focus:ring-brand-amber"
          />
          <button type="submit" className="bg-brand-amber hover:bg-amber-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all">
            <Search size={20} /> Track
          </button>
        </form>
      </div>

      {/* Results Area */}
      {searched && !customerJob && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-red-500 font-bold">
          No active service found for this vehicle number. Please check with the reception.
        </div>
      )}

      {customerJob && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vehicle Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Service Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle No:</span>
                  <span className="font-bold text-slate-800">{customerJob.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reported Issue:</span>
                  <span className="font-medium text-slate-800">{customerJob.issue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Cost:</span>
                  <span className="font-bold text-brand-amber">₹{customerJob.estimatedCost}</span>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Current Status</h3>
              <div className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold text-xl mb-4 ${
                customerJob.status === 'Pending' ? 'bg-slate-100 text-slate-700' :
                customerJob.status === 'In Service' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {customerJob.status === 'Pending' && <Clock size={24} />}
                {customerJob.status === 'In Service' && <Wrench size={24} />}
                {customerJob.status === 'Ready' && <ShieldCheck size={24} />}
                {customerJob.status}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}