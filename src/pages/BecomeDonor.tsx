import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  Calendar,
  Lock,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { BloodGroup } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BecomeDonorProps {
  onSuccessRedirect: () => void;
}

export const BecomeDonor: React.FC<BecomeDonorProps> = ({ onSuccessRedirect }) => {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [weight, setWeight] = useState<number>(65);
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [availability, setAvailability] = useState<'available' | 'on_call' | 'unavailable'>('available');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [notes, setNotes] = useState('');

  // Medical declarations
  const [declaredFit, setDeclaredFit] = useState(false);
  const [declaredNoInfection, setDeclaredNoInfection] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDonor, setSuccessDonor] = useState<any | null>(null);

  const bloodGroupList: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validations
    if (!fullName.trim() || !email.trim() || !phone.trim() || !city.trim() || !pinCode.trim()) {
      setError('Please fill out all mandatory fields marked with an asterisk.');
      return;
    }

    if (age < 18 || age > 65) {
      setError('Voluntary donors must be between 18 and 65 years of age according to health regulations.');
      return;
    }

    if (weight < 45) {
      setError('Minimum donor body weight is 45kg to donate whole blood safely.');
      return;
    }

    if (!declaredFit || !declaredNoInfection) {
      setError('Please review and check the medical fitness declarations.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.registerDonor({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        bloodGroup,
        age: Number(age),
        gender,
        weight: Number(weight),
        city: city.trim(),
        area: area.trim() || city.trim(),
        pinCode: pinCode.trim(),
        availability,
        lastDonationDate: lastDonationDate || undefined,
        notes: notes.trim() || undefined,
        password: password ? password : 'donor123',
      });

      setSuccessDonor(res.donor);
      if (user) {
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setIsLoading(false);
    }
  };

  if (successDonor) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Registration Successful
            </span>
            <h2 className="text-2xl font-extrabold text-slate-950 mt-1">
              Welcome to the BloodConnect Life-Saving Network!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{successDonor.fullName}</strong>. Your voluntary donor profile with blood group{' '}
              <strong className="text-red-600 font-bold">{successDonor.bloodGroup}</strong> is now live in{' '}
              <strong>{successDonor.city}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Donor ID</span>
              <span className="font-mono font-bold text-slate-900">{successDonor.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Current Status</span>
              <span className="font-semibold text-emerald-700 capitalize">{successDonor.availability}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Location</span>
              <span className="font-medium text-slate-800">{successDonor.city}, {successDonor.pinCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact</span>
              <span className="font-mono text-slate-800">{successDonor.phone}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onSuccessRedirect}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Go to Donor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 fill-red-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Register as a Voluntary Blood Donor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Your voluntary donation is the most precious gift to a fellow human in emergency surgery or trauma.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        
        {/* Section 1: Personal & Contact Information */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            1. Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@example.com"
                  className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile / Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            {!user && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Account Password (Optional)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters (for donor login)"
                    className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Medical & Blood Profile */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            2. Medical & Blood Parameters
          </h2>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Blood Group *
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {bloodGroupList.map((bg) => (
                  <button
                    type="button"
                    key={bg}
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      bloodGroup === bg
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-red-300 hover:bg-red-50/30'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (18 - 65) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="65"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight in KG (Min 45kg) *
                </label>
                <input
                  type="number"
                  min="45"
                  max="160"
                  required
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Donation Date (if applicable)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Must be $\ge$ 90 days prior for whole blood eligibility.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donor Availability Status *
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                >
                  <option value="available">Available Now (Emergency & Routine)</option>
                  <option value="on_call">On Call (Advance 2-4 Hours Notice)</option>
                  <option value="unavailable">Temporarily Ineligible / Away</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Geographic Location */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            3. City & Area
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Pune"
                  className="w-full text-xs px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area / Suburb
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Andheri West, Kothrud"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="e.g. 400058"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Donor Note / Preferred Days (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Available on weekends; happy to donate platelets or whole blood."
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Section 4: Health Declarations */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Voluntary Health & Ethics Declarations</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={declaredFit}
                onChange={(e) => setDeclaredFit(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>
                I confirm that I am in good overall health, free from active fevers or acute infections, and have not consumed heavy alcohol in the last 24 hours.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={declaredNoInfection}
                onChange={(e) => setDeclaredNoInfection(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>
                I declare that I have tested negative for blood-borne diseases (HIV, Hepatitis B/C, Syphilis) and agree to standard hospital blood screening prior to any donation.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>{isLoading ? 'Registering Your Profile...' : 'Complete Voluntary Donor Registration'}</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-3">
            By registering, your contact details will be responsibly shared with verified patient emergency requests only.
          </p>
        </div>
      </form>
    </div>
  );
};
