import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit,
  Search,
  Filter,
  CheckCircle2,
  Database,
  RefreshCw,
  Building2,
  Phone,
} from 'lucide-react';
import { Donor, BloodRequest, StatsData } from '../types';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'donors' | 'requests'>('donors');
  const [stats, setStats] = useState<StatsData | null>(null);

  // Donors
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState('ALL');

  // Requests
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [requestStatusFilter, setRequestStatusFilter] = useState('ALL');

  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, donorsData, requestsData] = await Promise.all([
        api.getStats(),
        api.searchDonors(),
        api.getBloodRequests(),
      ]);
      setStats(statsData);
      setDonors(donorsData.donors);
      setRequests(requestsData.requests);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVerify = async (donor: Donor) => {
    try {
      await api.updateDonor(donor.id, { isVerified: !donor.isVerified });
      setStatusMessage(`Updated verification status for ${donor.fullName}`);
      await loadData();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update donor');
    }
  };

  const handleDeleteDonor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove donor profile for "${name}"?`)) return;
    try {
      await api.deleteDonor(id);
      setStatusMessage(`Donor profile removed successfully.`);
      await loadData();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete donor');
    }
  };

  const handleUpdateReqStatus = async (id: string, newStatus: any) => {
    try {
      await api.updateBloodRequestStatus(id, newStatus);
      setStatusMessage(`Blood request status updated to ${newStatus}.`);
      await loadData();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update request');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm(`Are you sure you want to remove this blood request?`)) return;
    try {
      await api.deleteBloodRequest(id);
      setStatusMessage(`Blood request record deleted.`);
      await loadData();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete request');
    }
  };

  // Filtered lists
  const filteredDonors = donors.filter((d) => {
    const matchSearch =
      d.fullName.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.city.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.phone.includes(donorSearch);
    const matchGroup = donorGroupFilter === 'ALL' || d.bloodGroup === donorGroupFilter;
    return matchSearch && matchGroup;
  });

  const filteredRequests = requests.filter((r) => {
    return requestStatusFilter === 'ALL' || r.status === requestStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              BloodConnect Administration
            </h1>
            <p className="text-xs text-slate-500">
              Verified clinical records, donor registry moderation, and hospital transfusion queues.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-semibold text-slate-700">
            <Database className="w-3.5 h-3.5 text-slate-600" />
            <span>Storage: {stats?.isMongoConnected ? 'MongoDB Atlas' : 'Embedded JSON DB'}</span>
          </div>

          <button
            onClick={loadData}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Total Donors</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {stats ? stats.totalDonors : donors.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {stats ? stats.availableDonors : 0} Available
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Pending Requests</span>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            {stats ? stats.pendingRequests : 0}
          </p>
          <span className="text-[11px] text-slate-500">Awaiting matching</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Fulfilled Requests</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
            {stats ? stats.fulfilledRequests : 0}
          </p>
          <span className="text-[11px] text-slate-500">Transfusions completed</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Critical Priority</span>
          <p className="text-2xl font-bold font-mono text-red-600 mt-1 tabular-nums">
            {stats ? stats.criticalRequests : 0}
          </p>
          <span className="text-[11px] text-red-600 font-semibold">Immediate attention</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('donors')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'donors'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Manage Donors ({donors.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Manage Blood Requests ({requests.length})
        </button>
      </div>

      {/* Donors Table Tab */}
      {activeTab === 'donors' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  placeholder="Search donor name, city, phone..."
                  className="text-xs px-2.5 py-1.5 pl-8 bg-white border border-slate-300 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <select
                value={donorGroupFilter}
                onChange={(e) => setDonorGroupFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-red-600"
              >
                <option value="ALL">All Blood Groups</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{filteredDonors.length}</strong> of {donors.length} donors
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 text-[11px] font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Donor Name</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {d.fullName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Age: {d.age} · Weight: {d.weight}kg
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {d.bloodGroup}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {d.city}, {d.area}
                      <span className="block text-[10px] text-slate-400 font-mono">PIN: {d.pinCode}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {d.phone}
                      <span className="block text-[10px] text-slate-400 font-sans">{d.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold ${
                        d.availability === 'available'
                          ? 'text-emerald-700'
                          : d.availability === 'on_call'
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}>
                        {d.availability.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleVerify(d)}
                        className={`text-xs px-2 py-0.5 rounded cursor-pointer ${
                          d.isVerified
                            ? 'bg-emerald-50 text-emerald-700 font-semibold'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {d.isVerified ? '✓ Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteDonor(d.id, d.fullName)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Delete donor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests Table Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-600">Filter Status:</label>
              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
              >
                <option value="ALL">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{filteredRequests.length}</strong> requests
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 text-[11px] font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Blood Needed</th>
                  <th className="py-3 px-4">Hospital & City</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {r.patientName}
                      <span className="block text-[10px] text-slate-400 font-mono">Date: {r.requiredDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {r.bloodGroup} · {r.units} Units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {r.hospitalName}
                      <span className="block text-[10px] text-slate-400">{r.city}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        r.urgency === 'critical' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateReqStatus(r.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-md border font-semibold ${
                          r.status === 'fulfilled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      <a href={`tel:${r.contactPhone}`} className="text-red-600 hover:underline">
                        {r.contactPhone}
                      </a>
                      <span className="block text-[10px] text-slate-400 font-sans">{r.contactPerson}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRequest(r.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Delete request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
