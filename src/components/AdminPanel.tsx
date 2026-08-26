import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Settings as SettingsIcon,
  BarChart3,
  TrendingUp,
  Coins,
  Sparkles,
  PlusCircle,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Save,
  MessageSquare,
  Instagram,
  UserX,
  UserCheck,
  Megaphone,
  Database,
  KeyRound,
  Lock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import confetti from 'canvas-confetti';
import {
  User,
  TaskSubmission,
  Campaign,
  SystemSettings,
  AbuseReport,
  PlatformStats
} from '../types';
import { storage } from '../lib/storage';

interface AdminPanelProps {
  currentUser: User | null;
  onOpenDeployGuide: () => void;
}

const COLORS = ['#ec4899', '#a855f7', '#6366f1', '#3b82f6', '#10b981'];

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onOpenDeployGuide }) => {
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'submissions' | 'users' | 'campaigns' | 'settings' | 'reports'
  >('analytics');

  // Review modal state
  const [inspectSubmission, setInspectSubmission] = useState<TaskSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Point adjustment modal state
  const [adjustUser, setAdjustUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState('');

  // Password reset modal state
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [showResetPass, setShowResetPass] = useState(false);
  const [resetPassError, setResetPassError] = useState('');
  const [resetPassSuccess, setResetPassSuccess] = useState('');

  // Suspend modal state
  const [suspendModalUser, setSuspendModalUser] = useState<User | null>(null);
  const [suspensionModalReason, setSuspensionModalReason] = useState('Pelanggaran ketentuan sistem / spam bukti palsu');
  const [banPermanently, setBanPermanently] = useState(false);

  // Delete Campaign modal state
  const [deleteCampaignModal, setDeleteCampaignModal] = useState<Campaign | null>(null);

  // Re-render trigger when storage changes
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = storage.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => unsub();
  }, []);

  // Settings form state
  const currentSettings = storage.getSettings();
  const [settingsForm, setSettingsForm] = useState<SystemSettings>(currentSettings);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const stats = storage.getPlatformStats();
  const allSubmissions = storage.getAllSubmissions();
  const pendingSubmissions = allSubmissions.filter((s) => s.status === 'PENDING' || s.status === 'CHECKING');
  const allUsers = storage.getAllUsers();
  const allCampaigns = storage.getCampaigns();
  const reports = storage.getReports();

  // Chart data
  const engagementDistribution = [
    { name: 'Followers', value: stats.followersEarned },
    { name: 'Likes', value: stats.likesEarned },
    { name: 'Views/Stories', value: stats.viewsEarned },
    { name: 'Comments', value: stats.commentsEarned },
  ];

  const tasksTrendData = [
    { day: 'Sen', tasks: 14 },
    { day: 'Sel', tasks: 22 },
    { day: 'Rab', tasks: 18 },
    { day: 'Kam', tasks: 35 },
    { day: 'Jum', tasks: 48 },
    { day: 'Sab', tasks: 62 },
    { day: 'Min', tasks: stats.tasksCompleted },
  ];

  // Actions
  const handleApproveSubmission = (subId: string) => {
    storage.adminReviewSubmission({
      submissionId: subId,
      approved: true,
      reviewerId: currentUser?.id || 'admin',
    });
    setInspectSubmission(null);
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleRejectSubmission = (subId: string) => {
    storage.adminReviewSubmission({
      submissionId: subId,
      approved: false,
      reviewerId: currentUser?.id || 'admin',
      rejectionReason: rejectionReason || 'Bukti screenshot tidak valid atau belum melakukan aksi.',
    });
    setInspectSubmission(null);
    setRejectionReason('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings(settingsForm);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 2500);
  };

  const handleAdjustPointsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustUser) return;
    storage.adminAdjustUserPoints(adjustUser.id, adjustAmount, adjustReason || 'Penyesuaian Admin');
    setAdjustUser(null);
    setAdjustAmount(100);
    setAdjustReason('');
  };

  // Security Access Guard for non-admin/moderator
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MODERATOR')) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">Akses Terbatas (Admin Only)</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Halaman ini khusus untuk peran Super Admin & Moderator. Akun Anda saat ini memiliki role <span className="font-bold text-pink-400">{currentUser?.role || 'GUEST'}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Admin Header Bento */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white">Admin Control Center (/admin)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen verifikasi task screenshot, pengguna, moderasi campaign, dan parameter reward gotong royong.
          </p>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          <button
            onClick={onOpenDeployGuide}
            className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>SQL Schema & Deploy</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Reset database ke kondisi awal demo?')) {
                storage.resetDatabase();
              }
            }}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs Bento */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-xs font-bold shadow-lg">
        {[
          { id: 'analytics', label: 'Analytics & Charts', icon: BarChart3 },
          {
            id: 'submissions',
            label: `Task Review Queue (${pendingSubmissions.length})`,
            icon: CheckCircle2,
            badge: pendingSubmissions.length > 0 ? pendingSubmissions.length : null,
          },
          { id: 'users', label: `Users (${allUsers.length})`, icon: Users },
          { id: 'campaigns', label: `Campaigns (${allCampaigns.length})`, icon: PlusCircle },
          { id: 'settings', label: 'System Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer ${
                isSel
                  ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. Analytics & Charts View Bento */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-center shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Users</span>
              <p className="text-xl font-extrabold text-white mt-1">{stats.totalMembers}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-center shadow-lg">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Active Users</span>
              <p className="text-xl font-extrabold text-emerald-400 mt-1">{stats.activeMembers}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-center shadow-lg">
              <span className="text-[10px] font-bold text-purple-400 uppercase">Tasks Completed</span>
              <p className="text-xl font-extrabold text-purple-300 mt-1">{stats.tasksCompleted}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-center shadow-lg">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Points Circulation</span>
              <p className="text-xl font-extrabold text-amber-300 mt-1">
                {stats.totalPointsCirculation.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-center shadow-lg">
              <span className="text-[10px] font-bold text-pink-400 uppercase">Campaigns Active</span>
              <p className="text-xl font-extrabold text-pink-300 mt-1">{stats.activeCampaignsCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-center shadow-lg">
              <span className="text-[10px] font-bold text-rose-400 uppercase">Pending Proofs</span>
              <p className="text-xl font-extrabold text-rose-400 mt-1">{stats.pendingReviewsCount}</p>
            </div>
          </div>

          {/* Interactive Recharts Bento */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Task Growth Bar Chart */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Tren Penyelesaian Task Komunitas (Harian)</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksTrendData}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="tasks" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engagement Distribution Pie Chart */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Distribusi Hasil Tindakan Organik (Real Counts)</span>
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={engagementDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {engagementDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] text-slate-400">
                {engagementDistribution.map((item, i) => (
                  <span key={item.name} className="flex items-center space-x-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span>
                      {item.name}: <b>{item.value}</b>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Task Submissions Review Queue Bento */}
      {activeTab === 'submissions' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white">Antrean Verifikasi Bukti Screenshot Task</h2>
            <span className="text-xs text-slate-400">{allSubmissions.length} Total Submissions</span>
          </div>

          <div className="overflow-x-auto">
            {allSubmissions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">Belum ada pengajuan task.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="pb-3">Waktu</th>
                    <th className="pb-3">User Pelaksana</th>
                    <th className="pb-3">Tipe & Target IG</th>
                    <th className="pb-3">Bukti Screenshot</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(sub.submittedAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5">
                        <p className="font-bold text-slate-200">{sub.userDisplayName}</p>
                        <p className="text-[11px] font-mono text-purple-400">
                          {sub.userInstagramUsername}
                        </p>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-bold text-[10px] border border-purple-500/20">
                          {sub.taskType}
                        </span>
                        <p className="text-[11px] font-mono text-pink-400 mt-0.5">
                          @{sub.targetUsername}
                        </p>
                      </td>
                      <td className="py-3.5">
                        {sub.proofImageUrl ? (
                          <button
                            onClick={() => setInspectSubmission(sub)}
                            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-purple-500 text-[10px] text-purple-300 transition cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat Screenshot</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Teks Saja</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            sub.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : sub.status === 'REJECTED'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {sub.status === 'PENDING' || sub.status === 'CHECKING' ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleApproveSubmission(sub.id)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:opacity-95 text-white font-bold text-[11px] transition shadow cursor-pointer"
                              title="Setujui dan berikan poin"
                            >
                              Setujui (+{sub.rewardPoints} Pts)
                            </button>
                            <button
                              onClick={() => setInspectSubmission(sub)}
                              className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30 font-bold text-[11px] transition cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Telah Diproses</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 3. User Management View Bento */}
      {activeTab === 'users' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white">Manajemen Pengguna Platform</h2>
            <span className="text-xs text-slate-400">{allUsers.length} Pengguna Terdaftar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">User & IG</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Saldo IG Points</th>
                  <th className="pb-3">Tasks</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5">
                      <p className="font-bold text-slate-200">{user.displayName}</p>
                      <p className="text-[11px] font-mono text-purple-400">
                        @{user.username} • IG: @{user.instagramProfile?.username || '-'}
                      </p>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-800 text-[10px] font-semibold text-slate-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold font-mono text-amber-300">
                      {user.points.toLocaleString('id-ID')} Pts
                    </td>
                    <td className="py-3.5 text-slate-300">{user.tasksCompletedCount}</td>
                    <td className="py-3.5">
                      {user.isBanned ? (
                        <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold">
                          Banned
                        </span>
                      ) : user.isSuspended ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setAdjustUser(user)}
                          className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/30 text-[11px] font-semibold transition cursor-pointer"
                        >
                          Ubah Poin
                        </button>
                        <button
                          onClick={() => {
                            setResetPasswordUser(user);
                            setNewResetPassword('');
                            setResetPassError('');
                            setResetPassSuccess('');
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition cursor-pointer flex items-center space-x-1"
                          title="Reset Password Akun"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Reset Sandi</span>
                        </button>
                        {user.role !== 'ADMIN' && (
                          user.isSuspended || user.isBanned ? (
                            <button
                              onClick={() => {
                                storage.adminSetUserStatus(user.id, {
                                  isSuspended: false,
                                  isBanned: false,
                                  reason: '',
                                });
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-500/30 transition cursor-pointer"
                              title="Aktifkan kembali akun ini"
                            >
                              Aktifkan (Unsuspend)
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSuspendModalUser(user);
                                setSuspensionModalReason('Pelanggaran ketentuan sistem / spam bukti palsu');
                                setBanPermanently(false);
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-500/30 transition cursor-pointer"
                              title="Suspend akun pengguna ini"
                            >
                              Suspend
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Campaign Moderation View Bento */}
      {activeTab === 'campaigns' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h2 className="text-base font-bold text-white">Semua Boost Campaign Komunitas</h2>
            <span className="text-xs text-slate-400">{allCampaigns.length} Campaign Aktif/Selesai</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3">Pembuat</th>
                  <th className="pb-3">Judul Campaign</th>
                  <th className="pb-3">Tipe & Target IG</th>
                  <th className="pb-3">Progress Real</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Moderasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {allCampaigns.map((cmp) => {
                  const percent = Math.min(100, Math.round((cmp.completedCount / cmp.targetCount) * 100));
                  return (
                    <tr key={cmp.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 font-semibold text-slate-200">@{cmp.creatorUsername}</td>
                      <td className="py-3.5 text-slate-300 max-w-xs truncate font-medium">
                        {cmp.title}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 font-bold text-[10px] border border-pink-500/20">
                          {cmp.type}
                        </span>
                        <p className="text-[11px] font-mono text-purple-400 mt-0.5">
                          @{cmp.targetInstagramUsername}
                        </p>
                      </td>
                      <td className="py-3.5 text-slate-200 font-semibold">
                        {cmp.completedCount} / {cmp.targetCount} ({percent}%)
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            cmp.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {cmp.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {cmp.status === 'ACTIVE' ? (
                            <button
                              onClick={() => storage.adminSetCampaignStatus(cmp.id, 'PAUSED')}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition cursor-pointer"
                              title="Jeda sementara campaign ini"
                            >
                              Jeda
                            </button>
                          ) : (
                            <button
                              onClick={() => storage.adminSetCampaignStatus(cmp.id, 'ACTIVE')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 transition cursor-pointer"
                              title="Aktifkan campaign ini"
                            >
                              Aktifkan
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteCampaignModal(cmp)}
                            className="px-2.5 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 text-red-300 text-[11px] font-semibold border border-red-500/30 transition flex items-center space-x-1 cursor-pointer"
                            title="Hapus campaign / bersihkan misi ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. System Settings View Bento */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base pb-3 border-b border-slate-800/80">
            <SettingsIcon className="w-5 h-5" />
            <span>Pengaturan Global Reward & Anti-Cheat</span>
          </div>

          {settingsSavedMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
              ✓ Pengaturan sistem berhasil disimpan dan diterapkan!
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* Reward Points Matrix */}
            <div>
              <h3 className="font-bold text-white text-sm mb-3">Besaran Reward Task (IG Points)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Follow Reward</label>
                  <input
                    type="number"
                    min={1}
                    value={settingsForm.followReward}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, followReward: parseInt(e.target.value) || 10 })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Like Reward</label>
                  <input
                    type="number"
                    min={1}
                    value={settingsForm.likeReward}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, likeReward: parseInt(e.target.value) || 5 })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Comment Reward</label>
                  <input
                    type="number"
                    min={1}
                    value={settingsForm.commentReward}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, commentReward: parseInt(e.target.value) || 15 })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Story View Reward</label>
                  <input
                    type="number"
                    min={1}
                    value={settingsForm.storyViewReward}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        storyViewReward: parseInt(e.target.value) || 3,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Profile Visit Reward</label>
                  <input
                    type="number"
                    min={1}
                    value={settingsForm.profileVisitReward}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        profileVisitReward: parseInt(e.target.value) || 2,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Referral Reward (Pengundang)</label>
                  <input
                    type="number"
                    min={1}
                    value={settingsForm.referralRewardReferrer}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        referralRewardReferrer: parseInt(e.target.value) || 100,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Anti-Cheat & Limits */}
            <div className="pt-4 border-t border-slate-800/80">
              <h3 className="font-bold text-white text-sm mb-3">Anti-Cheat & Batas Harian</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Batas Maksimal Task Harian / User
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={settingsForm.dailyTaskLimit}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        dailyTaskLimit: parseInt(e.target.value) || 50,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Cooldown Antar Task (Detik)
                  </label>
                  <input
                    type="number"
                    min={5}
                    value={settingsForm.taskCooldownSeconds}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        taskCooldownSeconds: parseInt(e.target.value) || 20,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Banner Setup */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Pengumuman Header (Announcement)</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.announcementActive}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementActive: e.target.checked })
                    }
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-semibold text-slate-300 text-xs">Tampilkan Banner</span>
                </label>
              </div>

              <textarea
                rows={2}
                value={settingsForm.announcementText}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                }
                placeholder="Teks pengumuman untuk seluruh pengguna..."
                className="w-full p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi Sistem</span>
            </button>
          </form>
        </div>
      )}

      {/* Inspect Screenshot & Reject Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white">
              Inspeksi Bukti Task {inspectSubmission.taskType}
            </h3>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
              <p>
                Pelaksana: <b>{inspectSubmission.userDisplayName}</b> ({inspectSubmission.userInstagramUsername})
              </p>
              <p>
                Target Akun: <b>@{inspectSubmission.targetUsername}</b>
              </p>
              <p className="text-purple-300 font-medium">Catatan: "{inspectSubmission.proofText}"</p>
            </div>

            {inspectSubmission.proofImageUrl && (
              <div className="max-h-64 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/80 flex items-center justify-center">
                <img
                  src={inspectSubmission.proofImageUrl}
                  alt="Bukti Screenshot"
                  className="max-h-64 object-contain"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 text-xs mb-1">
                Alasan Penolakan (Jika Ingin Ditolak)
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Contoh: Screenshot buram / belum follow akun target"
                className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setInspectSubmission(null)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleRejectSubmission(inspectSubmission.id)}
                className="w-1/3 py-2.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-500/30 text-xs font-bold cursor-pointer"
              >
                Tolak
              </button>
              <button
                type="button"
                onClick={() => handleApproveSubmission(inspectSubmission.id)}
                className="w-1/3 py-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-xs font-bold cursor-pointer"
              >
                Setujui (+{inspectSubmission.rewardPoints} Pts)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {adjustUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white">
              Penyesuaian Poin @{adjustUser.username}
            </h3>

            <form onSubmit={handleAdjustPointsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Jumlah Poin (Gunakan minus '-' untuk mengurangi)
                </label>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alasan Penyesuaian</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Contoh: Bonus event / Koreksi kesalahan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white text-xs font-bold cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Reset Password Modal */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Reset Kata Sandi Pengguna</h3>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-200">{resetPasswordUser.displayName}</p>
              <p className="text-[11px] font-mono text-purple-400">@{resetPasswordUser.username} • {resetPasswordUser.email}</p>
              <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300">
                Role: {resetPasswordUser.role}
              </span>
            </div>

            {resetPassSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resetPassSuccess}</span>
              </div>
            )}

            {resetPassError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{resetPassError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setResetPassError('');
                setResetPassSuccess('');

                if (newResetPassword.length < 6) {
                  setResetPassError('Kata sandi baru minimal harus 6 karakter.');
                  return;
                }

                const res = storage.adminResetUserPassword(
                  currentUser.id,
                  resetPasswordUser.id,
                  newResetPassword
                );

                if (!res.success) {
                  setResetPassError(res.error || 'Gagal mereset kata sandi.');
                } else {
                  setResetPassSuccess(`Kata sandi akun @${resetPasswordUser.username} berhasil direset!`);
                  setTimeout(() => {
                    setResetPasswordUser(null);
                    setNewResetPassword('');
                  }, 1800);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Kata Sandi Baru untuk User Ini
                </label>
                <div className="relative">
                  <input
                    type={showResetPass ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter..."
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPass(!showResetPass)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showResetPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  User akan dapat langsung login dengan kata sandi baru ini.
                </p>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetPasswordUser(null);
                    setNewResetPassword('');
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  Simpan Sandi Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Suspend User Modal */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Moderasi Suspend Pengguna</h3>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-200">{suspendModalUser.displayName}</p>
              <p className="text-[11px] font-mono text-purple-400">@{suspendModalUser.username} • {suspendModalUser.email}</p>
              <span className="inline-block px-2 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300">
                Poin: {suspendModalUser.points} • Task Selesai: {suspendModalUser.tasksCompletedCount}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                storage.adminSetUserStatus(suspendModalUser.id, {
                  isSuspended: !banPermanently,
                  isBanned: banPermanently,
                  reason: suspensionModalReason.trim() || 'Pelanggaran ketentuan sistem',
                });
                setSuspendModalUser(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Alasan Suspend / Moderasi
                </label>
                <textarea
                  required
                  rows={3}
                  value={suspensionModalReason}
                  onChange={(e) => setSuspensionModalReason(e.target.value)}
                  placeholder="Tuliskan alasan penangguhan..."
                  className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <input
                  type="checkbox"
                  id="banPermanentCheck"
                  checked={banPermanently}
                  onChange={(e) => setBanPermanently(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="banPermanentCheck" className="text-[11px] text-slate-300 font-semibold cursor-pointer">
                  Ban Permanen (Blokir total akun)
                </label>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuspendModalUser(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-amber-600/20 cursor-pointer"
                >
                  {banPermanently ? 'Terapkan Banned' : 'Terapkan Suspend'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Delete Campaign Modal */}
      {deleteCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center space-x-2 text-red-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Hapus Campaign / Misi</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-bold text-[10px] border border-pink-500/20">
                  {deleteCampaignModal.type}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">@{deleteCampaignModal.creatorUsername}</span>
              </div>
              <p className="font-semibold text-slate-200 line-clamp-2">{deleteCampaignModal.title}</p>
              <p className="text-[11px] font-mono text-purple-400">Target: @{deleteCampaignModal.targetInstagramUsername}</p>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                <span>
                  Progress: {deleteCampaignModal.completedCount} / {deleteCampaignModal.targetCount} (
                  {Math.min(100, Math.round((deleteCampaignModal.completedCount / deleteCampaignModal.targetCount) * 100))}%)
                </span>
                <span className={`font-semibold ${deleteCampaignModal.status === 'ACTIVE' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  Status: {deleteCampaignModal.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Apakah Anda yakin ingin menghapus campaign ini? Misi ini akan dibersihkan dari antrean komunitas baik yang sudah selesai maupun yang masih berjalan.
            </p>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCampaignModal(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  storage.adminDeleteCampaign(deleteCampaignModal.id);
                  setDeleteCampaignModal(null);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-gradient-to-tr from-red-600 to-pink-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-red-600/20 cursor-pointer transition flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
