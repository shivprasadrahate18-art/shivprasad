import React from 'react';
import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { BloodRequest } from '../types';

interface EmergencyBannerProps {
  criticalRequests: BloodRequest[];
  onViewRequests: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ criticalRequests, onViewRequests }) => {
  if (!criticalRequests || criticalRequests.length === 0) return null;

  const active = criticalRequests[0];

  return (
    <div className="bg-red-700 text-white px-4 py-2.5 sm:px-6 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-5 h-5 rounded-full bg-white text-red-700 flex items-center justify-center shrink-0 font-black text-[11px]">
            !
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold uppercase tracking-wider text-red-100">
              URGENT BLOOD ALERT:
            </span>
            <span className="font-semibold text-white">
              {active.bloodGroup} needed at {active.hospitalName}, {active.city} ({active.units} Unit{active.units > 1 ? 's' : ''})
            </span>
            <span aria-hidden="true" className="text-red-300 hidden md:inline">·</span>
            <span className="text-red-100 hidden md:inline">
              Patient: {active.patientName}
            </span>
          </div>
        </div>

        <button
          onClick={onViewRequests}
          className="whitespace-nowrap shrink-0 px-3 py-1 bg-white text-red-700 hover:bg-red-50 active:bg-red-100 rounded-md font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Respond / View All ({criticalRequests.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
