import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, Wrench, Receipt, History, LogOut } from 'lucide-react';

// Import Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import JobCards from './pages/JobCards';
import Billing from './pages/Billing';
import HistoryPage from './pages/History';

// --- PROTECTED ROUTE COMPONENT ---
// This checks if a token exists. If not, it kicks you back to login.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Sidebar Layout Component
function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('role') || 'customer';

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    ...(userRole === 'admin' ? [
      { path: '/vehicles', name: 'Vehicles', icon: <Car size={20} /> },
      { path: '/jobs', name: 'Job Cards', icon: <Wrench size={20} /> },
      { path: '/billing', name: 'Billing', icon: <Receipt size={20} /> },
    ] : []),
    { path: '/history', name: 'History', icon: <History size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove Token
    localStorage.removeItem('role');  // Remove Role
    navigate('/'); // Go back to login
  };

  return (
    <div className="flex h-screen bg-brand-bg font-sans">
      <aside className="w-64 bg-brand-navy text-white flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-bold text-brand-amber flex items-center gap-2 border-b border-slate-700">
          <Wrench size={28} /> ServicePro
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                location.pathname === item.path 
                  ? 'bg-brand-amber text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-all"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {location.pathname.replace('/', '') || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-bold uppercase">
              {userRole.charAt(0)}
            </div>
            <span className="font-medium text-slate-700 capitalize">{userRole}</span>
          </div>
        </header>

        <div className="p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// Main App with Routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* ALL ROUTES ARE NOW PROTECTED */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><Layout><Vehicles /></Layout></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Layout><JobCards /></Layout></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Layout><Billing /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><HistoryPage /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}