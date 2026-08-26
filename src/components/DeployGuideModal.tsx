import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Server,
  Cloud,
  Database,
  FileCode,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPABASE_SQL_SCHEMA } from '../lib/sql_schema';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HTACCESS_CODE = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>`;

const VERCEL_CONFIG_CODE = `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'vercel' | 'hostinger' | 'supabase'>('vercel');
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [copiedHtaccess, setCopiedHtaccess] = useState(false);
  const [copiedVercel, setCopiedVercel] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'sql' | 'htaccess' | 'vercel') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2000);
    } else if (type === 'htaccess') {
      setCopiedHtaccess(true);
      setTimeout(() => setCopiedHtaccess(false), 2000);
    } else {
      setCopiedVercel(true);
      setTimeout(() => setCopiedVercel(false), 2000);
    }
    confetti({ particleCount: 25, spread: 35 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Server className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Panduan Hosting & Database</h2>
            <p className="text-xs text-slate-400">
              KIPAW IG BOOSTER 100% siap di-hosting di Vercel, Hostinger, dan Supabase
            </p>
          </div>
        </div>

        {/* Tab Switcher Bento */}
        <div className="flex rounded-2xl bg-slate-950/60 p-1 mb-6 border border-slate-800/80 text-xs font-bold">
          <button
            onClick={() => setTab('vercel')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'vercel'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Vercel (Recommended)</span>
          </button>
          <button
            onClick={() => setTab('hostinger')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'hostinger'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Hostinger cPanel</span>
          </button>
          <button
            onClick={() => setTab('supabase')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              tab === 'supabase'
                ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase SQL</span>
          </button>
        </div>

        {/* Tab 1: Vercel */}
        {tab === 'vercel' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-indigo-200 space-y-2">
              <p className="font-bold text-sm text-white">Langkah Deploy ke Vercel (Gratis & Cepat):</p>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                <li>Push kode repository ini ke GitHub atau GitLab Anda.</li>
                <li>Buka dashboard <b>Vercel.com</b> → klik <b>"Add New..."</b> → <b>"Project"</b>.</li>
                <li>Impor repository dan pilih framework <b>Vite</b>.</li>
                <li>Pastikan file <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">vercel.json</code> sudah ada di root project.</li>
                <li>Klik <b>"Deploy"</b>. Website Anda langsung online dengan HTTPS gratis!</li>
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-300">File vercel.json (Sudah Dibuat di Root):</span>
                <button
                  onClick={() => handleCopy(VERCEL_CONFIG_CODE, 'vercel')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 text-[11px] font-bold flex items-center space-x-1 border border-slate-700/50 cursor-pointer"
                >
                  {copiedVercel ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedVercel ? 'Tersalin' : 'Salin JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] text-pink-300 overflow-x-auto">
                {VERCEL_CONFIG_CODE}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Hostinger */}
        {tab === 'hostinger' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-purple-200 space-y-2">
              <p className="font-bold text-sm text-white">Langkah Deploy ke Hostinger (Shared / Cloud):</p>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                <li>Jalankan perintah <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">npm run build</code> di terminal Anda.</li>
                <li>Folder <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">dist/</code> akan terbuat dengan seluruh file HTML, JS, dan CSS statis.</li>
                <li>Buka <b>hPanel Hostinger</b> → Masuk ke <b>File Manager</b> → Buka folder <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">public_html/</code>.</li>
                <li>Upload seluruh isi folder <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">dist/</code> ke <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">public_html/</code>.</li>
                <li>Buat file <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">.htaccess</code> di <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">public_html/</code> agar routing halaman tidak 404 saat di-refresh.</li>
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-300">Isi File .htaccess untuk Hostinger:</span>
                <button
                  onClick={() => handleCopy(HTACCESS_CODE, 'htaccess')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 text-[11px] font-bold flex items-center space-x-1 border border-slate-700/50 cursor-pointer"
                >
                  {copiedHtaccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHtaccess ? 'Tersalin' : 'Salin .htaccess'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] text-amber-300 overflow-x-auto">
                {HTACCESS_CODE}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Supabase */}
        {tab === 'supabase' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 space-y-2">
              <p className="font-bold text-sm text-white">Setup Database PostgreSQL di Supabase:</p>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                <li>Buka <b>Supabase.com</b> dan buat Project Baru (Gratis).</li>
                <li>Buka menu <b>SQL Editor</b> di sidebar kiri Supabase.</li>
                <li>Klik tombol <b>"Salin SQL Schema Lengkap"</b> di bawah, lalu paste dan klik <b>RUN</b>.</li>
                <li>Semua tabel, index, foreign key, dan RLS security policies akan otomatis terpasang.</li>
                <li>Copy <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">SUPABASE_URL</code> dan <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">SUPABASE_ANON_KEY</code> ke file <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-pink-400 font-mono">.env</code> Anda.</li>
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-300">PostgreSQL Schema KIPAW IG BOOSTER:</span>
                <button
                  onClick={() => handleCopy(SUPABASE_SQL_SCHEMA, 'sql')}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:opacity-95 text-white text-xs font-bold flex items-center space-x-1.5 shadow cursor-pointer"
                >
                  {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSQL ? 'SQL Schema Tersalin!' : 'Salin SQL Schema Lengkap'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-[10px] text-emerald-300 max-h-48 overflow-y-auto">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
