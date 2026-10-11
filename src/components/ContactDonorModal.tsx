import React, { useState } from 'react';
import { X, Phone, MessageSquare, Shield, Check, Copy, AlertCircle } from 'lucide-react';
import { Donor } from '../types';
import { api } from '../services/api';

interface ContactDonorModalProps {
  donor: Donor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactDonorModal: React.FC<ContactDonorModalProps> = ({ donor, isOpen, onClose }) => {
  const [seekerName, setSeekerName] = useState('');
  const [seekerPhone, setSeekerPhone] = useState('');
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !donor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!seekerName.trim() || !seekerPhone.trim()) {
      setError('Please provide your name and a valid contact phone number.');
      return;
    }

    try {
      setIsLoading(true);
      await api.requestDonorContact({
        donorId: donor.id,
        seekerName: seekerName.trim(),
        seekerPhone: seekerPhone.trim(),
        bloodGroupNeeded: donor.bloodGroup,
        message: `Emergency request for ${patientName || 'patient'} at ${hospitalName || 'hospital'}`,
      });
      setIsAuthorized(true);
    } catch (err: any) {
      setError(err.message || 'Failed to authorize contact disclosure.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(donor.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${donor.fullName}, I found your voluntary donor profile on BloodConnect. We urgently require ${donor.bloodGroup} blood for ${patientName || 'our patient'} at ${hospitalName || donor.city}. Are you currently available to donate? Thank you!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              {donor.bloodGroup}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Contact Donor: {donor.fullName}</h3>
              <p className="text-[11px] text-slate-500">{donor.city}, {donor.area} · Verified Voluntary Donor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!isAuthorized ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                <Shield className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-900">Donor Privacy Protection</p>
                  <p className="mt-0.5 leading-relaxed">
                    To prevent spam and protect donors, please identify your emergency before direct contact numbers are unlocked.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={seekerName}
                  onChange={(e) => setSeekerName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar (Relative / Hospital Attendant)"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={seekerPhone}
                  onChange={(e) => setSeekerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 00000"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient in ICU/Ward"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="City Hospital"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Authorize & Unlock Donor Contact'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <span className="text-emerald-700 font-semibold text-xs uppercase tracking-wider block">
                  Contact Authorized for Emergency
                </span>
                <p className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {donor.phone}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Email: {donor.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${donor.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>

                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                </button>
              </div>

              <a
                href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message on WhatsApp</span>
              </a>

              <div className="text-[11px] text-slate-500 bg-slate-50 rounded-lg p-3 leading-relaxed border border-slate-200">
                <p className="font-semibold text-slate-700">Code of Conduct for Requesters:</p>
                <p className="mt-0.5">
                  Please introduce yourself politely, state the patient name, hospital location, and required blood units. Do not offer monetary compensation; blood donation is strictly voluntary by law.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
