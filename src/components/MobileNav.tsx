import React from 'react';
import {
  Compass,
  Sparkles,
  Zap,
  PlusCircle,
  Coins,
  User as UserIcon,
} from 'lucide-react';
import { User } from '../types';

interface MobileNavProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Compass },
    { id: 'tasks', label: 'Tasks', icon: Sparkles },
    { id: 'booster', label: 'Booster', icon: Zap },
    { id: 'campaigns', label: 'Campaign', icon: PlusCircle },
    { id: 'points', label: 'Points', icon: Coins },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl px-1.5 py-1">
        <div className="grid grid-cols-6 gap-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`mobile-tab-${tab.id}`}
                onClick={() => {
                  if (!currentUser && tab.id !== 'tasks' && tab.id !== 'dashboard' && tab.id !== 'booster') {
                    onOpenAuth();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-pink-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive ? 'bg-pink-500/15 ring-1 ring-pink-500/30' : ''
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                </div>
                <span className="text-[9px] tracking-tight mt-0.5 truncate max-w-[45px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

