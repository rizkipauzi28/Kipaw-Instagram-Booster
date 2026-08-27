import { FollowerAccount, FollowerQualityType, BoosterSpeedType } from '../types';

// Curated authentic Indonesian and international avatar dataset with Unsplash portraits
const INDONESIAN_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
];

const INDONESIAN_NAMES = [
  { name: 'Dimas Pratama', handle: 'dimas_pratama21', bio: 'Lifestyle & Tech enthusiast ☕ Jakarta' },
  { name: 'Anisa Salsabila', handle: 'anisasalsabila.id', bio: 'Fashion, coffee & travel moments ✨' },
  { name: 'Rendy Saputra', handle: 'rendy_saputraa', bio: 'Content Creator & Photographer 📸 Bandung' },
  { name: 'Bella Novita', handle: 'bellanovita.real', bio: 'Beauty & Skincare reviewer 🌸 Yogyakarta' },
  { name: 'Bagas Aditya', handle: 'bagasaditya_id', bio: 'Digital Marketer & Food Hunter 🍔' },
  { name: 'Clarissa Wijaya', handle: 'clarissa.wijayaa', bio: 'Fashion stylist & OOTD daily 🎀 Surabaya' },
  { name: 'Kevin Hermawan', handle: 'kevin_hermawan99', bio: 'Fitness & Healthy lifestyle coach 💪' },
  { name: 'Zahra Putri', handle: 'zahraputri.official', bio: 'Book lover, design & architecture 🌿' },
  { name: 'Fajar Nugraha', handle: 'fajarnugraha_dev', bio: 'Software engineer & tech geek 💻 Semarang' },
  { name: 'Nabila Syahrini', handle: 'nabilasyahrini_', bio: 'Daily vlogger & culinary explorer 🍜' },
  { name: 'Arya Wicaksono', handle: 'arya_wicaksono', bio: 'Music producer & vinyl collector 🎧 Bali' },
  { name: 'Dinda Lestari', handle: 'dindalestari.id', bio: 'Plant mom & minimalist aesthetic 🪴' },
  { name: 'Reza Firmansyah', handle: 'reza.firmansyah_', bio: 'Automotive & motorcycle enthusiast 🏍️' },
  { name: 'Tiara Amanda', handle: 'tiaraamanda_real', bio: 'Self development & mental health advocate 📖' },
  { name: 'Gilang Ramadhan', handle: 'gilangramadhan.id', bio: 'Street style & sneakers lover 👟 Medan' },
  { name: 'Siti Rahmawati', handle: 'sitirahma_official', bio: 'Baking & homemade pastry lover 🍰 Malang' },
  { name: 'Andi Pratama', handle: 'andipratama_lens', bio: 'Landscape & drone cinematic 🏔️' },
  { name: 'Maya Anggraini', handle: 'mayaanggraini_', bio: 'Art, pottery & watercolor paintings 🎨' },
  { name: 'Ilham Kusuma', handle: 'ilhamkusuma.id', bio: 'Entrepreneur & startup builder 🚀 Jakarta' },
  { name: 'Melati Indah', handle: 'melatiindah.style', bio: 'Modest fashion & lifestyle inspiration 🧕' },
  { name: 'Rifky Hidayat', handle: 'rifky_hidayat28', bio: 'Barista & Specialty coffee lover ☕ Bandung' },
  { name: 'Vania Aurelia', handle: 'vania.aurelia_', bio: 'Travel blogger & island hopper 🌴' },
  { name: 'Doni Prasetyo', handle: 'doniprasetyo_real', bio: 'Graphic design & creative direction ✨' },
  { name: 'Putri Handayani', handle: 'putrihandayani.id', bio: 'Beauty enthusiast & daily makeup tips 💄' },
  { name: 'Bayu Wicaksono', handle: 'bayuwicaksono_99', bio: 'Running & Marathon runner 🏃‍♂️ Solo' },
];

const GLOBAL_NAMES = [
  { name: 'Alex Morgan', handle: 'alex.morgan_v', bio: 'Creative director & visual artist 🌐 Los Angeles' },
  { name: 'Sarah Jenkins', handle: 'sarah.jenkins_', bio: 'Interior design & modern spaces 🌿 London' },
  { name: 'Liam Lindqvist', handle: 'liam_nordic', bio: 'Minimalism, architecture & coffee ☕ Stockholm' },
  { name: 'Elena Rostova', handle: 'elena.rostova_art', bio: 'Digital artist & illustrator 🎨 Berlin' },
  { name: 'Marco Rossi', handle: 'marco.rossi_it', bio: 'Culinary chef & Italian gastronomy 🍝 Milan' },
  { name: 'Chloe Dubois', handle: 'chloe.dubois_paris', bio: 'Fashion editor & vintage curator 🥐 Paris' },
  { name: 'Kenji Takahashi', handle: 'kenji.takahashi_tokyo', bio: 'Urban photography & street neon 🇯🇵 Tokyo' },
  { name: 'Lucas Silva', handle: 'lucas_silva_rio', bio: 'Surfing, music & coastal vibes 🌊 Rio' },
  { name: 'Hannah Schmidt', handle: 'hannah.schmidt_de', bio: 'Sustainable living & eco design 🌱 Munich' },
  { name: 'Daniel Kim', handle: 'danielkim.seoul', bio: 'Tech founder & product designer ⚡ Seoul' },
];

export const SERVER_NODES = [
  { id: 'node-jkt-01', name: '🇮🇩 Node Cluster Jakarta (Active)', ping: '8ms', status: 'ONLINE', load: '18%' },
  { id: 'node-sgp-02', name: '🇸🇬 Node Singapore-Central', ping: '14ms', status: 'ONLINE', load: '24%' },
  { id: 'node-tky-03', name: '🇯🇵 Node Tokyo-HighSpeed', ping: '38ms', status: 'ONLINE', load: '12%' },
];

export function generateFollowerAccounts(
  count: number,
  quality: FollowerQualityType = 'INDONESIA_REAL'
): FollowerAccount[] {
  const result: FollowerAccount[] = [];
  const namePool = quality === 'GLOBAL_MIX' ? [...GLOBAL_NAMES, ...INDONESIAN_NAMES] : INDONESIAN_NAMES;

  for (let i = 0; i < count; i++) {
    const template = namePool[i % namePool.length];
    const avatar = INDONESIAN_AVATARS[i % INDONESIAN_AVATARS.length];
    const randomSuffix = i >= namePool.length ? `_${Math.floor(Math.random() * 900 + 100)}` : '';
    const now = Date.now() - (count - i) * 1200; // staggered timestamps

    result.push({
      id: `flw_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      username: `${template.handle}${randomSuffix}`,
      fullName: template.name,
      avatarUrl: avatar,
      isVerified: i % 15 === 0,
      followedAt: new Date(now).toISOString(),
      postsCount: Math.floor(Math.random() * 80 + 12),
      followersCount: Math.floor(Math.random() * 3500 + 450),
      bio: template.bio,
      location: quality === 'GLOBAL_MIX' ? 'International' : 'Indonesia',
    });
  }

  return result;
}
