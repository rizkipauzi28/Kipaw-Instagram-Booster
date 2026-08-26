import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  ShieldCheck,
  Heart,
  UserCheck,
  Eye,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
  Smartphone,
  ChevronDown,
  Flame,
  Instagram
} from 'lucide-react';
import { PlatformStats } from '../types';

interface LandingPageProps {
  stats: PlatformStats;
  onStartFree: () => void;
  onLogin: () => void;
  onExploreTasks: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  onStartFree,
  onLogin,
  onExploreTasks,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const niches = [
    { name: 'Fashion & Style', icon: '👗', count: '120+ Akun' },
    { name: 'Kuliner & Foodies', icon: '🍜', count: '95+ Akun' },
    { name: 'Beauty & Skincare', icon: '✨', count: '80+ Akun' },
    { name: 'Gaming & Streamer', icon: '🎮', count: '65+ Akun' },
    { name: 'Technology & Gadget', icon: '💻', count: '110+ Akun' },
    { name: 'Business & UMKM', icon: '💼', count: '140+ Akun' },
    { name: 'Travel & Wisata', icon: '✈️', count: '75+ Akun' },
    { name: 'Education & Tips', icon: '📚', count: '50+ Akun' },
  ];

  const faqs = [
    {
      q: 'Apakah KIPAW IG BOOSTER menggunakan Bot atau Akun Palsu?',
      a: 'Sama sekali TIDAK! Kami 100% melarang bot, akun palsu, auto-like, atau auto-follow. Semua interaksi dilakukan secara manual oleh pengguna nyata melalui aplikasi resmi Instagram di smartphone mereka.',
    },
    {
      q: 'Apakah saya perlu memasukkan kata sandi atau password Instagram?',
      a: 'TIDAK PERNAH! KIPAW IG BOOSTER tidak pernah meminta password, cookie, atau session token Instagram. Akun Anda 100% aman di tangan Anda sendiri.',
    },
    {
      q: 'Bagaimana cara mendapatkan IG Points?',
      a: 'Anda bisa mendapatkan IG Points secara gratis dengan menyelesaikan tugas sederhana (Follow, Like postingan, Beri komentar relevan, atau Tonton Story) dari anggota komunitas lain, mengklaim Daily Streak harian, atau mengundang teman.',
    },
    {
      q: 'Bagaimana sistem memastikan user benar-benar melakukan follow/like?',
      a: 'Setiap anggota yang menyelesaikan tugas wajib mengunggah bukti screenshot dan konfirmasi username. Sistem serta tim moderator memvalidasi bukti sebelum poin diberikan dan sebelum progres campaign bertambah.',
    },
    {
      q: 'Apakah platform ini gratis?',
      a: 'Ya, 100% GRATIS! Tidak ada paket langganan, top-up uang tunai, maupun payment gateway. Semua pertumbuhan didasarkan pada prinsip gotong royong saling bertukar engagement.',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-900/20 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>100% Organic & Real Community Network</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Grow Your Instagram With{' '}
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent underline decoration-pink-500/40 decoration-wavy decoration-2">
              Real People
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Dapatkan exposure, followers, likes, dan engagement dari komunitas pengguna nyata. Saling bantu, kumpulkan poin, dan tingkatkan jangkauan akun Instagram Anda secara organik.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreTasks}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 transition flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Jelajahi Task Center</span>
            </button>
          </div>

          {/* Safety Guarantees Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tanpa Password Instagram</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tanpa Bot & Akun Palsu</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Screenshot Manual</span>
            </span>
          </div>
        </div>
      </section>

      {/* Real-time Dynamic Database Stats Bar */}
      <section className="relative -mt-6 z-10 max-w-6xl mx-auto px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Live Database Statistics (Real Counts)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
            <div className="pt-3 md:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-purple-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold">Total Members</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.totalMembers.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="pt-3 md:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">Tasks Completed</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.tasksCompleted.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="pt-3 md:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-pink-400 mb-1">
                <UserCheck className="w-4 h-4" />
                <span className="text-xs font-semibold">Followers Earned</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.followersEarned.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="pt-3 md:pt-0">
              <div className="flex items-center justify-center space-x-1.5 text-rose-400 mb-1">
                <Heart className="w-4 h-4" />
                <span className="text-xs font-semibold">Likes Earned</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.likesEarned.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="pt-3 md:pt-0 col-span-2 md:col-span-1">
              <div className="flex items-center justify-center space-x-1.5 text-indigo-400 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-semibold">Views Earned</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats.viewsEarned.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Cara Kerja) Section */}
      <section id="cara-kerja" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
            Cara Kerja Sistem
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Gotong Royong Engagement 3 Langkah Mudah
          </p>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Sistem dirancang adil dan transparan. Tidak ada uang yang ditukar, hanya kontribusi nyata antar kreator.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg relative group hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-lg mb-6 shadow-inner">
              01
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Kerjakan Task Komunitas</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Pilih task yang tersedia di Task Center (Follow, Like, Komentar, Story View). Buka aplikasi Instagram Anda dan selesaikan secara manual.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
              <span className="text-pink-400 font-bold">Contoh:</span> Follow @tokosaya → Dapatkan +10 IG Points
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg relative group hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-extrabold text-lg mb-6 shadow-inner">
              02
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Verifikasi Bukti Screenshot</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Upload screenshot bukti tindakan di Instagram. Sistem & moderator memvalidasi bahwa Anda benar-benar melakukan interaksi.
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold">Status:</span> Pending → Checking → Approved (Poin cair)
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 shadow-lg relative group hover:border-purple-500/40 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-lg mb-6 shadow-inner">
              03
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Buat Boost Campaign Anda</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Gunakan poin yang terkumpul untuk membuat campaign followers, likes, atau views Anda sendiri. Anggota lain akan membantu akun Anda!
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
              <span className="text-amber-400 font-bold">Hasil:</span> 50 Followers baru dari pengguna Indonesia asli!
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix: Real Humans vs Fake Bots */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
              Keamanan Akun
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">
              Mengapa KIPAW IG BOOSTER Aman untuk Akun Instagram Anda?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* The Safe Way (Kipaw) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/20 backdrop-blur-md border border-emerald-500/30 shadow-lg">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-lg mb-4">
                <CheckCircle2 className="w-6 h-6" />
                <span>KIPAW IG BOOSTER (Organik Nyata)</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pengguna asli membuka aplikasi Instagram di smartphone masing-masing.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tidak pernah meminta kata sandi, cookies, atau session Instagram.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Engagement berkualitas dari audiens sesuai niche (Kuliner, Fashion, Bisnis, dll).</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tidak terkena shadowban atau pembersihan algoritma Instagram.</span>
                </li>
              </ul>
            </div>

            {/* The Dangerous Way (Bots) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-red-950/20 backdrop-blur-md border border-red-500/30 shadow-lg">
              <div className="flex items-center space-x-2 text-red-400 font-bold text-lg mb-4">
                <XCircle className="w-6 h-6" />
                <span>Panel Bot / Jual Beli Followers Palsu</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Akun bot tanpa foto, nama acak, dan zero engagement rate.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Sering meminta login/cookie yang membahayakan akun Anda dari hack.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Followers drop drastis saat Instagram melakukan razia akun bot.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Merusak reach dan algoritma akun Anda di masa mendatang.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community Niche Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Komunitas Beragam
          </h2>
          <p className="text-3xl font-extrabold text-white">
            Temukan Kreator & Bisnis Sesuai Niche Anda
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {niches.map((niche, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 hover:border-purple-500/40 transition flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-lg"
              onClick={onStartFree}
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition transform">{niche.icon}</span>
              <h4 className="font-bold text-white text-sm">{niche.name}</h4>
              <span className="text-xs text-slate-400 mt-1">{niche.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2">
            FAQ
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            Pertanyaan Yang Sering Diajukan
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 overflow-hidden transition shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-semibold text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-pink-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-indigo-900/40 backdrop-blur-md border border-purple-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Siap Mengembangkan Instagram Anda Hari Ini?
            </h2>
            <p className="text-purple-200 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Bergabunglah dengan ribuan kreator dan pemilik bisnis lainnya. Mulai kumpulkan IG Points gratis dan dapatkan engagement organik sekarang juga!
            </p>
            <button
              onClick={onStartFree}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-base shadow-2xl transition transform hover:scale-105 cursor-pointer"
            >
              Daftar Akun Gratis Sekarang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
