import React, { useState, useEffect } from 'react';
import {
  Heart,
  Droplet,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  CreditCard,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { Donor, BloodRequest, DonorAvailability } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DigitalDonorCardModal } from '../components/DigitalDonorCardModal';

interface DonorDashboardProps {
  onGoToSearch?: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = () => {
  const { user, refreshUser, updateDonorAvailability } = useAuth();

  const [donorProfile, setDonorProfile] = useState<Donor | null>(null);
  const [matchingRequests, setMatchingRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);

  // Form edit states
  const [editPhone, setEditPhone] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editWeight, setEditWeight] = useState(65);
  const [editNotes, setEditNotes] = useState('');
  const [editAvailability, setEditAvailability] = useState<DonorAvailability>('available');

  const loadDonorData = async () => {
    setIsLoading(true);
    try {
      let donor: Donor | null = null;
      if (user?.donorProfileId) {
        const res = await api.getDonor(user.donorProfileId);
        donor = res.donor;
      } else {
        // Fallback: search by user email
        const res = await api.searchDonors({ search: user?.email });
        if (res.donors.length > 0) {
          donor = res.donors[0];
        } else {
          // Fallback to initial demo donor profile if logged in as demo
          const allDonors = await api.searchDonors();
          donor = allDonors.donors[0] || null;
        }
      }

      setDonorProfile(donor);

      if (donor) {
        setEditPhone(donor.phone);
        setEditArea(donor.area);
        setEditWeight(donor.weight);
        setEditNotes(donor.notes || '');
        setEditAvailability(donor.availability);

        // Fetch blood requests matching this donor's blood group and city
        const reqRes = await api.getBloodRequests({
          bloodGroup: donor.bloodGroup,
          status: 'pending',
        });
        setMatchingRequests(reqRes.requests);
      }
    } catch (err) {
      console.error('Failed to load donor profile', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonorData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorProfile) return;
    setIsSaving(true);
    try {
      const res = await api.updateDonor(donorProfile.id, {
        phone: editPhone.trim(),
        area: editArea.trim(),
        weight: Number(editWeight),
        notes: editNotes.trim(),
        availability: editAvailability,
      });
      setDonorProfile(res.donor);
      setIsEditing(false);
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async (newStatus: DonorAvailability) => {
    if (!donorProfile) return;
    try {
      const res = await api.updateDonor(donorProfile.id, { availability: newStatus });
      setDonorProfile(res.donor);
      setEditAvailability(newStatus);
    } catch (err: any) {
      console.error('Failed to toggle status', err);
    }
  };

  // Calculate days remaining until next donation if last donation date exists
  const getEligibilityInfo = () => {
    if (!donorProfile?.lastDonationDate) {
      return { eligible: true, daysLeft: 0, text: 'Eligible to donate today' };
    }
    const last = new Date(donorProfile.lastDonationDate);
    const nextEligible = new Date(last.getTime() + 90 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffDays = Math.ceil((nextEligible.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { eligible: true, daysLeft: 0, text: 'Eligible to donate today' };
    }
    return {
      eligible: false,
      daysLeft: diffDays,
      text: `${diffDays} days remaining until next 90-day donation cycle`,
    };
  };

  const eligibility = getEligibilityInfo();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading donor profile...
      </div>
    );
  }

  if (!donorProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Heart className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Donor Profile Linked Yet</h2>
        <p className="text-xs text-slate-500">
          You are currently logged in as {user?.email}, but have not yet registered your voluntary donor profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {donorProfile.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950">
                  {donorProfile.fullName}
                </h1>
                {donorProfile.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{donorProfile.city}, {donorProfile.area} (PIN {donorProfile.pinCode})</span>
                <span aria-hidden="true">·</span>
                <span>{donorProfile.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowCardModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Digital Donor Card</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
            </button>
          </div>
        </div>

        {/* Quick Availability Status Selector */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Immediate Availability:
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
              donorProfile.availability === 'available'
                ? 'bg-emerald-50 text-emerald-700'
                : donorProfile.availability === 'on_call'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {donorProfile.availability === 'available' ? 'Available Now' : donorProfile.availability === 'on_call' ? 'On Call (Notice Required)' : 'Unavailable'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => handleToggleAvailability('available')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                donorProfile.availability === 'available' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Now
            </button>
            <button
              onClick={() => handleToggleAvailability('on_call')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                donorProfile.availability === 'on_call' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              On Call
            </button>
            <button
              onClick={() => handleToggleAvailability('unavailable')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                donorProfile.availability === 'unavailable' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Update Personal Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area / Suburb
              </label>
              <input
                type="text"
                required
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Weight (KG)
              </label>
              <input
                type="number"
                min="45"
                max="160"
                required
                value={editWeight}
                onChange={(e) => setEditWeight(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Notes / Availability Hours
            </label>
            <textarea
              rows={2}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Metrics & Eligibility Countdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Donation Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Donation Interval Status
          </span>
          <div className="mt-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
              eligibility.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {eligibility.eligible ? '✓' : '⏱'}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{eligibility.text}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Last recorded: {donorProfile.lastDonationDate || 'First-time donor'}
              </p>
            </div>
          </div>
        </div>

        {/* Total Donations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Lifetime Donations
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
              {donorProfile.totalDonations}
            </span>
            <span className="text-xs text-slate-600">Blood Units Given</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Approx. {donorProfile.totalDonations * 3} lives touched & supported
          </p>
        </div>

        {/* City Matching */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Emergency Alert Zone
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 font-mono tabular-nums">
              {matchingRequests.length}
            </span>
            <span className="text-xs text-slate-600">Pending Requests for {donorProfile.bloodGroup}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Matching patients currently awaiting transfusion
          </p>
        </div>
      </div>

      {/* Matching Blood Requests Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950">
              Emergency Patients Matching Your Blood Group ({donorProfile.bloodGroup})
            </h3>
            <p className="text-xs text-slate-500">
              Patients currently in hospital treatment who need compatible blood
            </p>
          </div>
          <button
            onClick={loadDonorData}
            className="p-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
            title="Refresh requests"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {matchingRequests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            No active emergency requests currently pending for {donorProfile.bloodGroup}. Thank you for remaining on call!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {matchingRequests.map((req) => (
              <div
                key={req.id}
                className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md">
                      {req.bloodGroup} · {req.units} Unit(s)
                    </span>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                      ⚡ {req.urgency}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">
                    {req.patientName}
                  </h4>

                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.hospitalName}, {req.city}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date needed: {req.requiredDate}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Coordinator: {req.contactPerson}
                  </span>
                  <a
                    href={`tel:${req.contactPhone}`}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Contact Hospital / Family
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Digital Donor Card Modal */}
      <DigitalDonorCardModal
        donor={donorProfile}
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
    </div>
  );
};
