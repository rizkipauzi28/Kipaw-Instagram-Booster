import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Instagram,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Save,
  Lock,
  Flame,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  LogOut,
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Trash2,
  Globe,
  Check,
  Layers,
  HelpCircle
} from 'lucide-react';
import { User, NicheType } from '../types';
import { storage } from '../lib/storage';

interface ProfileViewProps {
  currentUser: User;
  onLogout?: () => void;
}

const NICHES: NicheType[] = [
  'Fashion',
  'Gaming',
  'Kuliner',
  'Beauty',
  'Education',
  'Business',
  'Technology',
  'Travel',
  'Personal',
  'Other',
];

// Aesthetic avatar presets
const AVATAR_PRESETS = [
  {
    name: 'Tech Pro Male',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    category: 'Realistic',
  },
  {
    name: 'Fashion Creator Female',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    category: 'Realistic',
  },
  {
    name: 'Foodie Guide Male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    category: 'Realistic',
  },
  {
    name: 'Skincare Reviewer Female',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    category: 'Realistic',
  },
  {
    name: 'Aesthetic Studio',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'Realistic',
  },
  {
    name: 'Gamer 3D Neon',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    category: 'Aesthetic',
  },
  {
    name: '3D Explorer Male',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
    category: 'Cartoon',
  },
  {
    name: '3D Aesthetic Female',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica',
    category: 'Cartoon',
  },
  {
    name: 'Lorelei Artist',
    url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna',
    category: 'Anime',
  },
  {
    name: 'Notionist Minimalist',
    url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Marcus',
    category: 'Minimal',
  },
  {
    name: 'Cyber Bot Gamer',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=KipawBot',
    category: 'Robot',
  },
  {
    name: 'Fun Emoji 3D',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=StarGazer',
    category: 'Fun',
  },
];

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onLogout }) => {
  const currentAvatar = currentUser.avatarUrl || currentUser.instagramProfile?.avatarUrl || '';
  
  // Profile info states
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [igUsername, setIgUsername] = useState(currentUser.instagramProfile?.username || '');
  const [profileUrl, setProfileUrl] = useState(
    currentUser.instagramProfile?.profileUrl || `https://instagram.com/${currentUser.username}`
  );
  const [niche, setNiche] = useState<NicheType>(
    currentUser.instagramProfile?.niche || 'Personal'
  );

  // Avatar states
  const [avatarUrl, setAvatarUrl] = useState<string>(currentAvatar);
  const [avatarTab, setAvatarTab] = useState<'upload' | 'preset' | 'url' | 'generator'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlInputError, setUrlInputError] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Handle local file upload with client-side canvas compression to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (.jpg, .jpeg, .png, .webp).');
      return;
    }

    // Limit original file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 10MB.');
      return;
    }

    setIsProcessingFile(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to max 400x400 for super snappy storage and crisp display
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarUrl(compressedDataUrl);
          setIsProcessingFile(false);
        } else {
          // Fallback if canvas context fails
          setAvatarUrl(readerEvent.target?.result as string);
          setIsProcessingFile(false);
        }
      };
      img.onerror = () => {
        setUploadError('Gagal memuat gambar. Silakan coba file lain.');
        setIsProcessingFile(false);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Gagal membaca file gambar.');
      setIsProcessingFile(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL input
  const handleApplyCustomUrl = () => {
    setUrlInputError('');
    const trimmed = customUrlInput.trim();
    if (!trimmed) {
      setUrlInputError('Silakan masukkan tautan URL gambar.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setUrlInputError('URL harus dimulai dengan http:// atau https://');
      return;
    }

    // Verify image can load
    const testImg = new Image();
    testImg.onload = () => {
      setAvatarUrl(trimmed);
      setCustomUrlInput('');
      setUrlInputError('');
    };
    testImg.onerror = () => {
      // Set anyway in case of cross-origin blocks, but alert
      setAvatarUrl(trimmed);
      setCustomUrlInput('');
    };
    testImg.src = trimmed;
  };

  // Generate random DiceBear avatar
  const handleGenerateRandomAvatar = (style: 'adventurer' | 'lorelei' | 'notionists' | 'bottts' | 'avataaars' | 'fun-emoji') => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const newAvatar = `https://api.dicebear.com/7.x/${style}/svg?seed=${randomSeed}`;
    setAvatarUrl(newAvatar);
  };

  // Reset / Remove avatar
  const handleRemoveAvatar = () => {
    const defaultIdenticon = `https://api.dicebear.com/7.x/identicon/svg?seed=${igUsername.trim() || currentUser.username}`;
    setAvatarUrl(defaultIdenticon);
  };

  // Save all profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const res = storage.updateUserProfile(currentUser.id, {
      displayName: displayName.trim() || currentUser.username,
      avatarUrl: avatarUrl.trim(),
      instagramUsername: igUsername,
      instagramProfileUrl: profileUrl,
      niche,
    });

    if (res.success) {
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3500);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsChangingPass(true);
    const res = storage.changePassword(currentUser.id, currentPassword, newPassword);
    setIsChangingPass(false);

    if (!res.success) {
      setPasswordError(res.error || 'Gagal mengubah kata sandi.');
    } else {
      setPasswordSuccess('Kata sandi berhasil diubah! Gunakan kata sandi baru ini saat login berikutnya.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Profile Bento Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {/* Interactive Avatar Container */}
        <div className="relative group shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 p-1 shadow-2xl shadow-purple-900/40">
            <div className="w-full h-full rounded-3xl bg-slate-950 overflow-hidden flex items-center justify-center font-black text-3xl text-white relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || currentUser.displayName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                (displayName || currentUser.displayName).charAt(0).toUpperCase()
              )}

              {/* Hover Edit Overlay */}
              <button
                type="button"
                onClick={() => {
                  const editSection = document.getElementById('avatar-editor-section');
                  editSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer text-white"
                title="Klik untuk ubah foto profil"
              >
                <Camera className="w-6 h-6 text-pink-400 mb-1" />
                <span className="text-[10px] font-bold">Ubah Foto</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 p-2 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg border border-slate-900 hover:scale-105 transition cursor-pointer"
            title="Upload Foto Baru dari Galeri"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{displayName || currentUser.displayName}</h1>
              <span className="px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                {currentUser.role}
              </span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/30 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                title="Keluar dari akun ini"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>
          <p className="text-xs text-slate-400">Email: {currentUser.email}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 flex items-center space-x-1.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Bergabung {new Date(currentUser.createdAt).toLocaleDateString('id-ID')}</span>
            </span>

            <span className="text-[11px] px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-amber-300 flex items-center space-x-1.5 font-bold">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{currentUser.dailyStreak} Hari Streak</span>
            </span>

            <span className="text-[11px] px-3 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 flex items-center space-x-1.5 font-semibold">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>Foto Tampil Publik</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. Dedicated Avatar & Profile Photo Studio Bento Box */}
      <div
        id="avatar-editor-section"
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-purple-500/30 shadow-xl space-y-6 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5 text-purple-300 font-bold text-base">
            <Camera className="w-5 h-5 text-pink-400" />
            <span>Studio Foto Profil Publik</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Foto ini akan tampil di Leaderboard, Marketplace task, & profil komunitas
          </span>
        </div>

        {/* Avatar Method Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setAvatarTab('upload')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer border ${
              avatarTab === 'upload'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-900/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => setAvatarTab('preset')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer border ${
              avatarTab === 'preset'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-900/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Pilihan Avatar</span>
          </button>

          <button
            type="button"
            onClick={() => setAvatarTab('generator')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer border ${
              avatarTab === 'generator'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-900/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Generator</span>
          </button>

          <button
            type="button"
            onClick={() => setAvatarTab('url')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer border ${
              avatarTab === 'url'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white border-transparent shadow-lg shadow-purple-900/30'
                : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Input Link URL</span>
          </button>
        </div>

        {/* Tab 1: Upload File */}
        {avatarTab === 'upload' && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 rounded-3xl border-2 border-dashed border-purple-500/40 hover:border-pink-500 bg-slate-950/60 hover:bg-slate-900/60 transition flex flex-col items-center justify-center text-center cursor-pointer space-y-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-600/20 group-hover:bg-purple-600/30 text-purple-300 flex items-center justify-center transition">
                {isProcessingFile ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-pink-400" />
                ) : (
                  <Upload className="w-6 h-6 text-pink-400" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {isProcessingFile ? 'Sedang Memproses Foto...' : 'Klik atau Tarik Foto ke Sini'}
                </p>
                <p className="text-xs text-slate-400">
                  Mendukung format JPG, PNG, WEBP hingga 10MB. Foto dikompresi otomatis untuk kecepatan maksimal.
                </p>
              </div>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Preset Avatars */}
        {avatarTab === 'preset' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Pilih dari koleksi avatar dan ilustrasi karakter terpopuler:
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {AVATAR_PRESETS.map((preset, idx) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`relative p-2 rounded-2xl bg-slate-950/60 border text-center transition cursor-pointer group flex flex-col items-center space-y-1.5 ${
                      isSelected
                        ? 'border-pink-500 ring-2 ring-pink-500/30 bg-purple-950/30'
                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-300 truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Random AI Generator */}
        {avatarTab === 'generator' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Generate avatar acak unik dengan berbagai macam style ilustrasi AI DiceBear:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleGenerateRandomAvatar('adventurer')}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-purple-500 text-left transition cursor-pointer space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">3D Adventurer</span>
                </div>
                <p className="text-[10px] text-slate-400">Karakter petualang 3D modern</p>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateRandomAvatar('lorelei')}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-pink-500 text-left transition cursor-pointer space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-white">Lorelei Anime</span>
                </div>
                <p className="text-[10px] text-slate-400">Ilustrasi anime artistik elegan</p>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateRandomAvatar('notionists')}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 text-left transition cursor-pointer space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Notionist Minimal</span>
                </div>
                <p className="text-[10px] text-slate-400">Line art minimalis ala Notion</p>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateRandomAvatar('bottts')}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-left transition cursor-pointer space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Cyber Robot</span>
                </div>
                <p className="text-[10px] text-slate-400">Avatar bot mekanik futuristik</p>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateRandomAvatar('avataaars')}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 text-left transition cursor-pointer space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Classic Avataaars</span>
                </div>
                <p className="text-[10px] text-slate-400">Kartun vektor ekspresif</p>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateRandomAvatar('fun-emoji')}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500 text-left transition cursor-pointer space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Fun 3D Emoji</span>
                </div>
                <p className="text-[10px] text-slate-400">Karakter ekspresi wajah 3D ceria</p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: URL Input */}
        {avatarTab === 'url' && (
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 text-xs mb-1.5">
                Tautan Gambar Langsung (Direct Image URL)
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://example.com/foto-profil-anda.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyCustomUrl();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-bold text-xs hover:opacity-95 transition cursor-pointer shrink-0"
                >
                  Terapkan URL
                </button>
              </div>
            </div>

            {urlInputError && (
              <p className="text-xs text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{urlInputError}</span>
              </p>
            )}

            <p className="text-[11px] text-slate-500">
              💡 Tip: Anda dapat menyalin tautan foto dari Unsplash, Pinterest, Imgur, Cloudinary, atau CDN gambar publik mana pun.
            </p>
          </div>
        )}

        {/* Public Appearance Live Simulator */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-pink-400" />
              <span>Simulasi Tampilan Publik Foto Ini:</span>
            </span>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-[11px] text-slate-400 hover:text-red-400 flex items-center space-x-1 transition cursor-pointer"
              title="Reset foto profil ke default"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset ke Default</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Simulation 1: Leaderboard Ranking Item */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Di Leaderboard Komunitas
              </span>
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow shrink-0">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 overflow-hidden flex items-center justify-center font-bold text-xs text-white">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      (displayName || 'U').charAt(0)
                    )}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{displayName || currentUser.displayName}</p>
                  <p className="text-[10px] text-pink-400 font-mono truncate">@{igUsername || currentUser.username}</p>
                </div>
              </div>
            </div>

            {/* Simulation 2: Marketplace Task Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Di Marketplace Task
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg overflow-hidden bg-purple-600/30 border border-purple-500/40 shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[10px] text-white flex items-center justify-center h-full">{(displayName || 'U').charAt(0)}</span>
                  )}
                </div>
                <span className="text-[11px] text-slate-300 truncate">Dibuat oleh @{igUsername || currentUser.username}</span>
              </div>
            </div>

            {/* Simulation 3: Header Navbar */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Di Header & Navigasi
              </span>
              <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-6 h-6 rounded-lg overflow-hidden bg-gradient-to-tr from-purple-600 to-pink-500 shrink-0">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[10px] text-white flex items-center justify-center h-full font-bold">{(displayName || 'U').charAt(0)}</span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-200 truncate">@{currentUser.username}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Instagram & Profile Information Bento Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-6">
        <div className="flex items-center space-x-2 text-pink-400 font-bold text-base pb-3 border-b border-slate-800/80">
          <Instagram className="w-5 h-5" />
          <span>Pengaturan Akun & Profil Instagram</span>
        </div>

        {savedMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2.5 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Perubahan Berhasil Disimpan!</p>
              <p className="text-[11px] text-emerald-300/80">Foto profil dan identitas Anda telah diperbarui dan langsung tampil secara publik.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          {/* Display Name */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Nama Tampilan Profil (Display Name)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Rizki Fauzi / Brand Official"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-purple-500 text-xs"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Nama ini yang akan ditampilkan di profil dan papan peringkat komunitas.
            </p>
          </div>

          {/* Instagram Username */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Username Akun Instagram Anda
            </label>
            <div className="relative">
              <span className="text-slate-500 absolute left-3.5 top-2.5 font-mono">@</span>
              <input
                type="text"
                required
                value={igUsername}
                onChange={(e) => {
                  setIgUsername(e.target.value);
                  setProfileUrl(`https://instagram.com/${e.target.value.replace('@', '')}`);
                }}
                className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Akun ini yang akan menerima followers dan likes saat membuat campaign.
            </p>
          </div>

          {/* Instagram Profile URL */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Tautan Profil Instagram
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                required
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-pink-500 text-xs"
              />
              <button
                type="button"
                onClick={() => window.open(profileUrl, '_blank')}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center space-x-1 cursor-pointer"
                title="Buka URL Profil"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Niche Category */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kategori Niche Akun
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheType)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
            >
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-emerald-400 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>KIPAW IG BOOSTER tidak pernah menyimpan password atau kredensial rahasia Instagram Anda.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Perubahan Profil</span>
          </button>
        </form>
      </div>

      {/* 3. Security & Change Login Password Bento Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <KeyRound className="w-5 h-5" />
            <span>Keamanan & Ubah Kata Sandi Akun</span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            Role: {currentUser.role}
          </span>
        </div>

        {passwordSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-4 rounded-2xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          {/* Current Password */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kata Sandi Lama / Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                placeholder="Masukkan kata sandi lama akun Anda"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentUser.role === 'ADMIN' ? 'Default admin password: admin123' : 'Default user password: password123'}
            </p>
          </div>

          {/* New Password */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                placeholder="Minimal 6 karakter kombinasi aman"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                required
                placeholder="Ketik ulang kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password checklist */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                newPassword.length >= 6 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
              }`}>
                {newPassword.length >= 6 ? '✓' : '•'}
              </div>
              <span>Panjang kata sandi minimal 6 karakter</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                newPassword && newPassword === confirmPassword ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
              }`}>
                {newPassword && newPassword === confirmPassword ? '✓' : '•'}
              </div>
              <span>Konfirmasi kata sandi cocok</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isChangingPass ? 'Memproses...' : 'Perbarui Kata Sandi'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
