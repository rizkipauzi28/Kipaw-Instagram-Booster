import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { TaskCenter } from './components/TaskCenter';
import { CampaignManager } from './components/CampaignManager';
import { PointsLedger } from './components/PointsLedger';
import { Leaderboard } from './components/Leaderboard';
import { Achievements } from './components/Achievements';
import { ReferralCenter } from './components/ReferralCenter';
import { ProfileView } from './components/ProfileView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { KipawLogo } from './components/KipawLogo';
import { storage } from './lib/storage';
import { User } from './types';
import {
  Sparkles,
  Instagram,
  ShieldCheck,
  Heart,
  Server,
  Cloud,
  Layers,
  Database,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);

  // Subscribe to storage changes for reactive state
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      setCurrentUser(storage.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const handleNavigate = (tab: string) => {
    // If navigating to member-only tabs while logged out, prompt login
    if (!currentUser && ['dashboard', 'campaigns', 'points', 'referral', 'profile'].includes(tab)) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    storage.logout();
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background glow for Bento Grid theme */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-purple-900/15 via-pink-900/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-indigo-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-900/15 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentUser && (currentUser.isSuspended || currentUser.isBanned) && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex items-start space-x-3 shadow-lg animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white text-sm">
                ⚠️ Akun Anda Sedang {currentUser.isBanned ? 'Di-Banned Permanen' : 'Di-Suspend Sementara'}
              </p>
              <p className="text-amber-300/90 text-xs leading-relaxed">
                Alasan: <span className="font-semibold text-white">{currentUser.suspensionReason || 'Investigasi moderasi sistem'}</span>. 
                Fungsi pengerjaan task, pembuatan campaign, dan klaim hadiah dibatasi sementara. Hubungi Super Admin jika ini adalah kekeliruan.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <LandingPage
            stats={storage.getPlatformStats()}
            onStartFree={() => handleOpenAuth('register')}
            onLogin={() => handleOpenAuth('login')}
            onExploreTasks={() => handleNavigate('tasks')}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <Dashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onOpenCreateCampaign={() => {
              setActiveTab('campaigns');
              setIsCreateCampaignOpen(true);
            }}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskCenter
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('register')}
          />
        )}

        {activeTab === 'campaigns' && currentUser && (
          <CampaignManager
            currentUser={currentUser}
            onNavigate={handleNavigate}
            isCreateModalOpen={isCreateCampaignOpen}
            setIsCreateModalOpen={setIsCreateCampaignOpen}
          />
        )}

        {activeTab === 'points' && currentUser && (
          <PointsLedger currentUser={currentUser} onNavigate={handleNavigate} />
        )}

        {activeTab === 'leaderboard' && <Leaderboard />}

        {activeTab === 'achievements' && currentUser && (
          <Achievements currentUser={currentUser} />
        )}

        {activeTab === 'referral' && currentUser && (
          <ReferralCenter currentUser={currentUser} />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfileView currentUser={currentUser} onLogout={handleLogout} />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 backdrop-blur-md py-10 mt-16 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <KipawLogo size="sm" />
              <span className="font-extrabold text-sm text-white tracking-wide">
                KIPAW IG BOOSTER
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <button onClick={() => handleNavigate('home')} className="hover:text-purple-400 cursor-pointer">
                Beranda
              </button>
              <button onClick={() => handleNavigate('tasks')} className="hover:text-purple-400 cursor-pointer">
                Task Marketplace
              </button>
              <button onClick={() => handleNavigate('leaderboard')} className="hover:text-purple-400 cursor-pointer">
                Peringkat
              </button>
              {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
                <button onClick={() => handleNavigate('admin')} className="hover:text-indigo-400 font-mono cursor-pointer">
                  /admin
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Organik & Anti-Bot</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <p>
              © {new Date().getFullYear()} KIPAW IG BOOSTER. Komunitas Gotong Royong Instagram Indonesia.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation for Mobile Devices */}
      <MobileNav
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Deploy & Hosting Instructions Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
