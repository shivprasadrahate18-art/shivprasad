import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Building2,
  Droplet,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Send,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { BloodGroup, RequestUrgency, BloodRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface RequestBloodProps {
  onSuccessSubmit?: () => void;
}

export const RequestBlood: React.FC<RequestBloodProps> = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'feed'>('create');

  // Form fields
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState<number>(2);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [urgency, setUrgency] = useState<RequestUrgency>('urgent');
  const [contactPerson, setContactPerson] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [requiredDate, setRequiredDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ request: BloodRequest; matchedDonors: number } | null>(null);

  // Feed state
  const [feedRequests, setFeedRequests] = useState<BloodRequest[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedFilterStatus, setFeedFilterStatus] = useState<string>('ALL');
  const [feedFilterUrgency, setFeedFilterUrgency] = useState<string>('ALL');
  const [feedFilterCity, setFeedFilterCity] = useState<string>('');

  const bloodGroupList: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const loadFeed = async () => {
    setFeedLoading(true);
    try {
      const res = await api.getBloodRequests({
        status: feedFilterStatus !== 'ALL' ? feedFilterStatus : undefined,
        urgency: feedFilterUrgency !== 'ALL' ? feedFilterUrgency : undefined,
        city: feedFilterCity.trim() || undefined,
      });
      setFeedRequests(res.requests);
    } catch (err) {
      console.error('Failed to load blood requests', err);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'feed') {
      loadFeed();
    }
  }, [activeSubTab, feedFilterStatus, feedFilterUrgency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!patientName.trim() || !hospitalName.trim() || !city.trim() || !contactPhone.trim()) {
      setError('Please provide the patient name, hospital name, city, and phone number.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.createBloodRequest({
        patientName: patientName.trim(),
        bloodGroup,
        units: Number(units) || 1,
        hospitalName: hospitalName.trim(),
        hospitalAddress: hospitalAddress.trim() || hospitalName.trim(),
        city: city.trim(),
        pinCode: pinCode.trim() || '100001',
        urgency,
        contactPerson: contactPerson.trim() || patientName.trim(),
        contactPhone: contactPhone.trim(),
        requiredDate,
        notes: notes.trim() || undefined,
        requesterId: user?.id,
      });

      setSuccessInfo({
        request: res.request,
        matchedDonors: res.matchedDonorsCount,
      });

      // Clear fields
      setPatientName('');
      setHospitalName('');
      setNotes('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit blood request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      await api.updateBloodRequestStatus(id, newStatus);
      await loadFeed();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Patient & Hospital Blood Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish high-priority blood needs to alert nearby registered voluntary donors.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'create'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Request
          </button>
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'feed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Requests Feed
          </button>
        </div>
      </div>

      {/* View 1: Create Request Form */}
      {activeSubTab === 'create' && (
        <div className="max-w-3xl mx-auto">
          {successInfo && (
            <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900">
                <p className="font-bold text-sm">Blood Request Registered Successfully!</p>
                <p className="mt-1">
                  Request for <strong>{successInfo.request.units} Unit(s)</strong> of{' '}
                  <strong className="text-red-700">{successInfo.request.bloodGroup}</strong> blood for patient{' '}
                  <strong>{successInfo.request.patientName}</strong> has been saved.
                </p>
                <p className="mt-1 text-emerald-700">
                  {successInfo.matchedDonors > 0
                    ? `Found ${successInfo.matchedDonors} potential active voluntary donor(s) in ${successInfo.request.city}.`
                    : `No immediate donors in ${successInfo.request.city}; request is visible on the public emergency feed.`}
                </p>
                <button
                  onClick={() => {
                    setSuccessInfo(null);
                    setActiveSubTab('feed');
                  }}
                  className="mt-3 px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-emerald-800"
                >
                  View on Live Feed →
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            
            {/* Urgency Selector Strip */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                Urgency Level *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('critical')}
                  className={`py-3 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'critical'
                      ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs block text-red-600">⚡ Critical Emergency</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Needed within 2-4 hours</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('urgent')}
                  className={`py-3 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'urgent'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs block text-amber-600">Urgent Requirement</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Needed within 24 hours</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('normal')}
                  className={`py-3 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'normal'
                      ? 'border-slate-900 bg-slate-100 text-slate-900 ring-2 ring-slate-400/20'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-bold text-xs block text-slate-900">Planned Surgery</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Scheduled within 2-7 days</span>
                </button>
              </div>
            </div>

            {/* Patient & Blood Needs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Meera Joshi"
                    className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group *
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-red-600"
                >
                  {bloodGroupList.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Units Required *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            {/* Hospital & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. City General Hospital, ICU Room 302"
                    className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required By Date *
                </label>
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Contact Person Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendant / Coordinator Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Family Member / Medical Social Worker"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98111 22334"
                    className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Reason & Crossmatching Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Emergency bypass surgery, patient in CTVS OT; replacement donors requested."
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? 'Broadcasting Emergency Alert...' : 'Publish Emergency Blood Request'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View 2: Live Feed */}
      {activeSubTab === 'feed' && (
        <div className="space-y-6">
          {/* Feed Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                <select
                  value={feedFilterStatus}
                  onChange={(e) => setFeedFilterStatus(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Urgency</label>
                <select
                  value={feedFilterUrgency}
                  onChange={(e) => setFeedFilterUrgency(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="ALL">All Urgency</option>
                  <option value="critical">Critical</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City Filter</label>
                <input
                  type="text"
                  value={feedFilterCity}
                  onChange={(e) => setFeedFilterCity(e.target.value)}
                  placeholder="Filter by city..."
                  className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={loadFeed}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                  title="Reload feed"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Total Requests: <strong>{feedRequests.length}</strong>
            </div>
          </div>

          {/* Feed List */}
          {feedLoading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading blood requests...</div>
          ) : feedRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-500">
              No requests found matching the current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-9 rounded-lg bg-red-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {req.bloodGroup}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{req.patientName}</h3>
                          <span className="text-[11px] text-slate-500">
                            Required: {req.units} Unit(s)
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        req.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-700'
                          : req.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700'
                          : req.urgency === 'critical'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {req.status === 'fulfilled' ? 'Fulfilled' : req.status === 'in_progress' ? 'In Progress' : req.urgency.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.hospitalName}, {req.city}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Needed by: {req.requiredDate}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Contact: {req.contactPerson} (<a href={`tel:${req.contactPhone}`} className="text-red-600 font-mono font-bold hover:underline">{req.contactPhone}</a>)</span>
                      </p>
                    </div>

                    {req.notes && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-lg">
                        {req.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions for managing status */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {req.id.substring(0, 8)}
                    </span>

                    {/* Change status action */}
                    <div className="flex items-center gap-1.5">
                      {req.status !== 'fulfilled' && (
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'fulfilled')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                        >
                          Mark Fulfilled
                        </button>
                      )}
                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'in_progress')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                        >
                          In Progress
                        </button>
                      )}
                      <a
                        href={`tel:${req.contactPhone}`}
                        className="px-3 py-1 text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
