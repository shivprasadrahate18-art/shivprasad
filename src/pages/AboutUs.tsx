import React from 'react';
import {
  Heart,
  Droplet,
  ShieldAlert,
  Users,
  CheckCircle2,
  HelpCircle,
  FileText,
  Activity,
  Award,
} from 'lucide-react';
import { BLOOD_COMPATIBILITY, BloodGroup } from '../types';

interface AboutUsProps {
  onOpenCompatibilityModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenCompatibilityModal, setActiveTab }) => {
  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero Mission */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 fill-red-600" />
          <span>Our Healthcare Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          BloodConnect – Find Blood, Save Lives
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
          BloodConnect was developed as an open-access healthcare community platform designed to eliminate life-threatening delays in securing voluntary blood during medical emergencies.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold mb-4">
            <Droplet className="w-5 h-5 fill-white" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Zero Commercialization</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Blood cannot be bought or sold. BloodConnect operates entirely on the principle of non-remunerated voluntary donation and ethical altruism.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Rapid Local Discovery</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Targeted search algorithms allow seekers to find donors by blood group, municipal city, and PIN code in seconds rather than panicking on unmoderated social feeds.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold mb-4">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Responsible Privacy</h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Personal contact details are protected from scraping and cold-call telemarketers. Seeker authentication ensures donor phone numbers are released only for genuine hospital emergencies.
          </p>
        </div>
      </div>

      {/* Compatibility Matrix Summary */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Red Blood Cell Compatibility Chart
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Understanding which donor groups can safely give to which recipients
            </p>
          </div>
          <button
            onClick={onOpenCompatibilityModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Interactive Compatibility Tool →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Blood Type</th>
                <th className="p-3">Can Donate Red Cells To</th>
                <th className="p-3">Can Receive Red Cells From</th>
                <th className="p-3">Clinical Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bloodGroups.map((bg) => {
                const info = BLOOD_COMPATIBILITY[bg];
                return (
                  <tr key={bg} className="hover:bg-slate-50/60">
                    <td className="p-3 font-extrabold text-red-600 font-sans">{bg}</td>
                    <td className="p-3 font-semibold text-slate-800">{info.canDonateTo.join(', ')}</td>
                    <td className="p-3 text-slate-600">{info.canReceiveFrom.join(', ')}</td>
                    <td className="p-3 text-[11px] text-slate-500">{info.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Official Medical Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-300 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Official Medical & Legal Disclaimer</span>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          BloodConnect connects potential donors with requesters but does not guarantee donor eligibility, blood availability, or medical compatibility. Actual donation eligibility, blood grouping, crossmatching, screening for infectious markers (including HIV, Hepatitis, Syphilis, and Malaria), and transfusion decisions must be handled exclusively by qualified healthcare professionals and accredited blood transfusion centers.
        </p>
        <p className="text-[11px] text-amber-800">
          Under no circumstances should any individual transfer blood products outside an authorized clinical environment. BloodConnect is not a blood bank and does not store or process physical blood units.
        </p>
      </div>

      {/* College CS Project Capstone Note */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
            Computer Science Capstone Project
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Built with React, TypeScript, Express.js & MongoDB Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Designed with modular components, REST API design, password hashing, relational/document schemas, and robust data persistence.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('become-donor')}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          Join as a Volunteer
        </button>
      </div>
    </div>
  );
};
