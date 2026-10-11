/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyBanner } from './components/EmergencyBanner';
import { BloodCompatibilityModal } from './components/BloodCompatibilityModal';
import { Home } from './pages/Home';
import { FindDonor } from './pages/FindDonor';
import { BecomeDonor } from './pages/BecomeDonor';
import { RequestBlood } from './pages/RequestBlood';
import { DonorDashboard } from './pages/DonorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginRegister } from './pages/LoginRegister';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { BloodRequest, BloodGroup } from './types';
import { api } from './services/api';

function MainAppContent() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [criticalRequests, setCriticalRequests] = useState<BloodRequest[]>([]);
  const [isCompatModalOpen, setIsCompatModalOpen] = useState<boolean>(false);
  const [compatModalInitialGroup, setCompatModalInitialGroup] = useState<BloodGroup>('O+');

  // Search filter passed from Home to FindDonor
  const [searchParams, setSearchParams] = useState<{ bloodGroup: string; city: string }>({
    bloodGroup: 'ALL',
    city: '',
  });

  // Load critical emergency requests for top alert banner
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.getBloodRequests({ urgency: 'critical', status: 'pending' });
        setCriticalRequests(res.requests);
      } catch (err) {
        console.warn('Could not load critical requests for banner', err);
      }
    };
    fetchAlerts();
  }, [activeTab]);

  const handleQuickSearch = (bloodGroup: string, city: string) => {
    setSearchParams({ bloodGroup, city });
    setActiveTab('find-donor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCompatModal = (group?: BloodGroup) => {
    if (group) setCompatModalInitialGroup(group);
    setIsCompatModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-red-500 selection:text-white">
      {/* 1. Critical Blood Alert Strip */}
      <EmergencyBanner
        criticalRequests={criticalRequests}
        onViewRequests={() => {
          setActiveTab('request-blood');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenEmergencyModal={() => {
          setActiveTab('request-blood');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 3. Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            setActiveTab={setActiveTab}
            onQuickSearch={handleQuickSearch}
            onOpenCompatibilityModal={() => handleOpenCompatModal('O+')}
          />
        )}

        {activeTab === 'find-donor' && (
          <FindDonor
            initialBloodGroup={searchParams.bloodGroup}
            initialCity={searchParams.city}
            onOpenRequestModal={() => setActiveTab('request-blood')}
            onOpenCompatibilityModal={() => handleOpenCompatModal('O+')}
          />
        )}

        {activeTab === 'become-donor' && (
          <BecomeDonor
            onSuccessRedirect={() => {
              setActiveTab('donor-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'request-blood' && <RequestBlood />}

        {activeTab === 'donor-dashboard' && <DonorDashboard />}

        {activeTab === 'admin-dashboard' && <AdminDashboard />}

        {activeTab === 'auth' && (
          <LoginRegister
            onSuccess={() => {
              if (user?.role === 'admin') setActiveTab('admin-dashboard');
              else if (user?.role === 'donor') setActiveTab('donor-dashboard');
              else setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutUs
            onOpenCompatibilityModal={() => handleOpenCompatModal('O-')}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'contact' && <ContactUs />}
      </main>

      {/* 4. Footer */}
      <Footer
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 5. Blood Compatibility Matrix Modal */}
      <BloodCompatibilityModal
        isOpen={isCompatModalOpen}
        onClose={() => setIsCompatModalOpen(false)}
        initialGroup={compatModalInitialGroup}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
