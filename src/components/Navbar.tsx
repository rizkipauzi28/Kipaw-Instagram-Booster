import React, { useState } from 'react';
import {
  Sparkles,
  Coins,
  Bell,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Flame,
  Menu,
  X,
  Database,
  Users,
  Compass,
  PlusCircle,
  HelpCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import { User, NotificationItem } from '../types';
import { storage } from '../lib/storage';
import { KipawLogo } from './KipawLogo';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenDeployGuide: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenDeployGuide,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = currentUser ? storage.getUserNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    storage.logout();
    setShowUserDropdown(false);
    setMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      setActiveTab('home');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass, requiresAuth: true },
    { id: 'tasks', label: 'Task Center', icon: Sparkles, requiresAuth: false },
    { id: 'booster', label: 'IG Booster', icon: Zap, requiresAuth: false },
    { id: 'campaigns', label: 'Campaigns', icon: PlusCircle, requiresAuth: true },
    { id: 'points', label: 'IG Points', icon: Coins, requiresAuth: true },
    { id: 'referral', label: 'Referral', icon: Users, requiresAuth: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Flame, requiresAuth: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/80 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab(currentUser ? 'dashboard' : 'home')}>
            <KipawLogo size="md" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent group-hover:opacity-90 transition">
                  KIPAW
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-pink-300 border border-purple-500/30 font-bold tracking-wider uppercase">
                  IG BOOSTER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">100% Real Organic Engagement Exchange</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-900/40 border border-slate-800/60 rounded-2xl backdrop-blur-md">
            {navItems.map((item) => {
              if (item.requiresAuth && !currentUser) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-white border border-purple-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Deploy & SQL Guide trigger - only visible to ADMIN or when explicitly in admin mode */}
            {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
              <button
                onClick={onOpenDeployGuide}
                title="Panduan Deploy & Database SQL"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 transition shadow-sm cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Deploy & SQL</span>
              </button>
            )}

            {currentUser ? (
              <>
                {/* IG POINTS Balance Pill */}
                <div
                  onClick={() => setActiveTab('points')}
                  className="flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition shadow-sm"
                >
                  <div className="w-5 h-5 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <Coins className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider leading-none">IG Points</span>
                    <span className="text-xs font-black text-amber-300 leading-tight">
                      {currentUser.points.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                    title="Notifikasi"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Popup Box */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-sm text-white">Notifikasi</span>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => storage.markAllNotificationsAsRead(currentUser.id)}
                            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                          >
                            Tandai Semua Dibaca
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 mt-2">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-500 text-sm">
                            Belum ada notifikasi baru.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => storage.markNotificationAsRead(notif.id)}
                              className={`py-3 px-2 rounded-xl cursor-pointer transition ${
                                !notif.isRead ? 'bg-purple-950/30' : 'hover:bg-slate-800/40'
                              }`}
                            >
                              <div className="flex items-start space-x-2.5">
                                <div
                                  className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                    !notif.isRead ? 'bg-pink-500 ring-4 ring-pink-500/20' : 'bg-slate-700'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-200">{notif.title}</p>
                                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{notif.message}</p>
                                  <span className="text-[10px] text-slate-500 mt-1 block">
                                    {new Date(notif.createdAt).toLocaleTimeString('id-ID', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Avatar / Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow shrink-0">
                      {currentUser.avatarUrl || currentUser.instagramProfile?.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl || currentUser.instagramProfile?.avatarUrl}
                          alt={currentUser.username}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        currentUser.displayName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                      @{currentUser.username}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-2">
                        <p className="text-xs font-bold text-white truncate">{currentUser.displayName}</p>
                        <p className="text-[11px] text-purple-400 font-mono truncate">@{currentUser.username}</p>
                        {currentUser.instagramProfile && (
                          <div className="flex items-center space-x-1 mt-1 text-[10px] text-pink-400 font-medium">
                            <span>IG: @{currentUser.instagramProfile.username}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400">{currentUser.instagramProfile.niche}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-xs font-semibold">
                        <button
                          onClick={() => {
                            setActiveTab('booster');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-pink-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20 transition cursor-pointer"
                        >
                          <Zap className="w-4 h-4 text-pink-400" />
                          <span>{currentUser?.role === 'ADMIN' ? '⚡ Injeksi Followers (Admin)' : '🚀 IG Follower Booster'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('profile');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>Profil & Instagram Akun</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('achievements');
                            setShowUserDropdown(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                          <Flame className="w-4 h-4 text-amber-400" />
                          <span>Badges & Achievements</span>
                        </button>

                        {/* Admin Link - Only for ADMIN or MODERATOR */}
                        {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
                          <button
                            onClick={() => {
                              setActiveTab('admin');
                              setShowUserDropdown(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-indigo-300 hover:text-indigo-100 hover:bg-indigo-950/40 border border-indigo-500/20 transition cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <span>Admin Moderation Panel</span>
                          </button>
                        )}

                        <div className="pt-2 mt-2 border-t border-slate-800">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-purple-600/20 transition cursor-pointer"
                >
                  Mulai Gratis
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-2xl bg-slate-900/60 text-slate-300 hover:text-white md:hidden border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            if (item.requiresAuth && !currentUser) return null;
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'MODERATOR') && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-indigo-300 bg-indigo-950/30 border border-indigo-500/30"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Admin Panel (/admin)</span>
            </button>
          )}

          {currentUser && (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-950/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout (Keluar Akun)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
