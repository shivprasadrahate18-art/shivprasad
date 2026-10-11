import React, { useState, useEffect } from 'react';
import {
  Search,
  Droplet,
  Users,
  Heart,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Activity,
} from 'lucide-react';
import { StatsData, BloodRequest, BloodGroup } from '../types';
import { api } from '../services/api';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  onQuickSearch: (bloodGroup: string, city: string) => void;
  onOpenCompatibilityModal: () => void;
}

export const Home: React.FC<HomeProps> = ({
  setActiveTab,
  onQuickSearch,
  onOpenCompatibilityModal,
}) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [urgentRequests, setUrgentRequests] = useState<BloodRequest[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('O+');
  const [searchCity, setSearchCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsData, requestsData] = await Promise.all([
          api.getStats(),
          api.getBloodRequests({ status: 'pending' }),
        ]);
        setStats(statsData);
        setUrgentRequests(requestsData.requests.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickSearch(selectedGroup, searchCity);
    setActiveTab('find-donor');
  };

  const bloodGroupList: BloodGroup[] = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section with 2-Column Split */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50 border border-red-200/80 px-3 py-1 rounded-md">
                <Activity className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                <span>National Emergency Blood Matching Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.15] text-balance">
                Connecting Life-Saving Donors with Patients in Need
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl text-balance">
                Find compatible blood donors in your city within minutes or register as a voluntary donor to save lives during critical trauma and emergency surgeries.
              </p>

              {/* Quick Search Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
                  Instant Blood Search
                </span>
                <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="ALL">All Blood Groups</option>
                      {bloodGroupList.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} Blood
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      City / Area / PIN
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        placeholder="e.g. Mumbai, Delhi, 400058"
                        className="w-full text-xs px-3 py-2.5 pl-9 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={onOpenCompatibilityModal}
                    className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                  >
                    Not sure? View Blood Compatibility Guide →
                  </button>
                  <span className="hidden sm:inline">100% Free & Voluntary</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('become-donor')}
                  className="px-5 py-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>Become a Registered Donor</span>
                </button>

                <button
                  onClick={() => setActiveTab('request-blood')}
                  className="px-5 py-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Post Urgent Blood Request</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 aspect-16/11 sm:aspect-4/3">
                <img
                  src="/src/assets/images/hero_blood_donation_1791738738570.jpg"
                  alt="Compassionate healthcare voluntary blood donation"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    // Fallback container if needed
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Safe & Regulated Donation Centers</span>
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    "A single unit can save up to 3 individual lives."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Platform Statistics Row */}
        <div className="border-t border-slate-200 bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Registered Donors
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                  {stats ? stats.totalDonors : '10+'}
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Active Profiles</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Verified across 8 major cities</p>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Available Now
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                  {stats ? stats.availableDonors : '8'}
                </span>
                <span className="text-xs text-red-600 font-semibold">Immediate Call</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Ready for emergency dispatch</p>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Blood Requests Handled
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                  {stats ? stats.totalRequests : '4'}
                </span>
                <span className="text-xs text-blue-600 font-semibold">Tracked Live</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Hospitals & direct emergency wards</p>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Lives Impacted Est.
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-red-600 font-mono tabular-nums">
                  {stats ? stats.livesSavedEst : '150+'}
                </span>
                <span className="text-xs text-slate-600 font-semibold">Potential</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Based on voluntary donations</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Live Blood Group Availability Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Blood Group Availability Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Current real-time inventory of registered active voluntary donors by blood type
            </p>
          </div>
          <button
            onClick={() => setActiveTab('find-donor')}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View all matching donors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {bloodGroupList.map((bg) => {
            const counts = stats?.groupCounts[bg] || { total: 1, available: 1 };
            const isRare = bg === 'AB-' || bg === 'O-' || bg === 'B-';

            return (
              <div
                key={bg}
                onClick={() => {
                  onQuickSearch(bg, '');
                  setActiveTab('find-donor');
                }}
                className="bg-white border border-slate-200 hover:border-red-400 rounded-xl p-4 text-center transition-all hover:shadow-md cursor-pointer group"
              >
                <div className="w-10 h-10 mx-auto rounded-lg bg-red-50 text-red-600 font-extrabold text-sm flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {bg}
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-slate-900 block font-mono tabular-nums">
                    {counts.available} Available
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {counts.total} Registered
                  </span>
                </div>
                {isRare && (
                  <span className="inline-block mt-2 text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    Rare Type
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Urgent Emergency Blood Requests */}
      {urgentRequests.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50/60 border border-red-200 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-950">
                    Urgent Emergency Patient Requests
                  </h2>
                  <p className="text-xs text-slate-600">
                    These patients are in immediate surgical, trauma, or pediatric treatment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('request-blood')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Post New Blood Request
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgentRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold text-xs rounded-md">
                        {req.bloodGroup} Needed
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        req.urgency === 'critical' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {req.urgency === 'critical' ? '⚡ Critical' : 'Urgent'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 mt-3">
                      {req.patientName}
                    </h3>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{req.hospitalName}, {req.city}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>Required: <strong className="font-mono">{req.units} Units</strong></span>
                      </p>
                    </div>

                    {req.notes && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg line-clamp-2">
                        {req.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Req Date: {req.requiredDate}
                    </span>
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="text-xs font-bold text-red-600 hover:text-red-700"
                    >
                      Call Attendant →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. How BloodConnect Works (3 Editorial Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-2">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            How BloodConnect Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Bridging donors and seekers transparently without red tape during critical moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-base text-slate-900">Search or Register</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Voluntary donors register their blood type, location, and availability. Requesters filter by exact blood group and pin code to locate matching candidates.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-base text-slate-900">Authorize Direct Contact</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              To prevent unsolicited calls while ensuring emergency access, seekers verify the patient and hospital to securely unlock direct phone and WhatsApp lines.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-base text-slate-900">Hospital Donation & Life Saved</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The donor visits the verified hospital blood bank. Standard screening and cross-matching take place before safe transfusion to the recipient.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Medical Donor Eligibility Checklist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Clinical Safety Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Who Can Safely Donate Blood?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Blood donation is safe, simple, and takes less than 15 minutes. Ensure you satisfy standard health parameters:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Age: 18 to 65 years old</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Weight: Minimum 45kg (50kg+ advised)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hemoglobin: At least 12.5 g/dL</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Donation interval: 90 days since last donation</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setActiveTab('become-donor')}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Register as a Donor Now
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-slate-700 shadow-md aspect-4/3">
                <img
                  src="/src/assets/images/blood_donation_care_1791738749231.jpg"
                  alt="Clinical blood donation care"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
