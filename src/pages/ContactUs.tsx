import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  Building,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  const emergencyHelplines = [
    { label: 'National Blood Transfusion Council Helpline', number: '1800-11-2566', desc: 'Toll-free 24/7 support' },
    { label: 'National Emergency Ambulance Service', number: '108 / 911 / 112', desc: 'Immediate trauma dispatch' },
    { label: 'Red Cross Society Blood Services', number: '011-23716441', desc: 'National Blood Bank coordinating unit' },
    { label: 'BloodConnect Technical Operations', number: '+91 98765 00112', desc: 'Platform support & volunteer coordination' },
  ];

  const cityBloodBanks = [
    { city: 'Mumbai', name: 'KEM Hospital Blood Bank / Tata Memorial', phone: '+91 22 2410 7000' },
    { city: 'Delhi', name: 'AIIMS Blood Bank & Rotary Blood Bank', phone: '+91 11 2658 8500' },
    { city: 'Bangalore', name: 'Victoria Hospital / Rashtrotthana Blood Centre', phone: '+91 80 2670 1234' },
    { city: 'Pune', name: 'Sassoon General Hospital / Janakalyan Blood Bank', phone: '+91 20 2612 8000' },
    { city: 'Chennai', name: 'Rajiv Gandhi Govt General Hospital Blood Bank', phone: '+91 44 2530 5000' },
    { city: 'Hyderabad', name: 'Osmania General Hospital Blood Bank', phone: '+91 40 2460 0146' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Emergency Helplines & Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reach our national emergency coordination desks or connect with certified regional blood banks.
        </p>
      </div>

      {/* Emergency Helplines Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencyHelplines.map((h, i) => (
          <div key={i} className="bg-red-50/70 border border-red-200 rounded-2xl p-5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center mb-3">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs text-slate-900 leading-snug">{h.label}</h3>
            <p className="text-sm font-black font-mono text-red-700 mt-2">{h.number}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{h.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-slate-950 mb-1">
            Send an Inquiry or Feedback
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            For college presentation questions, institutional blood drives, or partnership inquiries.
          </p>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-950">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-800">
                Thank you for contacting BloodConnect. Our team will review your message shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Host a Blood Camp">Host a Community Blood Camp</option>
                    <option value="Hospital Blood Bank Integration">Hospital Blood Bank Integration</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you?"
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Major City Blood Banks Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-3">
              <Building className="w-4 h-4 text-red-600" />
              <span>Certified Major City Blood Centers</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Direct emergency contact numbers for major government & tertiary hospital blood banks:
            </p>

            <div className="space-y-3">
              {cityBloodBanks.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.city}</span>
                    <a
                      href={`tel:${item.phone}`}
                      className="font-mono font-bold text-red-600 hover:underline"
                    >
                      {item.phone}
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
