import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, CheckCircle } from 'lucide-react';

export default function HistoryPage() {
  const role = localStorage.getItem('role') || 'admin';
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch all jobs
    axios.get('https://service-centre-npukpq.fly.dev/api/jobs').then(res => {
      // Filter to only show "Delivered" jobs for history
      const deliveredJobs = res.data.data.filter(job => job.status === 'Delivered');
      setJobs(deliveredJobs);
    });
  }, []);

  // Admin sees all delivered, Customer sees only theirs (based on search)
  const displayedJobs = role === 'admin' 
    ? jobs 
    : jobs.filter(job => job.vehicleNumber.includes(searchQuery.toUpperCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-slate-600">Service History</h2>
        
        {/* Only show search bar if Customer is logged in */}
        {role === 'customer' && (
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search your vehicle no..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-amber uppercase"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-semibold">Date Delivered</th>
              <th className="p-4 font-semibold">Vehicle No</th>
              <th className="p-4 font-semibold">Issue Handled</th>
              <th className="p-4 font-semibold">Cost</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedJobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  No past service records found.
                </td>
              </tr>
            ) : (
              displayedJobs.map((job) => (
                <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600">{new Date(job.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-slate-800">{job.vehicleNumber}</td>
                  <td className="p-4 text-slate-600">{job.issue}</td>
                  <td className="p-4 text-slate-600">₹{job.estimatedCost}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                      <CheckCircle size={16} /> Delivered
                    </span>
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
