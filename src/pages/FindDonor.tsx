import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { Donor, BloodGroup, BLOOD_COMPATIBILITY } from '../types';
import { api } from '../services/api';
import { ContactDonorModal } from '../components/ContactDonorModal';

interface FindDonorProps {
  initialBloodGroup?: string;
  initialCity?: string;
  onOpenRequestModal?: () => void;
  onOpenCompatibilityModal?: () => void;
}

export const FindDonor: React.FC<FindDonorProps> = ({
  initialBloodGroup = 'ALL',
  initialCity = '',
  onOpenRequestModal,
  onOpenCompatibilityModal,
}) => {
  const [bloodGroup, setBloodGroup] = useState<string>(initialBloodGroup);
  const [city, setCity] = useState<string>(initialCity);
  const [pinCode, setPinCode] = useState<string>('');
  const [availability, setAvailability] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [includeCompatible, setIncludeCompatible] = useState<boolean>(false);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected donor for contact modal
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);

  const bloodGroupList: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const executeSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.searchDonors({
        bloodGroup: bloodGroup !== 'ALL' && !includeCompatible ? bloodGroup : undefined,
        city: city.trim() || undefined,
        pinCode: pinCode.trim() || undefined,
        availability: availability !== 'ALL' ? availability : undefined,
        search: searchTerm.trim() || undefined,
      });

      let results = res.donors;

      // If user enabled "Include compatible donors" for a recipient group
      if (includeCompatible && bloodGroup !== 'ALL' && (bloodGroup in BLOOD_COMPATIBILITY)) {
        const allowedSources = BLOOD_COMPATIBILITY[bloodGroup as BloodGroup].canReceiveFrom;
        results = results.filter((d) => allowedSources.includes(d.bloodGroup));
      }

      setDonors(results);
    } catch (err: any) {
      setError(err.message || 'Failed to search donors.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [bloodGroup, availability, includeCompatible]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const resetFilters = () => {
    setBloodGroup('ALL');
    setCity('');
    setPinCode('');
    setAvailability('ALL');
    setSearchTerm('');
    setIncludeCompatible(false);
  };

  const handleOpenContact = (donor: Donor) => {
    setSelectedDonor(donor);
    setIsContactModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Find Blood Donors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search verified voluntary blood donors by blood type, location, and immediate availability.
          </p>
        </div>

        {onOpenRequestModal && (
          <button
            onClick={onOpenRequestModal}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Need Urgent Blood? Post Request</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          
          {/* Row 1: Blood Group Selector Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Filter by Blood Group
              </label>
              {onOpenCompatibilityModal && (
                <button
                  type="button"
                  onClick={onOpenCompatibilityModal}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Check Compatibility</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setBloodGroup('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  bloodGroup === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Groups
              </button>
              {bloodGroupList.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    bloodGroup === bg
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50/40'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            {bloodGroup !== 'ALL' && (
              <div className="mt-2.5 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeComp"
                  checked={includeCompatible}
                  onChange={(e) => setIncludeCompatible(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="includeComp" className="text-xs text-slate-600 cursor-pointer">
                  Also include all medically compatible donors for recipient group <strong>{bloodGroup}</strong> (e.g. O- universal donors)
                </label>
              </div>
            )}
          </div>

          {/* Row 2: Location and Text Search */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-100">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Pune, Delhi"
                  className="w-full text-xs px-3 py-2 pl-9 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="e.g. 400058"
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Availability
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">Any Availability</option>
                <option value="available">Available Now</option>
                <option value="on_call">On Call (Advance Notice)</option>
                <option value="unavailable">Currently Unavailable</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end gap-2">
              <button
                type="submit"
                className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="p-2 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{donors.length}</strong> matching voluntary donor{donors.length !== 1 ? 's' : ''}
          {city ? ` in "${city}"` : ''}
          {bloodGroup !== 'ALL' ? ` with group ${bloodGroup}` : ''}
        </span>
        <span className="text-[11px] text-slate-400">
          Ranked by availability & donation record
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                <div className="w-20 h-4 bg-slate-200 rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-slate-200 rounded" />
                <div className="w-1/2 h-3 bg-slate-200 rounded" />
              </div>
              <div className="w-full h-8 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Donors Cards Grid */}
      {!isLoading && !error && donors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {donors.map((donor) => {
            const isAvail = donor.availability === 'available';
            const isOnCall = donor.availability === 'on_call';

            return (
              <div
                key={donor.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Blood Group Indicator */}
                      <div className="w-12 h-12 rounded-xl bg-red-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
                        {donor.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-slate-950 truncate max-w-[150px]">
                            {donor.fullName}
                          </h3>
                          {donor.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{donor.city}, {donor.area}</span>
                        </p>
                      </div>
                    </div>

                    {/* Availability Label (Unboxed text with bullet) */}
                    <div className="text-right">
                      <span className={`text-[11px] font-semibold block ${
                        isAvail
                          ? 'text-emerald-700'
                          : isOnCall
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}>
                        {isAvail ? 'Available Now' : isOnCall ? 'On Call' : 'Unavailable'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        PIN: {donor.pinCode}
                      </span>
                    </div>
                  </div>

                  {/* Donor Metadata Strip (Zero-pill text separators) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{donor.age} yrs</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{donor.gender}</span>
                    <span aria-hidden="true">·</span>
                    <span>{donor.weight} kg</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{donor.totalDonations} donations</span>
                  </div>

                  {donor.notes && (
                    <p className="text-[11px] text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-lg line-clamp-2">
                      {donor.notes}
                    </p>
                  )}

                  {donor.lastDonationDate && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Last Donated: {donor.lastDonationDate}</span>
                    </div>
                  )}
                </div>

                {/* Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenContact(donor)}
                    className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Donor</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && donors.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No Donors Found Matching Your Criteria
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            There are currently no registered donors for blood group <strong>{bloodGroup}</strong> in <strong>{city || 'the selected area'}</strong>.
            Try searching for all groups, unchecking specific PIN filters, or posting an emergency blood request immediately.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Reset Search Filters
            </button>
            {onOpenRequestModal && (
              <button
                onClick={onOpenRequestModal}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                Post Emergency Blood Request
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Donor Modal */}
      <ContactDonorModal
        donor={selectedDonor}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};
