import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  Instagram,
  Clock,
  Coins,
  CheckCircle2,
  ExternalLink,
  Upload,
  AlertTriangle,
  FileText,
  X,
  ShieldCheck,
  Flame,
  ArrowRight,
  Eye,
  MessageSquare,
  Heart,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskType, NicheType, User, TaskSubmission } from '../types';
import { storage } from '../lib/storage';

interface TaskCenterProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

const SAMPLE_SCREENSHOTS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
];

export const TaskCenter: React.FC<TaskCenterProps> = ({ currentUser, onOpenAuth }) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNiche, setSelectedNiche] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskStep, setTaskStep] = useState<'details' | 'upload' | 'success'>('details');

  // Proof submission states
  const [proofImage, setProofImage] = useState<string>(SAMPLE_SCREENSHOTS[0]);
  const [proofText, setProofText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasOpenedInstagram, setHasOpenedInstagram] = useState(false);

  const availableTasks = storage.getAvailableTasks(currentUser?.id);

  // Filter tasks
  const filteredTasks = availableTasks.filter((task) => {
    if (selectedType !== 'ALL' && task.type !== selectedType) return false;
    if (selectedNiche !== 'ALL' && task.niche !== selectedNiche) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.targetUsername.toLowerCase().includes(q) ||
        task.niche.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartTask = (task: Task) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setActiveTask(task);
    setTaskStep('details');
    setHasOpenedInstagram(false);
    setSubmitError('');
    setProofText('');
  };

  const handleOpenInstagram = () => {
    if (!activeTask) return;
    setHasOpenedInstagram(true);
    // Open target Instagram URL in new tab
    let url = activeTask.targetUrl;
    if (!url.startsWith('http')) {
      url = `https://instagram.com/${activeTask.targetUsername}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProofImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = () => {
    if (!currentUser || !activeTask) return;
    setIsSubmitting(true);
    setSubmitError('');

    const res = storage.submitTaskProof({
      taskId: activeTask.id,
      userId: currentUser.id,
      proofImageUrl: proofImage,
      proofText: proofText || `Telah menyelesaikan task ${activeTask.type} untuk @${activeTask.targetUsername}`,
    });

    setIsSubmitting(false);

    if (!res.success) {
      setSubmitError(res.error || 'Gagal mengirimkan bukti.');
      return;
    }

    setTaskStep('success');
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.6 },
    });
  };

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'FOLLOW':
        return <UserCheck className="w-4 h-4 text-pink-400" />;
      case 'LIKE':
        return <Heart className="w-4 h-4 text-rose-400" />;
      case 'COMMENT':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'STORY_VIEW':
        return <Eye className="w-4 h-4 text-indigo-400" />;
      case 'PROFILE_VISIT':
        return <Instagram className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bento Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Task Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Selesaikan Tugas & Kumpulkan IG Points
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Bantu anggota komunitas dengan follow, like, atau komentar secara manual melalui aplikasi Instagram Anda. Dapatkan poin untuk menumbuhkan akun Anda sendiri!
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Bento Box */}
      <div className="p-5 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 space-y-3.5 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari task, username Instagram, atau niche..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Niche Selector */}
          <div className="sm:w-48">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">Semua Kategori (Niche)</option>
              <option value="Fashion">Fashion</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Beauty">Beauty</option>
              <option value="Gaming">Gaming</option>
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Travel">Travel</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        {/* Task Type Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'ALL', label: 'Semua Task' },
            { id: 'FOLLOW', label: 'Follow (+10 Pts)' },
            { id: 'LIKE', label: 'Like (+5 Pts)' },
            { id: 'COMMENT', label: 'Komentar (+15 Pts)' },
            { id: 'STORY_VIEW', label: 'Story View (+3 Pts)' },
            { id: 'PROFILE_VISIT', label: 'Kunjungan (+2 Pts)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards Bento Grid */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 space-y-3 shadow-xl">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Belum Ada Task Sesuai Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah filter kategori atau buat campaign baru agar anggota lain dapat mengerjakan tugas Anda.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.isCompletedByMe;
            return (
              <div
                key={task.id}
                className="p-6 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800 text-[11px] font-bold">
                      {getTaskIcon(task.type)}
                      <span className="text-slate-200">{task.type}</span>
                    </div>

                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 text-xs font-black">
                      <Coins className="w-3.5 h-3.5" />
                      <span>+{task.rewardPoints} Pts</span>
                    </div>
                  </div>

                  {/* Title & IG Username */}
                  <h3 className="font-bold text-sm text-white line-clamp-2 mb-1 group-hover:text-purple-300 transition">
                    {task.title}
                  </h3>

                  <p className="text-xs font-mono text-pink-400 flex items-center space-x-1 mb-3">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>@{task.targetUsername}</span>
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {task.description}
                  </p>
                </div>

                <div>
                  {/* Metadata */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 py-2 border-t border-slate-800/80 mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/60 text-slate-400 font-medium">
                      {task.niche}
                    </span>
                    <span className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Est. {task.estimatedTimeSeconds} detik</span>
                    </span>
                  </div>

                  {/* Action Button */}
                  {isCompleted ? (
                    <div className="w-full py-2.5 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sudah Dikerjakan</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartTask(task)}
                      className="w-full py-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Mulai Kerjakan (+{task.rewardPoints} Pts)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Execution Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveTask(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Details & Open Instagram */}
            {taskStep === 'details' && (
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-lg">
                    {getTaskIcon(activeTask.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400">
                      Task {activeTask.type}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {activeTask.title}
                    </h3>
                  </div>
                </div>

                {/* Target Account Info */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Target Akun Instagram:</span>
                    <span className="text-xs font-mono font-bold text-pink-400">
                      @{activeTask.targetUsername}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Reward Poin:</span>
                    <span className="text-xs font-extrabold text-amber-300">
                      +{activeTask.rewardPoints} IG Points
                    </span>
                  </div>
                  {activeTask.commentGuide && (
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">Panduan Komentar:</span>
                      <p className="text-xs font-medium text-purple-300 italic bg-purple-950/30 p-2 rounded-lg border border-purple-500/20">
                        "{activeTask.commentGuide}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2 text-xs text-slate-300">
                  <p className="font-bold text-purple-300">Langkah Pengerjaan:</p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                    <li>Klik tombol <b>"Buka Instagram"</b> di bawah ini.</li>
                    <li>Lakukan {activeTask.type} secara manual di aplikasi Instagram Anda.</li>
                    <li>Ambil screenshot bukti setelah selesai.</li>
                    <li>Kembali ke website ini dan klik <b>"Saya Sudah Selesai"</b>.</li>
                  </ol>
                </div>

                {/* Open Instagram Action */}
                <button
                  onClick={handleOpenInstagram}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-900/30 flex items-center justify-center space-x-2 transition"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Buka Instagram (@{activeTask.targetUsername})</span>
                  <ExternalLink className="w-4 h-4" />
                </button>

                {/* Proceed Button */}
                <button
                  onClick={() => {
                    if (!hasOpenedInstagram) {
                      handleOpenInstagram();
                    }
                    setTaskStep('upload');
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
                >
                  {hasOpenedInstagram ? 'Saya Sudah Selesai → Upload Bukti' : 'Buka Instagram & Lanjutkan'}
                </button>
              </div>
            )}

            {/* Step 2: Upload Proof */}
            {taskStep === 'upload' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-purple-400 font-bold text-sm">
                  <Upload className="w-4 h-4" />
                  <span>Upload Bukti Screenshot</span>
                </div>

                <p className="text-xs text-slate-300">
                  Unggah screenshot layar Instagram Anda yang memperlihatkan bahwa Anda telah melakukan{' '}
                  <span className="font-bold text-pink-400">{activeTask.type}</span> pada{' '}
                  <span className="font-bold text-white">@{activeTask.targetUsername}</span>.
                </p>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                    {submitError}
                  </div>
                )}

                {/* Screenshot Upload Dropzone */}
                <div className="p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-800 text-center space-y-3">
                  {proofImage ? (
                    <div className="space-y-2">
                      <div className="max-h-48 overflow-hidden rounded-xl border border-slate-800 flex items-center justify-center bg-slate-900">
                        <img
                          src={proofImage}
                          alt="Screenshot Proof"
                          className="max-h-48 object-contain"
                        />
                      </div>
                      <p className="text-[10px] text-emerald-400 font-bold">
                        ✓ Bukti screenshot siap dikirim
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-400">Pilih file screenshot dari perangkat</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2">
                    <label className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white text-xs font-bold cursor-pointer transition">
                      <span>Pilih File Screenshot</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Proof Notes Input */}
                <div>
                  <label className="block font-semibold text-slate-300 text-xs mb-1">
                    Catatan / Komentar Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="Contoh: Sudah di-follow via akun @username_saya"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTaskStep('details')}
                    className="w-1/3 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Kembali
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitProof}
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Bukti Task'}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation */}
            {taskStep === 'success' && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Bukti Berhasil Dikirim!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Terima kasih telah berkontribusi! Reward{' '}
                  <span className="text-amber-300 font-bold">+{activeTask.rewardPoints} IG Points</span>{' '}
                  telah diproses dan ditambahkan ke saldo akun Anda.
                </p>
                <button
                  onClick={() => setActiveTask(null)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                >
                  Ambil Task Lainnya
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
