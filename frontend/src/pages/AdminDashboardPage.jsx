import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Trash2 
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.success) {
        setStats(res.stats);
        setUsersList(res.recentUsers);
        setReports(res.recentReports);
      }
    } catch (err) {
      console.log('Error loading admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyUser = async (userId, status) => {
    try {
      const res = await api.post('/admin/verify-user', { userId, status });
      if (res.success) {
        showToast("KYC Updated", res.message);
        setUsersList(prev => prev.map(u => u._id === userId ? res.user : u));
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, {
        status: 'resolved',
        adminNotes: 'Reviewed and confirmed compliant.'
      });
      if (res.success) {
        showToast("Report Resolved", "Action recorded.");
        setReports(prev => prev.map(r => r._id === reportId ? res.report : r));
      }
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative Command Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-purple-200">
            Platform governance, KYC verification, content moderation & market data sync
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Farmers Registered</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{stats.totalFarmers}</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Buyers Registered</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700">{stats.totalBuyers}</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Produce Listings</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activeListings}</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Deals Closed</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">{stats.acceptedDeals}</div>
          </div>
        </div>
      )}

      {/* KYC Verification Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <span>User Verification & KYC Governance</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Location</th>
                <th className="p-3">Verification Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersList.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <span className="text-[10px] text-slate-400">+91 {u.phone}</span>
                  </td>
                  <td className="p-3 capitalize font-semibold text-slate-700">{u.role}</td>
                  <td className="p-3 text-slate-500">{u.location?.district}, {u.location?.state}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      u.verification?.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {u.verification?.status || 'unverified'}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {!u.verification?.isVerified ? (
                      <button
                        onClick={() => handleVerifyUser(u._id, 'verified')}
                        className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                      >
                        Approve KYC
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold text-[11px]">✓ Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports & Moderation Queue */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 className="font-bold text-lg text-slate-900 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Reported Content & Security Queue</span>
        </h2>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No pending reports.</p>
        ) : (
          <div className="space-y-2">
            {reports.map((rep) => (
              <div key={rep._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-rose-700">[{rep.reason}]</span> on {rep.targetType}
                  <p className="text-slate-600 mt-0.5">"{rep.description}"</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {rep.status}
                  </span>
                  {rep.status !== 'resolved' && (
                    <button
                      onClick={() => handleResolveReport(rep._id)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
