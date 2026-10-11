import React from 'react';
import { X, Droplet, ShieldCheck, Printer, Heart } from 'lucide-react';
import { Donor } from '../types';

interface DigitalDonorCardModalProps {
  donor: Donor;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalDonorCardModal: React.FC<DigitalDonorCardModalProps> = ({ donor, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-bold text-slate-900">Digital Donor ID Card</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card */}
        <div className="p-6">
          <div className="border border-red-200 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-rose-900 text-white p-5 shadow-lg relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/5 blur-lg pointer-events-none" />

            <div className="flex items-center justify-between relative z-10 border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-white text-red-600 flex items-center justify-center">
                  <Droplet className="w-4 h-4 fill-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight leading-tight">BloodConnect</h4>
                  <p className="text-[9px] uppercase tracking-wider text-red-100">Official Voluntary Donor</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] bg-white/15 px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] text-red-200 uppercase tracking-wider">Donor Name</p>
                <h3 className="text-base font-bold tracking-tight text-white mt-0.5">{donor.fullName}</h3>
                <p className="text-xs text-red-100 mt-1">{donor.city}, {donor.area}</p>
              </div>

              {/* Blood Group Badge */}
              <div className="w-16 h-16 rounded-xl bg-white text-red-700 flex flex-col items-center justify-center shadow-md font-sans">
                <span className="text-[10px] font-semibold uppercase text-slate-500">Group</span>
                <span className="text-2xl font-black leading-none">{donor.bloodGroup}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-[10px] relative z-10">
              <div>
                <span className="text-red-200 block">Donor ID</span>
                <span className="font-mono font-semibold text-white truncate block">{donor.id.substring(0, 10)}</span>
              </div>
              <div>
                <span className="text-red-200 block">Total Donations</span>
                <span className="font-mono font-semibold text-white">{donor.totalDonations} Times</span>
              </div>
              <div>
                <span className="text-red-200 block">Availability</span>
                <span className="font-semibold text-emerald-300 capitalize">{donor.availability.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            Carry this digital card or present your registered phone number when visiting certified donation centers.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Card</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
