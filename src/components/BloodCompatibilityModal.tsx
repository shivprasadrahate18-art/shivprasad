import React, { useState } from 'react';
import { X, CheckCircle, Info } from 'lucide-react';
import { BloodGroup, BLOOD_COMPATIBILITY } from '../types';

interface BloodCompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGroup?: BloodGroup;
}

export const BloodCompatibilityModal: React.FC<BloodCompatibilityModalProps> = ({
  isOpen,
  onClose,
  initialGroup = 'O+',
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>(initialGroup);
  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  if (!isOpen) return null;

  const data = BLOOD_COMPATIBILITY[selectedGroup];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
              🩸
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Blood Compatibility Guide</h3>
              <p className="text-xs text-slate-500">Transfusion matching matrix for red blood cells (RBCs)</p>
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
        <div className="p-6 space-y-6">
          {/* Blood Group Selector (Interactive Segmented Buttons) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Blood Group to Check
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`py-2 px-3 text-center text-xs font-bold rounded-lg border transition-all ${
                    selectedGroup === group
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50/30'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Group Overview Banner */}
          <div className="bg-red-50/80 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Blood Type {selectedGroup} Clinical Profile
              </h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>

          {/* Two-Column Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Can Donate To */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Can Give Red Cells To:
              </span>
              <div className="flex flex-wrap gap-2">
                {data.canDonateTo.map((target) => (
                  <div
                    key={target}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{target}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                {data.canDonateTo.length} compatible recipient group{data.canDonateTo.length > 1 ? 's' : ''}.
              </p>
            </div>

            {/* Can Receive From */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Can Receive Red Cells From:
              </span>
              <div className="flex flex-wrap gap-2">
                {data.canReceiveFrom.map((source) => (
                  <div
                    key={source}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>{source}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                {data.canReceiveFrom.length} compatible source group{data.canReceiveFrom.length > 1 ? 's' : ''}.
              </p>
            </div>
          </div>

          {/* Quick Rules */}
          <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Key Universal Rules:</p>
            <p>• <strong>O Negative (O-)</strong> is the universal red blood cell donor for emergencies when blood typing is delayed.</p>
            <p>• <strong>AB Positive (AB+)</strong> is the universal recipient for red blood cells.</p>
            <p>• Rh-negative patients can only receive Rh-negative blood safely.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
