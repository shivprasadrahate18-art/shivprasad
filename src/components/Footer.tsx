import React from 'react';
import { Droplet, PhoneCall, ShieldAlert, Heart, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner / Helpline Strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-200">
            <PhoneCall className="w-4 h-4 text-red-500 shrink-0" />
            <span className="font-semibold">24/7 National Emergency Blood Helpline:</span>
            <span className="font-mono text-red-400 font-bold tracking-wider">1800-11-2566 / 108</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Every donation can save up to 3 lives.</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Voluntary, Non-remunerated Donation</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Droplet className="w-4 h-4 fill-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">BloodConnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging the gap between emergency blood recipients and compassionate voluntary donors across cities and communities.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>National Healthcare Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Platform Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('find-donor')} className="hover:text-white transition-colors">
                  Find Blood Donors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('become-donor')} className="hover:text-white transition-colors">
                  Register as a Donor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('request-blood')} className="hover:text-white transition-colors">
                  Submit Blood Request
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
                  Compatibility Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines & Safety */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Donor Safety</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Age must be between 18 and 65 years</li>
              <li>Minimum body weight: 45kg (50kg recommended)</li>
              <li>Interval: 90 days between whole blood donations</li>
              <li>Hemoglobin level $\ge$ 12.5 g/dL</li>
            </ul>
          </div>

          {/* Medical Disclaimer Callout */}
          <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Official Medical Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BloodConnect connects voluntary donors with recipients during emergencies. We do not provide clinical diagnosis, guarantee donor suitability, or replace clinical cross-matching. Transfusions must be conducted strictly at recognized healthcare facilities.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BloodConnect – Find Blood, Save Lives. College CS Capstone Healthcare Project.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('about')} className="hover:text-slate-300">Privacy & Ethics</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => setActiveTab('contact')} className="hover:text-slate-300">Emergency Directory</button>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for community life-saving
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
