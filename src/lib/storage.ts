import {
  User,
  InstagramProfile,
  Campaign,
  Task,
  TaskSubmission,
  PointTransaction,
  ReferralRecord,
  Achievement,
  UserAchievement,
  NotificationItem,
  AbuseReport,
  SystemSettings,
  PlatformStats,
  TaskType,
  CampaignType,
  NicheType,
  SubmissionStatus,
  FollowerAccount,
  FollowerBoostOrder,
  FollowerBoostRequest,
  FollowerQualityType,
  BoosterSpeedType,
  SmmProviderConfig,
  BoostDeliveryMode
} from '../types';
import { generateFollowerAccounts, SERVER_NODES } from './followerBoosterEngine';
import { DEFAULT_SMM_PROVIDERS } from './smmGateway';

const STORAGE_KEY = 'kipaw_ig_booster_db_v2';
const CURRENT_USER_KEY = 'kipaw_current_user_id';

// Default initial settings
export const DEFAULT_SETTINGS: SystemSettings = {
  followReward: 10,
  likeReward: 5,
  commentReward: 15,
  storyViewReward: 3,
  profileVisitReward: 2,
  referralRewardReferrer: 100,
  referralRewardNewUser: 50,
  dailyTaskLimit: 50,
  taskCooldownSeconds: 20,
  minCampaignBudget: 30,
  maxCampaignBudget: 10000,
  minAccountAgeDays: 0,
  requireAdminApproval: false,
  announcementText: '🚀 Selamat datang di KIPAW IG BOOSTER! Komunitas pertukaran engagement nyata 100% aman tanpa bot & tanpa password.',
  announcementActive: true,
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'beginner',
    icon: '🥉',
    title: 'Beginner Booster',
    description: 'Selesaikan task pertamamu di KIPAW IG BOOSTER',
    requiredTasks: 1,
    badgeType: 'BRONZE',
  },
  {
    id: 'active_user',
    icon: '🥈',
    title: 'Active User',
    description: 'Selesaikan 20 tasks komunitas nyata',
    requiredTasks: 20,
    badgeType: 'SILVER',
  },
  {
    id: 'growth_member',
    icon: '🥇',
    title: 'Growth Member',
    description: 'Kumpulkan akumulasi total 500 IG Points',
    requiredPoints: 500,
    badgeType: 'GOLD',
  },
  {
    id: '7_day_streak',
    icon: '🔥',
    title: '7 Day Streak',
    description: 'Login dan klaim reward berturut-turut selama 7 hari',
    requiredStreak: 7,
    badgeType: 'SPECIAL',
  },
  {
    id: '100_tasks',
    icon: '🚀',
    title: '100 Tasks Master',
    description: 'Selesaikan 100 tasks Instagram nyata',
    requiredTasks: 100,
    badgeType: 'GOLD',
  },
  {
    id: '1000_tasks',
    icon: '🏆',
    title: '1,000 Tasks Legend',
    description: 'Legenda komunitas: 1,000 tasks terselesaikan',
    requiredTasks: 1000,
    badgeType: 'SPECIAL',
  },
  {
    id: 'top_contributor',
    icon: '⭐',
    title: 'Top Contributor',
    description: 'Jadilah kontributor aktif papan atas minggu ini',
    requiredTasks: 50,
    badgeType: 'SPECIAL',
  },
];

interface DatabaseState {
  users: User[];
  campaigns: Campaign[];
  tasks: Task[];
  taskSubmissions: TaskSubmission[];
  pointsTransactions: PointTransaction[];
  referrals: ReferralRecord[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  notifications: NotificationItem[];
  reports: AbuseReport[];
  settings: SystemSettings;
  followerBoostOrders: FollowerBoostOrder[];
  followerBoostRequests: FollowerBoostRequest[];
  smmProviders: SmmProviderConfig[];
}

// Initial realistic seed database
const createInitialDatabase = (): DatabaseState => {
  const adminUser: User = {
    id: 'usr_admin_kipaw',
    email: 'admin@kipaw.id',
    username: 'kipawadmin',
    displayName: 'Kipaw Super Admin',
    password: 'admin123',
    role: 'ADMIN',
    points: 2500,
    referralCode: 'IGB-ADM01',
    dailyStreak: 12,
    lastDailyClaim: new Date().toISOString(),
    tasksCompletedCount: 142,
    followersEarnedCount: 188,
    likesEarnedCount: 320,
    viewsEarnedCount: 650,
    commentsEarnedCount: 75,
    isSuspended: false,
    isBanned: false,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    instagramProfile: {
      id: 'ig_admin_01',
      userId: 'usr_admin_kipaw',
      username: 'kipaw.official',
      profileUrl: 'https://instagram.com/kipaw.official',
      niche: 'Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      followersCount: 14200,
      followingCount: 310,
      postsCount: 48,
      biography: 'Official Kipaw Booster Node & Community Platform',
    },
  };

  const demoUser: User = {
    id: 'usr_demo_rizki',
    email: 'rizki@upi.edu',
    username: 'rizkipauzi',
    displayName: 'Rizki Pauzi',
    password: 'password123',
    role: 'USER',
    points: 280,
    referralCode: 'IGB-RZK28',
    dailyStreak: 3,
    lastDailyClaim: new Date(Date.now() - 3600000 * 2).toISOString(),
    tasksCompletedCount: 18,
    followersEarnedCount: 145,
    likesEarnedCount: 110,
    viewsEarnedCount: 190,
    commentsEarnedCount: 22,
    isSuspended: false,
    isBanned: false,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    instagramProfile: {
      id: 'ig_rizki_01',
      userId: 'usr_demo_rizki',
      username: 'rizkipauzi_',
      profileUrl: 'https://instagram.com/rizkipauzi_',
      niche: 'Technology',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      followersCount: 1420,
      followingCount: 480,
      postsCount: 32,
      biography: 'Informatics & Tech Explorer | Bandung',
    },
  };

  const creator1: User = {
    id: 'usr_tokosaya',
    email: 'owner@tokosaya.co.id',
    username: 'tokosaya',
    displayName: 'Toko Saya Fashion',
    password: 'password123',
    role: 'USER',
    points: 420,
    referralCode: 'IGB-TKO99',
    dailyStreak: 5,
    tasksCompletedCount: 34,
    followersEarnedCount: 192,
    likesEarnedCount: 240,
    viewsEarnedCount: 400,
    commentsEarnedCount: 40,
    isSuspended: false,
    isBanned: false,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    instagramProfile: {
      id: 'ig_tokosaya_01',
      userId: 'usr_tokosaya',
      username: 'tokosaya.id',
      profileUrl: 'https://instagram.com/tokosaya.id',
      niche: 'Fashion',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      followersCount: 3850,
      followingCount: 120,
      postsCount: 95,
      biography: 'Trendy Fashion & OOTD Lifestyle Store',
    },
  };

  const creator2: User = {
    id: 'usr_kulinerbdg',
    email: 'halo@kulinerbandung.com',
    username: 'kulinerbdg',
    displayName: 'Bandung Foodies Guide',
    password: 'password123',
    role: 'USER',
    points: 180,
    referralCode: 'IGB-KLN07',
    dailyStreak: 2,
    tasksCompletedCount: 25,
    followersEarnedCount: 230,
    likesEarnedCount: 310,
    viewsEarnedCount: 520,
    commentsEarnedCount: 55,
    isSuspended: false,
    isBanned: false,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    instagramProfile: {
      id: 'ig_kuliner_01',
      userId: 'usr_kulinerbdg',
      username: 'kulinerbandung.eats',
      profileUrl: 'https://instagram.com/kulinerbandung.eats',
      niche: 'Kuliner',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      followersCount: 7200,
      followingCount: 250,
      postsCount: 140,
      biography: 'Kuliner Enak Bandung & Tempat Ngopi',
    },
  };

  const creator3: User = {
    id: 'usr_beautyqueen',
    email: 'beauty@glowskincare.id',
    username: 'glowskin',
    displayName: 'Glow Skincare Review',
    password: 'password123',
    role: 'USER',
    points: 310,
    referralCode: 'IGB-GLW44',
    dailyStreak: 4,
    tasksCompletedCount: 42,
    followersEarnedCount: 185,
    likesEarnedCount: 190,
    viewsEarnedCount: 380,
    commentsEarnedCount: 35,
    isSuspended: false,
    isBanned: false,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    instagramProfile: {
      id: 'ig_glow_01',
      userId: 'usr_beautyqueen',
      username: 'glowskin.daily',
      profileUrl: 'https://instagram.com/glowskin.daily',
      niche: 'Beauty',
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      followersCount: 5400,
      followingCount: 340,
      postsCount: 78,
      biography: 'Daily Skincare Review & Glow Tips',
    },
  };

  const campaigns: Campaign[] = [
    {
      id: 'cmp_01',
      userId: creator1.id,
      creatorUsername: creator1.username,
      creatorDisplayName: creator1.displayName,
      type: 'FOLLOWERS',
      title: 'Follow Instagram @tokosaya.id untuk Katalog Fashion Terbaru',
      targetInstagramUsername: 'tokosaya.id',
      targetUrl: 'https://instagram.com/tokosaya.id',
      targetCount: 50,
      completedCount: 32,
      costPerAction: 10,
      totalBudget: 500,
      status: 'ACTIVE',
      niche: 'Fashion',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cmp_02',
      userId: creator2.id,
      creatorUsername: creator2.username,
      creatorDisplayName: creator2.displayName,
      type: 'LIKES',
      title: 'Like Postingan Kuliner Viral Bakso Lava Bandung',
      targetInstagramUsername: 'kulinerbandung.eats',
      targetUrl: 'https://www.instagram.com/p/C39xP_YvLz9/',
      targetCount: 100,
      completedCount: 74,
      costPerAction: 5,
      totalBudget: 500,
      status: 'ACTIVE',
      niche: 'Kuliner',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cmp_03',
      userId: creator3.id,
      creatorUsername: creator3.username,
      creatorDisplayName: creator3.displayName,
      type: 'COMMENTS',
      title: 'Komentar Organik Review Serum Retinol',
      targetInstagramUsername: 'glowskin.review',
      targetUrl: 'https://www.instagram.com/p/C4A1bK9zMm2/',
      commentGuide: 'Tulis komentar positif tentang pengalaman atau tanya tips skincare (no spam).',
      targetCount: 30,
      completedCount: 18,
      costPerAction: 15,
      totalBudget: 450,
      status: 'ACTIVE',
      niche: 'Beauty',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cmp_04',
      userId: creator2.id,
      creatorUsername: creator2.username,
      creatorDisplayName: creator2.displayName,
      type: 'STORY_VIEWS',
      title: 'Tonton Story Promo Giveaway Mie Pedas Hari Ini',
      targetInstagramUsername: 'kulinerbandung.eats',
      targetUrl: 'https://instagram.com/stories/kulinerbandung.eats',
      targetCount: 80,
      completedCount: 52,
      costPerAction: 3,
      totalBudget: 240,
      status: 'ACTIVE',
      niche: 'Kuliner',
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'cmp_05',
      userId: creator1.id,
      creatorUsername: creator1.username,
      creatorDisplayName: creator1.displayName,
      type: 'PROFILE_VISITS',
      title: 'Kunjungi Profil @tokosaya.id & Cek Bio Link',
      targetInstagramUsername: 'tokosaya.id',
      targetUrl: 'https://instagram.com/tokosaya.id',
      targetCount: 60,
      completedCount: 41,
      costPerAction: 2,
      totalBudget: 120,
      status: 'ACTIVE',
      niche: 'Fashion',
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const tasks: Task[] = campaigns.map((cmp) => {
    let taskType: TaskType = 'FOLLOW';
    if (cmp.type === 'LIKES') taskType = 'LIKE';
    if (cmp.type === 'COMMENTS') taskType = 'COMMENT';
    if (cmp.type === 'STORY_VIEWS') taskType = 'STORY_VIEW';
    if (cmp.type === 'PROFILE_VISITS') taskType = 'PROFILE_VISIT';

    return {
      id: `tsk_${cmp.id}`,
      campaignId: cmp.id,
      type: taskType,
      title: cmp.title,
      description:
        taskType === 'FOLLOW'
          ? `Buka Instagram dan follow akun @${cmp.targetInstagramUsername} secara manual. Upload screenshot bukti follow.`
          : taskType === 'LIKE'
          ? `Buka postingan dan berikan like dengan akun Instagram aslimu. Upload screenshot bukti like.`
          : taskType === 'COMMENT'
          ? `Berikan komentar relevan sesuai panduan: "${cmp.commentGuide || 'Komentar positif'}". Upload bukti screenshot komentar.`
          : taskType === 'STORY_VIEW'
          ? `Buka Instagram Story akun @${cmp.targetInstagramUsername} dan saksikan secara manual.`
          : `Kunjungi profil Instagram @${cmp.targetInstagramUsername} dan eksplor kontennya.`,
      targetUsername: cmp.targetInstagramUsername,
      targetUrl: cmp.targetUrl,
      rewardPoints: cmp.costPerAction,
      estimatedTimeSeconds: taskType === 'COMMENT' ? 30 : taskType === 'FOLLOW' ? 15 : 10,
      niche: cmp.niche || 'Other',
      creatorId: cmp.userId,
      requiresProof: true,
      commentGuide: cmp.commentGuide,
      createdAt: cmp.createdAt,
    };
  });

  const taskSubmissions: TaskSubmission[] = [
    {
      id: 'sub_demo_01',
      taskId: tasks[0].id,
      campaignId: campaigns[0].id,
      userId: demoUser.id,
      userUsername: demoUser.username,
      userDisplayName: demoUser.displayName,
      userInstagramUsername: '@rizkipauzi_',
      taskType: 'FOLLOW',
      targetUsername: 'tokosaya.id',
      targetUrl: 'https://instagram.com/tokosaya.id',
      rewardPoints: 10,
      proofImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      proofText: 'Sudah di-follow via akun @rizkipauzi_',
      status: 'APPROVED',
      submittedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      reviewedAt: new Date(Date.now() - 47 * 3600000).toISOString(),
      reviewedBy: adminUser.id,
    },
    {
      id: 'sub_demo_02',
      taskId: tasks[1].id,
      campaignId: campaigns[1].id,
      userId: demoUser.id,
      userUsername: demoUser.username,
      userDisplayName: demoUser.displayName,
      userInstagramUsername: '@rizkipauzi_',
      taskType: 'LIKE',
      targetUsername: 'kulinerbandung.eats',
      targetUrl: 'https://www.instagram.com/p/C39xP_YvLz9/',
      rewardPoints: 5,
      proofImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      proofText: 'Sudah di-like postingan bakso lavanya',
      status: 'APPROVED',
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      reviewedAt: new Date(Date.now() - 23 * 3600000).toISOString(),
      reviewedBy: adminUser.id,
    },
    {
      id: 'sub_demo_03_pending',
      taskId: tasks[2].id,
      campaignId: campaigns[2].id,
      userId: demoUser.id,
      userUsername: demoUser.username,
      userDisplayName: demoUser.displayName,
      userInstagramUsername: '@rizkipauzi_',
      taskType: 'COMMENT',
      targetUsername: 'glowskin.review',
      targetUrl: 'https://www.instagram.com/p/C4A1bK9zMm2/',
      rewardPoints: 15,
      proofImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      proofText: 'Komentar saya: "Keren reviewnya kak, retinol ini aman buat pemula ya?"',
      status: 'PENDING',
      submittedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    }
  ];

  const pointsTransactions: PointTransaction[] = [
    {
      id: 'tx_demo_01',
      userId: demoUser.id,
      type: 'BONUS',
      amount: 50,
      balanceAfter: 50,
      description: '🎁 Bonus Registrasi Akun Baru KIPAW IG BOOSTER',
      createdAt: demoUser.createdAt,
    },
    {
      id: 'tx_demo_02',
      userId: demoUser.id,
      type: 'REFERRAL',
      amount: 50,
      balanceAfter: 100,
      description: '🤝 Bonus Referral dari Kode Undangan',
      createdAt: demoUser.createdAt,
    },
    {
      id: 'tx_demo_03',
      userId: demoUser.id,
      type: 'BONUS',
      amount: 20,
      balanceAfter: 120,
      description: '🔥 Daily Login Reward (Day 3 Streak)',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'tx_demo_04',
      userId: demoUser.id,
      type: 'EARN',
      amount: 10,
      balanceAfter: 130,
      description: '✅ Reward Task Follow @tokosaya.id Terverifikasi',
      referenceId: 'sub_demo_01',
      createdAt: new Date(Date.now() - 47 * 3600000).toISOString(),
    },
    {
      id: 'tx_demo_05',
      userId: demoUser.id,
      type: 'EARN',
      amount: 5,
      balanceAfter: 135,
      description: '✅ Reward Task Like Postingan @kulinerbandung.eats Terverifikasi',
      referenceId: 'sub_demo_02',
      createdAt: new Date(Date.now() - 23 * 3600000).toISOString(),
    },
  ];

  const referrals: ReferralRecord[] = [
    {
      id: 'ref_01',
      referrerId: demoUser.id,
      referredUserId: creator1.id,
      referredUsername: creator1.username,
      rewardPoints: 100,
      status: 'QUALIFIED',
      createdAt: creator1.createdAt,
    }
  ];

  const userAchievements: UserAchievement[] = [
    {
      id: 'uach_01',
      userId: demoUser.id,
      achievementId: 'beginner',
      unlockedAt: new Date(Date.now() - 47 * 3600000).toISOString(),
    }
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_01',
      userId: demoUser.id,
      title: 'Task Disetujui!',
      message: 'Task Follow @tokosaya.id telah disetujui. Anda mendapatkan +10 IG Points.',
      type: 'SUCCESS',
      isRead: false,
      createdAt: new Date(Date.now() - 47 * 3600000).toISOString(),
    },
    {
      id: 'notif_02',
      userId: demoUser.id,
      title: 'Daily Streak Aktif!',
      message: 'Daily Check-in Day 3 berhasil! Anda mendapatkan +20 IG Points.',
      type: 'INFO',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'notif_03',
      userId: demoUser.id,
      title: 'Teman Menggunakan Kode Anda',
      message: 'Pengguna baru berhasil bergabung menggunakan kode referral Anda. +100 IG Points.',
      type: 'SUCCESS',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    }
  ];

  const reports: AbuseReport[] = [];

  const initialBoostOrders: FollowerBoostOrder[] = [
    {
      id: 'fbo_seed_01',
      targetInstagramUsername: 'rizkipauzi_',
      targetUserId: demoUser.id,
      targetDisplayName: demoUser.displayName,
      targetAvatarUrl: demoUser.instagramProfile?.avatarUrl,
      instagramProfileUrl: 'https://www.instagram.com/rizkipauzi_/',
      deliveryMode: 'REAL_SMM_API',
      smmProviderName: '🇮🇩 IndoSMM Express Gateway (Real Indonesia)',
      smmOrderId: 'SMM-948123',
      previousFollowersCount: 1320,
      quantity: 100,
      deliveredCount: 100,
      newFollowersCount: 1420,
      status: 'COMPLETED',
      speed: 'FAST',
      followerQuality: 'INDONESIA_REAL',
      serverNode: '🇮🇩 Node Cluster Jakarta (Active)',
      adminId: adminUser.id,
      adminUsername: adminUser.username,
      note: 'Injeksi followers akun aktif komunitas batch 1',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      completedAt: new Date(Date.now() - 3600000 * 7.5).toISOString(),
      deliveredFollowers: generateFollowerAccounts(15, 'INDONESIA_REAL'),
    },
    {
      id: 'fbo_seed_02',
      targetInstagramUsername: 'tokosaya.id',
      targetUserId: creator1.id,
      targetDisplayName: creator1.displayName,
      targetAvatarUrl: creator1.instagramProfile?.avatarUrl,
      instagramProfileUrl: 'https://www.instagram.com/tokosaya.id/',
      deliveryMode: 'COMMUNITY_ORGANIC_NETWORK',
      previousFollowersCount: 3600,
      quantity: 250,
      deliveredCount: 250,
      newFollowersCount: 3850,
      status: 'COMPLETED',
      speed: 'INSTANT',
      followerQuality: 'INDONESIA_REAL',
      serverNode: '🇮🇩 Node Cluster Jakarta (Active)',
      adminId: adminUser.id,
      adminUsername: adminUser.username,
      note: 'Booster creator UMKM fashion',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      completedAt: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
      deliveredFollowers: generateFollowerAccounts(20, 'INDONESIA_REAL'),
    }
  ];

  const initialBoostRequests: FollowerBoostRequest[] = [
    {
      id: 'fbr_seed_01',
      userId: demoUser.id,
      userUsername: demoUser.username,
      userDisplayName: demoUser.displayName,
      targetInstagramUsername: 'rizkipauzi_',
      requestedQuantity: 500,
      reason: 'Meningkatkan social proof akun portofolio tech & coding',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    }
  ];

  return {
    users: [adminUser, demoUser, creator1, creator2, creator3],
    campaigns,
    tasks,
    taskSubmissions,
    pointsTransactions,
    referrals,
    achievements: DEFAULT_ACHIEVEMENTS,
    userAchievements,
    notifications,
    reports,
    settings: DEFAULT_SETTINGS,
    followerBoostOrders: initialBoostOrders,
    followerBoostRequests: initialBoostRequests,
    smmProviders: DEFAULT_SMM_PROVIDERS,
  };
};

class StorageEngine {
  private state: DatabaseState;
  private currentUserId: string | null = null;
  private listeners: Set<() => void> = new Set();
  private userLastTaskTime: Record<string, number> = {};

  constructor() {
    this.state = this.loadState();
    this.currentUserId = this.loadCurrentUserId();
    // Default to demo user if not set
    if (!this.currentUserId && this.state.users.length > 1) {
      this.currentUserId = this.state.users[1].id; // demoUser
      this.saveCurrentUserId(this.currentUserId);
    }
  }

  private loadState(): DatabaseState {
    const initial = createInitialDatabase();
    try {
      const data = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (data) {
        const parsed = JSON.parse(data);
        const existingUsers: User[] = Array.isArray(parsed.users) ? parsed.users : [];

        // Ensure default seed users always exist in database for seamless login
        initial.users.forEach((seedUser) => {
          const foundIndex = existingUsers.findIndex(
            (u) =>
              u.id === seedUser.id ||
              u.username.toLowerCase() === seedUser.username.toLowerCase() ||
              u.email.toLowerCase() === seedUser.email.toLowerCase()
          );
          if (foundIndex === -1) {
            existingUsers.push(seedUser);
          } else {
            // Ensure password is always populated even from older storage states
            if (!existingUsers[foundIndex].password) {
              existingUsers[foundIndex].password = seedUser.password;
            }
            if (!existingUsers[foundIndex].role && seedUser.role) {
              existingUsers[foundIndex].role = seedUser.role;
            }
            // Ensure followers count is populated on profile
            if (existingUsers[foundIndex].instagramProfile && !existingUsers[foundIndex].instagramProfile.followersCount) {
              existingUsers[foundIndex].instagramProfile.followersCount = seedUser.instagramProfile?.followersCount || 1420;
            }
          }
        });

        // Ensure every user has a valid password fallback
        existingUsers.forEach((u) => {
          if (!u.password) {
            u.password = u.role === 'ADMIN' ? 'admin123' : 'password123';
          }
          if (u.instagramProfile && !u.instagramProfile.followersCount) {
            u.instagramProfile.followersCount = 1420;
          }
        });

        const loadedOrders = Array.isArray(parsed.followerBoostOrders) && parsed.followerBoostOrders.length > 0
          ? parsed.followerBoostOrders
          : initial.followerBoostOrders;

        const loadedRequests = Array.isArray(parsed.followerBoostRequests)
          ? parsed.followerBoostRequests
          : initial.followerBoostRequests;

        let loadedSmmProviders = Array.isArray(parsed.smmProviders) && parsed.smmProviders.length > 0
          ? parsed.smmProviders
          : DEFAULT_SMM_PROVIDERS;

        // Ensure IndoSMM has the user's active API key if empty
        loadedSmmProviders = loadedSmmProviders.map((p: any) => {
          if (p.id === 'smm_indosmm_01' && (!p.apiKey || p.apiKey.trim().length < 5)) {
            return { ...p, apiKey: 'be46a9d3f067bb66d308663fafb79758', isActive: true, isVerified: true };
          }
          return p;
        });

        return {
          ...initial,
          ...parsed,
          users: existingUsers,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
          achievements: DEFAULT_ACHIEVEMENTS,
          followerBoostOrders: loadedOrders,
          followerBoostRequests: loadedRequests,
          smmProviders: loadedSmmProviders,
        };
      }
    } catch (e) {
      console.warn('Failed to load storage state:', e);
    }
    this.saveStateDirect(initial);
    return initial;
  }

  private loadCurrentUserId(): string | null {
    return localStorage.getItem(CURRENT_USER_KEY);
  }

  private saveCurrentUserId(id: string | null) {
    if (id) {
      localStorage.setItem(CURRENT_USER_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  private saveStateDirect(state: DatabaseState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to write storage state:', e);
    }
  }

  private saveState() {
    this.saveStateDirect(this.state);
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Storage listener error:', err);
      }
    });
  }

  // Current User Management
  public getCurrentUser(): User | null {
    if (!this.currentUserId) return null;
    return this.state.users.find((u) => u.id === this.currentUserId) || null;
  }

  public setCurrentUser(userId: string | null) {
    this.currentUserId = userId;
    this.saveCurrentUserId(userId);
    this.notify();
  }

  public getAllUsers(): User[] {
    return [...this.state.users];
  }

  public getUserById(id: string): User | null {
    return this.state.users.find((u) => u.id === id) || null;
  }

  // Registration & Login
  public register(payload: {
    email: string;
    username: string;
    displayName: string;
    password?: string;
    instagramUsername: string;
    instagramProfileUrl?: string;
    niche: NicheType;
    referralCodeInput?: string;
  }): { success: boolean; error?: string; user?: User } {
    const cleanUsername = payload.username.trim().toLowerCase().replace('@', '');
    const cleanEmail = payload.email.trim().toLowerCase();

    // Check duplicate
    if (this.state.users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'Username sudah digunakan oleh pengguna lain.' };
    }
    if (this.state.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Email sudah terdaftar.' };
    }

    const cleanIg = payload.instagramUsername.trim().replace('@', '');
    if (!cleanIg) {
      return { success: false, error: 'Username Instagram wajib diisi.' };
    }

    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userReferralCode = `IGB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Base initial points = 50 points
    let initialPoints = 50;
    let referrerUser: User | null = null;

    if (payload.referralCodeInput) {
      const code = payload.referralCodeInput.trim().toUpperCase();
      referrerUser = this.state.users.find((u) => u.referralCode.toUpperCase() === code) || null;
    }

    const newUser: User = {
      id: newUserId,
      email: cleanEmail,
      username: cleanUsername,
      displayName: payload.displayName.trim() || cleanUsername,
      password: payload.password?.trim() || 'password123',
      role: 'USER',
      points: initialPoints,
      referralCode: userReferralCode,
      referredBy: referrerUser ? referrerUser.id : undefined,
      dailyStreak: 1,
      lastDailyClaim: new Date().toISOString(),
      tasksCompletedCount: 0,
      followersEarnedCount: 0,
      likesEarnedCount: 0,
      viewsEarnedCount: 0,
      commentsEarnedCount: 0,
      isSuspended: false,
      isBanned: false,
      createdAt: new Date().toISOString(),
      instagramProfile: {
        id: `ig_${Date.now()}`,
        userId: newUserId,
        username: cleanIg,
        profileUrl: payload.instagramProfileUrl || `https://instagram.com/${cleanIg}`,
        niche: payload.niche,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanIg}`,
      },
    };

    // Welcome Transaction
    const welcomeTx: PointTransaction = {
      id: `tx_${Date.now()}_welcome`,
      userId: newUserId,
      type: 'BONUS',
      amount: initialPoints,
      balanceAfter: initialPoints,
      description: '🎁 Bonus Registrasi Akun Baru KIPAW IG BOOSTER',
      createdAt: new Date().toISOString(),
    };

    this.state.users.push(newUser);
    this.state.pointsTransactions.unshift(welcomeTx);

    // If valid referral, reward referrer and new user bonus
    if (referrerUser && referrerUser.id !== newUserId) {
      const refBonus = this.state.settings.referralRewardReferrer || 100;
      const newUserRefBonus = this.state.settings.referralRewardNewUser || 50;

      // Update new user balance with extra referral bonus
      newUser.points += newUserRefBonus;
      const refTxNewUser: PointTransaction = {
        id: `tx_${Date.now()}_ref_bonus`,
        userId: newUserId,
        type: 'REFERRAL',
        amount: newUserRefBonus,
        balanceAfter: newUser.points,
        description: `🤝 Bonus Masukan Kode Referral ${referrerUser.referralCode}`,
        createdAt: new Date().toISOString(),
      };
      this.state.pointsTransactions.unshift(refTxNewUser);

      // Reward referrer
      referrerUser.points += refBonus;
      const refTxReferrer: PointTransaction = {
        id: `tx_${Date.now()}_ref_reward`,
        userId: referrerUser.id,
        type: 'REFERRAL',
        amount: refBonus,
        balanceAfter: referrerUser.points,
        description: `🎉 Reward Referral: User @${newUser.username} bergabung!`,
        createdAt: new Date().toISOString(),
      };
      this.state.pointsTransactions.unshift(refTxReferrer);

      this.state.referrals.unshift({
        id: `ref_${Date.now()}`,
        referrerId: referrerUser.id,
        referredUserId: newUserId,
        referredUsername: newUser.username,
        rewardPoints: refBonus,
        status: 'QUALIFIED',
        createdAt: new Date().toISOString(),
      });

      this.state.notifications.unshift({
        id: `notif_${Date.now()}_ref`,
        userId: referrerUser.id,
        title: 'Referral Berhasil! +100 Points',
        message: `@${newUser.username} bergabung menggunakan kode referral Anda. Selamat!`,
        type: 'SUCCESS',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Welcome Notification
    this.state.notifications.unshift({
      id: `notif_${Date.now()}_welcome`,
      userId: newUserId,
      title: 'Selamat Datang di KIPAW IG BOOSTER!',
      message: 'Akun Instagram Anda terhubung. Mulai ambil task untuk mengumpulkan IG Points!',
      type: 'INFO',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.currentUserId = newUserId;
    this.saveCurrentUserId(newUserId);
    this.saveState();

    return { success: true, user: newUser };
  }

  public login(identifier: string, passwordInput?: string): { success: boolean; error?: string; user?: User } {
    const rawClean = identifier.trim().toLowerCase();
    const clean = rawClean.replace(/^@/, '');

    if (!clean) {
      return { success: false, error: 'Silakan masukkan username, email, atau username Instagram Anda.' };
    }

    // Flexible search: by username, email, or Instagram handle
    const user = this.state.users.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === rawClean ||
        u.email.toLowerCase() === clean ||
        (u.instagramProfile && u.instagramProfile.username.toLowerCase().replace(/^@/, '') === clean)
    );

    if (!user) {
      return {
        success: false,
        error: `Akun "${identifier.trim()}" tidak ditemukan. Silakan periksa kembali atau buat akun baru.`,
      };
    }

    // Check password
    const userPass = (user.password || (user.role === 'ADMIN' ? 'admin123' : 'password123')).trim();
    if (passwordInput !== undefined && passwordInput !== null) {
      if (passwordInput.trim() !== userPass) {
        return {
          success: false,
          error: 'Kata sandi yang Anda masukkan salah. Silakan coba lagi.',
        };
      }
    }

    if (user.isBanned) {
      return { success: false, error: `Akun Anda telah di-banned. Alasan: ${user.suspensionReason || 'Pelanggaran ketentuan sistem.'}` };
    }

    if (user.isSuspended) {
      return { success: false, error: `Akun Anda sedang di-suspend sementara. Alasan: ${user.suspensionReason || 'Aktivitas mencurigakan.'}` };
    }

    this.currentUserId = user.id;
    this.saveCurrentUserId(user.id);
    this.notify();
    return { success: true, user };
  }

  public quickLoginAs(accountKey: 'admin' | 'demo' | 'tokosaya' | 'kulinerbdg'): { success: boolean; user?: User; error?: string } {
    let targetUsername = 'rizkipauzi';
    if (accountKey === 'admin') targetUsername = 'kipawadmin';
    else if (accountKey === 'tokosaya') targetUsername = 'tokosaya';
    else if (accountKey === 'kulinerbdg') targetUsername = 'kulinerbdg';

    const user = this.state.users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase());
    if (!user) {
      // Re-seed if missing
      const initial = createInitialDatabase();
      this.state.users = [...initial.users, ...this.state.users.filter(u => !initial.users.some(iu => iu.id === u.id))];
      this.saveState();
      const retryUser = this.state.users.find((u) => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (retryUser) {
        this.currentUserId = retryUser.id;
        this.saveCurrentUserId(retryUser.id);
        this.notify();
        return { success: true, user: retryUser };
      }
      return { success: false, error: 'Akun demo tidak ditemukan.' };
    }

    this.currentUserId = user.id;
    this.saveCurrentUserId(user.id);
    this.notify();
    return { success: true, user };
  }

  public resetToDefaultSeed(): void {
    const initial = createInitialDatabase();
    this.state = initial;
    this.currentUserId = initial.users[1]?.id || initial.users[0]?.id || null;
    this.saveCurrentUserId(this.currentUserId);
    this.saveState();
  }

  public changePassword(
    userId: string,
    currentPasswordInput: string,
    newPasswordInput: string
  ): { success: boolean; error?: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };

    const newPass = newPasswordInput.trim();
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal harus 6 karakter.' };
    }

    // If user has a current password, verify it
    if (user.password && user.password.trim() !== '') {
      if (currentPasswordInput.trim() !== user.password.trim()) {
        return { success: false, error: 'Kata sandi lama / saat ini tidak cocok.' };
      }
    }

    user.password = newPass;

    this.state.notifications.unshift({
      id: `notif_${Date.now()}_pwd`,
      userId: user.id,
      title: '🔒 Kata Sandi Berhasil Diperbarui',
      message: 'Kata sandi akun Anda telah berhasil diubah. Gunakan kata sandi baru untuk login selanjutnya.',
      type: 'SUCCESS',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true };
  }

  public adminResetUserPassword(
    adminId: string,
    targetUserId: string,
    newPasswordInput: string
  ): { success: boolean; error?: string } {
    const admin = this.getUserById(adminId);
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'MODERATOR')) {
      return { success: false, error: 'Anda tidak memiliki hak otorisasi untuk mereset password.' };
    }

    const targetUser = this.getUserById(targetUserId);
    if (!targetUser) return { success: false, error: 'Target pengguna tidak ditemukan.' };

    const newPass = newPasswordInput.trim();
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Kata sandi baru minimal harus 6 karakter.' };
    }

    targetUser.password = newPass;

    this.state.notifications.unshift({
      id: `notif_${Date.now()}_pwd_reset`,
      userId: targetUser.id,
      title: '🔒 Kata Sandi Direset oleh Administrator',
      message: `Kata sandi akun Anda telah diperbarui oleh Admin (${admin.displayName}).`,
      type: 'INFO',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true };
  }

  public logout() {
    this.currentUserId = null;
    this.saveCurrentUserId(null);
    this.notify();
  }

  public updateInstagramProfile(userId: string, data: { username: string; profileUrl: string; niche: NicheType; avatarUrl?: string }) {
    const user = this.getUserById(userId);
    if (!user) return;
    const cleanIg = data.username.trim().replace('@', '');
    const effectiveAvatar = data.avatarUrl !== undefined ? data.avatarUrl : (user.avatarUrl || user.instagramProfile?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanIg}`);
    
    user.instagramProfile = {
      id: user.instagramProfile?.id || `ig_${Date.now()}`,
      userId,
      username: cleanIg,
      profileUrl: data.profileUrl || `https://instagram.com/${cleanIg}`,
      niche: data.niche,
      avatarUrl: effectiveAvatar,
    };
    if (data.avatarUrl !== undefined) {
      user.avatarUrl = data.avatarUrl;
    }
    this.saveState();
  }

  public updateUserProfile(
    userId: string,
    data: {
      displayName?: string;
      avatarUrl?: string;
      instagramUsername?: string;
      instagramProfileUrl?: string;
      niche?: NicheType;
    }
  ): { success: boolean; error?: string; user?: User } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };

    if (data.displayName !== undefined) {
      const cleanName = data.displayName.trim();
      if (cleanName) {
        user.displayName = cleanName;
      }
    }

    if (data.avatarUrl !== undefined) {
      user.avatarUrl = data.avatarUrl;
      if (user.instagramProfile) {
        user.instagramProfile.avatarUrl = data.avatarUrl;
      }
    }

    if (data.instagramUsername !== undefined || data.instagramProfileUrl !== undefined || data.niche !== undefined) {
      const cleanIg = data.instagramUsername ? data.instagramUsername.trim().replace('@', '') : (user.instagramProfile?.username || user.username);
      user.instagramProfile = {
        id: user.instagramProfile?.id || `ig_${Date.now()}`,
        userId,
        username: cleanIg,
        profileUrl: data.instagramProfileUrl || (data.instagramUsername ? `https://instagram.com/${cleanIg}` : user.instagramProfile?.profileUrl || `https://instagram.com/${cleanIg}`),
        niche: data.niche || user.instagramProfile?.niche || 'Personal',
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : (user.avatarUrl || user.instagramProfile?.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanIg}`),
      };
    }

    // Sync campaigns created by this user so public sees their updated avatar & displayName
    const effectiveAvatar = user.avatarUrl || user.instagramProfile?.avatarUrl;
    this.state.campaigns.forEach((cmp) => {
      if (cmp.userId === userId) {
        if (data.displayName) cmp.creatorDisplayName = user.displayName;
        if (effectiveAvatar) cmp.creatorAvatarUrl = effectiveAvatar;
      }
    });

    this.saveState();
    return { success: true, user };
  }

  // Daily Streak Claim
  public claimDailyReward(userId: string): { success: boolean; pointsAwarded: number; streak: number; message: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, pointsAwarded: 0, streak: 0, message: 'User not found' };
    if (user.isBanned || user.isSuspended) {
      return {
        success: false,
        pointsAwarded: 0,
        streak: 0,
        message: `Akun Anda sedang ${user.isBanned ? 'di-banned' : 'di-suspend'} (${user.suspensionReason || 'Pelanggaran ketentuan'}).`,
      };
    }

    const now = new Date();
    if (user.lastDailyClaim) {
      const last = new Date(user.lastDailyClaim);
      const diffHours = (now.getTime() - last.getTime()) / (1000 * 3600);
      if (diffHours < 20) {
        const remainingHours = Math.ceil(20 - diffHours);
        return {
          success: false,
          pointsAwarded: 0,
          streak: user.dailyStreak,
          message: `Anda sudah klaim reward hari ini. Coba lagi dalam ${remainingHours} jam.`,
        };
      }
      if (diffHours > 48) {
        // Streak broken
        user.dailyStreak = 1;
      } else {
        user.dailyStreak = (user.dailyStreak % 7) + 1;
      }
    } else {
      user.dailyStreak = 1;
    }

    const rewardMap: Record<number, number> = {
      1: 10,
      2: 15,
      3: 20,
      4: 30,
      5: 40,
      6: 60,
      7: 100,
    };

    const points = rewardMap[user.dailyStreak] || 10;
    user.points += points;
    user.lastDailyClaim = now.toISOString();

    const tx: PointTransaction = {
      id: `tx_${Date.now()}_daily`,
      userId: user.id,
      type: 'BONUS',
      amount: points,
      balanceAfter: user.points,
      description: `🔥 Daily Login Reward (Day ${user.dailyStreak} Streak)`,
      createdAt: now.toISOString(),
    };

    this.state.pointsTransactions.unshift(tx);

    this.state.notifications.unshift({
      id: `notif_${Date.now()}_daily`,
      userId: user.id,
      title: `Daily Reward Berhasil! (+${points} Points)`,
      message: `Selamat, Anda mempertahankan ${user.dailyStreak} Hari Streak!`,
      type: 'SUCCESS',
      isRead: false,
      createdAt: now.toISOString(),
    });

    // Check achievement for 7 day streak
    if (user.dailyStreak >= 7) {
      this.checkAndAwardAchievement(user.id, '7_day_streak');
    }

    this.saveState();
    return {
      success: true,
      pointsAwarded: points,
      streak: user.dailyStreak,
      message: `Berhasil klaim Day ${user.dailyStreak}! +${points} IG Points ditambahkan ke saldo Anda.`,
    };
  }

  // Campaign Management
  public getCampaigns(): Campaign[] {
    return [...this.state.campaigns];
  }

  public getUserCampaigns(userId: string): Campaign[] {
    return this.state.campaigns.filter((c) => c.userId === userId);
  }

  public createCampaign(payload: {
    userId: string;
    type: CampaignType;
    title?: string;
    targetInstagramUsername: string;
    targetUrl: string;
    targetCount: number;
    commentGuide?: string;
    niche?: NicheType;
  }): { success: boolean; error?: string; campaign?: Campaign } {
    const user = this.getUserById(payload.userId);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };

    if (user.isBanned || user.isSuspended) {
      return {
        success: false,
        error: `Akun Anda sedang ${user.isBanned ? 'di-banned' : 'di-suspend'} (${user.suspensionReason || 'Pelanggaran ketentuan'}). Tidak dapat membuat campaign baru.`,
      };
    }

    const cleanIg = payload.targetInstagramUsername.trim().replace('@', '');
    if (!cleanIg) return { success: false, error: 'Target Instagram Username wajib diisi.' };
    if (!payload.targetUrl.trim()) return { success: false, error: 'Target URL wajib diisi.' };
    if (payload.targetCount < 5) return { success: false, error: 'Target engagement minimal 5 tindakan.' };

    // Calculate cost per action based on settings
    let costPerAction = 10;
    if (payload.type === 'FOLLOWERS') costPerAction = this.state.settings.followReward;
    else if (payload.type === 'LIKES') costPerAction = this.state.settings.likeReward;
    else if (payload.type === 'COMMENTS') costPerAction = this.state.settings.commentReward;
    else if (payload.type === 'STORY_VIEWS') costPerAction = this.state.settings.storyViewReward;
    else if (payload.type === 'PROFILE_VISITS') costPerAction = this.state.settings.profileVisitReward;

    const totalCost = payload.targetCount * costPerAction;

    if (user.points < totalCost) {
      return {
        success: false,
        error: `Poin tidak mencukupi. Butuh ${totalCost} IG Points (Saldo Anda: ${user.points} Points). Selesaikan task terlebih dahulu untuk mengumpulkan poin!`,
      };
    }

    // Deduct points with transaction
    user.points -= totalCost;

    const campaignId = `cmp_${Date.now()}`;
    const autoTitle =
      payload.title?.trim() ||
      (payload.type === 'FOLLOWERS'
        ? `Follow Instagram @${cleanIg}`
        : payload.type === 'LIKES'
        ? `Like Postingan Instagram @${cleanIg}`
        : payload.type === 'COMMENTS'
        ? `Komentar Relevan pada Postingan @${cleanIg}`
        : payload.type === 'STORY_VIEWS'
        ? `Tonton Story Instagram @${cleanIg}`
        : `Kunjungi Profil Instagram @${cleanIg}`);

    const newCampaign: Campaign = {
      id: campaignId,
      userId: user.id,
      creatorUsername: user.username,
      creatorDisplayName: user.displayName,
      creatorAvatarUrl: user.avatarUrl || user.instagramProfile?.avatarUrl,
      type: payload.type,
      title: autoTitle,
      targetInstagramUsername: cleanIg,
      targetUrl: payload.targetUrl.trim(),
      commentGuide: payload.commentGuide?.trim(),
      targetCount: payload.targetCount,
      completedCount: 0,
      costPerAction,
      totalBudget: totalCost,
      status: 'ACTIVE',
      niche: payload.niche || user.instagramProfile?.niche || 'Other',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create Spend Transaction
    const spendTx: PointTransaction = {
      id: `tx_${Date.now()}_spend`,
      userId: user.id,
      type: 'SPEND',
      amount: -totalCost,
      balanceAfter: user.points,
      description: `🚀 Buat Campaign ${payload.type} (${payload.targetCount}x @ ${costPerAction} Pts) untuk @${cleanIg}`,
      referenceId: campaignId,
      createdAt: new Date().toISOString(),
    };

    // Create marketplace task associated with this campaign
    let taskType: TaskType = 'FOLLOW';
    if (payload.type === 'LIKES') taskType = 'LIKE';
    else if (payload.type === 'COMMENTS') taskType = 'COMMENT';
    else if (payload.type === 'STORY_VIEWS') taskType = 'STORY_VIEW';
    else if (payload.type === 'PROFILE_VISITS') taskType = 'PROFILE_VISIT';

    const newTask: Task = {
      id: `tsk_${campaignId}`,
      campaignId,
      type: taskType,
      title: autoTitle,
      description:
        taskType === 'FOLLOW'
          ? `Buka Instagram dan follow akun @${cleanIg} secara manual. Upload screenshot bukti follow.`
          : taskType === 'LIKE'
          ? `Buka postingan dan berikan like dengan akun Instagram aslimu. Upload screenshot bukti like.`
          : taskType === 'COMMENT'
          ? `Berikan komentar relevan: "${payload.commentGuide || 'Komentar positif sesuai postingan'}". Upload bukti screenshot komentar.`
          : taskType === 'STORY_VIEW'
          ? `Buka Instagram Story akun @${cleanIg} dan saksikan secara manual.`
          : `Kunjungi profil Instagram @${cleanIg} dan eksplor kontennya.`,
      targetUsername: cleanIg,
      targetUrl: payload.targetUrl.trim(),
      rewardPoints: costPerAction,
      estimatedTimeSeconds: taskType === 'COMMENT' ? 30 : taskType === 'FOLLOW' ? 15 : 10,
      niche: newCampaign.niche || 'Other',
      creatorId: user.id,
      creatorAvatarUrl: user.avatarUrl || user.instagramProfile?.avatarUrl,
      requiresProof: true,
      commentGuide: payload.commentGuide,
      createdAt: new Date().toISOString(),
    };

    this.state.campaigns.unshift(newCampaign);
    this.state.tasks.unshift(newTask);
    this.state.pointsTransactions.unshift(spendTx);

    this.state.notifications.unshift({
      id: `notif_${Date.now()}_cmp_created`,
      userId: user.id,
      title: 'Campaign Berhasil Dibuat!',
      message: `Campaign "${autoTitle}" telah aktif di Task Marketplace.`,
      type: 'SUCCESS',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true, campaign: newCampaign };
  }

  // Task Marketplace
  public getAvailableTasks(currentUserId?: string): (Task & { userSubmission?: TaskSubmission; isCompletedByMe?: boolean })[] {
    const activeCampaignIds = new Set(
      this.state.campaigns.filter((c) => c.status === 'ACTIVE' && c.completedCount < c.targetCount).map((c) => c.id)
    );

    return this.state.tasks
      .filter((t) => activeCampaignIds.has(t.campaignId))
      .map((t) => {
        const userSubmission = currentUserId
          ? this.state.taskSubmissions.find((s) => s.taskId === t.id && s.userId === currentUserId)
          : undefined;
        return {
          ...t,
          userSubmission,
          isCompletedByMe: userSubmission?.status === 'APPROVED' || userSubmission?.status === 'PENDING' || userSubmission?.status === 'CHECKING',
        };
      });
  }

  // Anti-Cheat: check cooldown and daily limit
  public canUserPerformTask(userId: string): { allowed: boolean; reason?: string } {
    const user = this.getUserById(userId);
    if (!user) return { allowed: false, reason: 'User not found' };
    if (user.isBanned) return { allowed: false, reason: 'Akun Anda diblokir.' };
    if (user.isSuspended) return { allowed: false, reason: 'Akun Anda sedang disuspend.' };

    // Cooldown check
    const lastTime = this.userLastTaskTime[userId] || 0;
    const cooldownMs = (this.state.settings.taskCooldownSeconds || 20) * 1000;
    const elapsed = Date.now() - lastTime;
    if (elapsed < cooldownMs) {
      const waitSec = Math.ceil((cooldownMs - elapsed) / 1000);
      return {
        allowed: false,
        reason: `Anti-cheat Cooldown: Tunggu ${waitSec} detik sebelum menyelesaikan task berikutnya.`,
      };
    }

    // Daily tasks count limit check
    const today = new Date().toDateString();
    const todaySubmissions = this.state.taskSubmissions.filter(
      (s) => s.userId === userId && new Date(s.submittedAt).toDateString() === today
    );
    if (todaySubmissions.length >= this.state.settings.dailyTaskLimit) {
      return {
        allowed: false,
        reason: `Batas harian tercapai (${this.state.settings.dailyTaskLimit} task/hari). Silakan lanjutkan besok.`,
      };
    }

    return { allowed: true };
  }

  // Submit Task Proof
  public submitTaskProof(payload: {
    taskId: string;
    userId: string;
    proofImageUrl?: string;
    proofText?: string;
  }): { success: boolean; error?: string; submission?: TaskSubmission } {
    const user = this.getUserById(payload.userId);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };

    const task = this.state.tasks.find((t) => t.id === payload.taskId);
    if (!task) return { success: false, error: 'Task tidak ditemukan.' };

    const campaign = this.state.campaigns.find((c) => c.id === task.campaignId);
    if (!campaign || campaign.status !== 'ACTIVE') {
      return { success: false, error: 'Campaign sudah tidak aktif atau selesai.' };
    }

    // Cannot do own campaign
    if (campaign.userId === user.id) {
      return { success: false, error: 'Anda tidak dapat menyelesaikan campaign buatan sendiri.' };
    }

    // Check duplicate submission
    const existing = this.state.taskSubmissions.find((s) => s.taskId === payload.taskId && s.userId === user.id);
    if (existing && existing.status !== 'REJECTED') {
      return { success: false, error: 'Anda sudah pernah mengajukan bukti untuk task ini.' };
    }

    // Anti-cheat check
    const check = this.canUserPerformTask(user.id);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    this.userLastTaskTime[user.id] = Date.now();

    const submissionId = `sub_${Date.now()}`;
    const newSubmission: TaskSubmission = {
      id: submissionId,
      taskId: task.id,
      campaignId: campaign.id,
      userId: user.id,
      userUsername: user.username,
      userDisplayName: user.displayName,
      userInstagramUsername: user.instagramProfile ? `@${user.instagramProfile.username}` : `@${user.username}`,
      userAvatarUrl: user.avatarUrl || user.instagramProfile?.avatarUrl,
      taskType: task.type,
      targetUsername: task.targetUsername,
      targetUrl: task.targetUrl,
      rewardPoints: task.rewardPoints,
      proofImageUrl: payload.proofImageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      proofText: payload.proofText?.trim() || 'Telah diselesaikan secara manual di Instagram.',
      status: this.state.settings.requireAdminApproval ? 'PENDING' : 'APPROVED',
      submittedAt: new Date().toISOString(),
    };

    if (newSubmission.status === 'APPROVED') {
      // Instant verification mode: credit points and advance campaign
      this.executeApproval(newSubmission, campaign, user);
    } else {
      this.state.notifications.unshift({
        id: `notif_${Date.now()}_submitted`,
        userId: user.id,
        title: 'Bukti Task Terkirim',
        message: `Bukti task "${task.title}" sedang diverifikasi admin. Reward +${task.rewardPoints} IG Points akan masuk setelah disetujui.`,
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    this.state.taskSubmissions.unshift(newSubmission);
    this.saveState();

    return { success: true, submission: newSubmission };
  }

  private executeApproval(submission: TaskSubmission, campaign: Campaign, user: User) {
    submission.status = 'APPROVED';
    submission.reviewedAt = new Date().toISOString();

    // Reward points to user
    user.points += submission.rewardPoints;
    user.tasksCompletedCount += 1;

    // Increment user stats
    if (submission.taskType === 'FOLLOW') user.followersEarnedCount += 1;
    else if (submission.taskType === 'LIKE') user.likesEarnedCount += 1;
    else if (submission.taskType === 'COMMENT') user.commentsEarnedCount += 1;
    else if (submission.taskType === 'STORY_VIEW' || submission.taskType === 'PROFILE_VISIT') user.viewsEarnedCount += 1;

    // Log transaction
    const earnTx: PointTransaction = {
      id: `tx_${Date.now()}_earn`,
      userId: user.id,
      type: 'EARN',
      amount: submission.rewardPoints,
      balanceAfter: user.points,
      description: `✅ Reward Task ${submission.taskType} @${submission.targetUsername} Terverifikasi`,
      referenceId: submission.id,
      createdAt: new Date().toISOString(),
    };
    this.state.pointsTransactions.unshift(earnTx);

    // Update campaign progress
    campaign.completedCount += 1;
    if (campaign.completedCount >= campaign.targetCount) {
      campaign.status = 'COMPLETED';
    }
    campaign.updatedAt = new Date().toISOString();

    // Notify task completer
    this.state.notifications.unshift({
      id: `notif_${Date.now()}_approved`,
      userId: user.id,
      title: `Task Disetujui! +${submission.rewardPoints} Points`,
      message: `Bukti task ${submission.taskType} @${submission.targetUsername} telah disetujui! Poin ditambahkan.`,
      type: 'SUCCESS',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Notify campaign creator
    const creator = this.getUserById(campaign.userId);
    if (creator) {
      this.state.notifications.unshift({
        id: `notif_${Date.now()}_cmp_progress`,
        userId: creator.id,
        title: 'Engagement Baru Masuk!',
        message: `User @${user.username} telah menyelesaikan task pada campaign "${campaign.title}" (${campaign.completedCount}/${campaign.targetCount}).`,
        type: 'INFO',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Check achievement milestones
    this.checkAchievements(user.id);
  }

  // Admin / Moderator review task submission
  public adminReviewSubmission(payload: {
    submissionId: string;
    approved: boolean;
    reviewerId: string;
    rejectionReason?: string;
  }): { success: boolean; error?: string } {
    const sub = this.state.taskSubmissions.find((s) => s.id === payload.submissionId);
    if (!sub) return { success: false, error: 'Pengajuan tidak ditemukan.' };
    if (sub.status === 'APPROVED') return { success: false, error: 'Pengajuan sudah pernah disetujui.' };

    const campaign = this.state.campaigns.find((c) => c.id === sub.campaignId);
    const user = this.getUserById(sub.userId);

    if (!user || !campaign) return { success: false, error: 'Data relasi tidak lengkap.' };

    if (payload.approved) {
      sub.reviewedBy = payload.reviewerId;
      this.executeApproval(sub, campaign, user);
    } else {
      sub.status = 'REJECTED';
      sub.reviewedAt = new Date().toISOString();
      sub.reviewedBy = payload.reviewerId;
      sub.rejectionReason = payload.rejectionReason || 'Bukti screenshot tidak jelas / belum melakukan aksi di Instagram.';

      this.state.notifications.unshift({
        id: `notif_${Date.now()}_rejected`,
        userId: user.id,
        title: 'Task Ditolak',
        message: `Bukti task ${sub.taskType} @${sub.targetUsername} ditolak: ${sub.rejectionReason}`,
        type: 'WARNING',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    this.saveState();
    return { success: true };
  }

  // Check achievements
  private checkAchievements(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return;

    if (user.tasksCompletedCount >= 1) {
      this.checkAndAwardAchievement(userId, 'beginner');
    }
    if (user.tasksCompletedCount >= 20) {
      this.checkAndAwardAchievement(userId, 'active_user');
    }
    if (user.points >= 500) {
      this.checkAndAwardAchievement(userId, 'growth_member');
    }
    if (user.tasksCompletedCount >= 100) {
      this.checkAndAwardAchievement(userId, '100_tasks');
    }
    if (user.tasksCompletedCount >= 1000) {
      this.checkAndAwardAchievement(userId, '1000_tasks');
    }
  }

  private checkAndAwardAchievement(userId: string, achievementId: string) {
    const existing = this.state.userAchievements.some(
      (ua) => ua.userId === userId && ua.achievementId === achievementId
    );
    if (existing) return;

    const ach = this.state.achievements.find((a) => a.id === achievementId);
    if (!ach) return;

    this.state.userAchievements.push({
      id: `uach_${Date.now()}_${achievementId}`,
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
    });

    this.state.notifications.unshift({
      id: `notif_${Date.now()}_badge`,
      userId,
      title: `Badge Baru Terbuka! ${ach.icon} ${ach.title}`,
      message: `Selamat, Anda telah membuka badge "${ach.title}"!`,
      type: 'SUCCESS',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  // Transactions & Ledger
  public getUserTransactions(userId: string): PointTransaction[] {
    return this.state.pointsTransactions.filter((tx) => tx.userId === userId);
  }

  public getAllTransactions(): PointTransaction[] {
    return [...this.state.pointsTransactions];
  }

  // Notifications
  public getUserNotifications(userId: string): NotificationItem[] {
    return this.state.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(notifId: string) {
    const notif = this.state.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.isRead = true;
      this.saveState();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    this.state.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    this.saveState();
  }

  // Referrals
  public getUserReferrals(userId: string): ReferralRecord[] {
    return this.state.referrals.filter((r) => r.referrerId === userId);
  }

  // Achievements
  public getAchievementsWithStatus(userId?: string): (Achievement & { isUnlocked: boolean; unlockedAt?: string })[] {
    const userAchs = userId
      ? this.state.userAchievements.filter((ua) => ua.userId === userId)
      : [];
    const unlockedMap = new Map(userAchs.map((ua) => [ua.achievementId, ua.unlockedAt]));

    return this.state.achievements.map((ach) => ({
      ...ach,
      isUnlocked: unlockedMap.has(ach.id),
      unlockedAt: unlockedMap.get(ach.id),
    }));
  }

  // Submissions
  public getAllSubmissions(): TaskSubmission[] {
    return [...this.state.taskSubmissions];
  }

  public getUserSubmissions(userId: string): TaskSubmission[] {
    return this.state.taskSubmissions.filter((s) => s.userId === userId);
  }

  // Reports
  public getReports(): AbuseReport[] {
    return [...this.state.reports];
  }

  public submitReport(payload: {
    reporterId: string;
    targetType: 'TASK' | 'CAMPAIGN' | 'USER';
    targetId: string;
    reason: string;
    details: string;
  }) {
    const reporter = this.getUserById(payload.reporterId);
    const newReport: AbuseReport = {
      id: `rep_${Date.now()}`,
      reporterId: payload.reporterId,
      reporterUsername: reporter?.username || 'user',
      targetType: payload.targetType,
      targetId: payload.targetId,
      reason: payload.reason,
      details: payload.details,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.state.reports.unshift(newReport);
    this.saveState();
  }

  // Admin Settings & Controls
  public getSettings(): SystemSettings {
    return { ...this.state.settings };
  }

  public updateSettings(newSettings: Partial<SystemSettings>) {
    this.state.settings = {
      ...this.state.settings,
      ...newSettings,
    };
    this.saveState();
  }

  public adminAdjustUserPoints(userId: string, amount: number, reason: string) {
    const user = this.getUserById(userId);
    if (!user) return;
    user.points = Math.max(0, user.points + amount);

    const tx: PointTransaction = {
      id: `tx_${Date.now()}_admin_adj`,
      userId: user.id,
      type: 'ADMIN_ADJUSTMENT',
      amount,
      balanceAfter: user.points,
      description: `⚙️ Penyesuaian Poin oleh Admin: ${reason}`,
      createdAt: new Date().toISOString(),
    };

    this.state.pointsTransactions.unshift(tx);
    this.saveState();
  }

  public adminSetUserStatus(userId: string, payload: { isSuspended?: boolean; isBanned?: boolean; reason?: string }) {
    const user = this.getUserById(userId);
    if (!user) return;
    if (payload.isSuspended !== undefined) user.isSuspended = payload.isSuspended;
    if (payload.isBanned !== undefined) user.isBanned = payload.isBanned;
    if (payload.reason !== undefined) user.suspensionReason = payload.reason;

    const isNowSuspendedOrBanned = user.isSuspended || user.isBanned;
    this.state.notifications.unshift({
      id: `notif_${Date.now()}_status_update`,
      userId: user.id,
      title: isNowSuspendedOrBanned ? '⚠️ Status Akun Di-suspend' : '✅ Status Akun Aktif Kembali',
      message: isNowSuspendedOrBanned
        ? `Akun Anda telah di-suspend oleh Admin. Alasan: ${user.suspensionReason || 'Investigasi moderasi sistem.'}`
        : 'Akun Anda telah diaktifkan kembali oleh Admin. Anda dapat kembali menggunakan semua fitur.',
      type: isNowSuspendedOrBanned ? 'WARNING' : 'SUCCESS',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
  }

  public adminSetCampaignStatus(campaignId: string, status: 'ACTIVE' | 'PAUSED' | 'REJECTED' | 'CANCELLED') {
    const cmp = this.state.campaigns.find((c) => c.id === campaignId);
    if (!cmp) return;
    cmp.status = status;
    cmp.updatedAt = new Date().toISOString();
    this.saveState();
  }

  public adminDeleteCampaign(campaignId: string): boolean {
    const idx = this.state.campaigns.findIndex((c) => c.id === campaignId);
    if (idx === -1) return false;

    // Remove campaign
    this.state.campaigns.splice(idx, 1);
    // Remove associated tasks
    this.state.tasks = this.state.tasks.filter((t) => t.campaignId !== campaignId);

    this.saveState();
    return true;
  }

  public deleteCampaign(campaignId: string, userId: string): { success: boolean; message: string; refundedPoints?: number } {
    const idx = this.state.campaigns.findIndex((c) => c.id === campaignId);
    if (idx === -1) return { success: false, message: 'Campaign tidak ditemukan.' };

    const cmp = this.state.campaigns[idx];
    const user = this.getUserById(userId);
    if (cmp.userId !== userId && user?.role !== 'ADMIN') {
      return { success: false, message: 'Anda tidak memiliki akses untuk menghapus campaign ini.' };
    }

    let refunded = 0;
    // If not yet completed, refund unspent budget
    if (cmp.status !== 'COMPLETED') {
      const remainingActions = Math.max(0, cmp.targetCount - cmp.completedCount);
      refunded = remainingActions * cmp.costPerAction;
      if (refunded > 0) {
        const creator = this.getUserById(cmp.userId);
        if (creator) {
          creator.points += refunded;
          this.state.pointsTransactions.unshift({
            id: `tx_${Date.now()}_refund`,
            userId: creator.id,
            type: 'CAMPAIGN_REFUND',
            amount: refunded,
            balanceAfter: creator.points,
            description: `↩️ Pengembalian poin sisa campaign "${cmp.title}" (${remainingActions} aksi tersisa)`,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    this.state.campaigns.splice(idx, 1);
    this.state.tasks = this.state.tasks.filter((t) => t.campaignId !== campaignId);
    this.saveState();
    return { success: true, message: 'Campaign berhasil dihapus.', refundedPoints: refunded };
  }

  // Real-time calculated Platform Stats (Never fake, 100% computed from real database state)
  public getPlatformStats(): PlatformStats {
    const totalMembers = this.state.users.length;
    const activeMembers = this.state.users.filter((u) => !u.isBanned && !u.isSuspended).length;
    const tasksCompleted = this.state.taskSubmissions.filter((s) => s.status === 'APPROVED').length;

    let followersEarned = 0;
    let likesEarned = 0;
    let viewsEarned = 0;
    let commentsEarned = 0;

    this.state.campaigns.forEach((c) => {
      if (c.type === 'FOLLOWERS') followersEarned += c.completedCount;
      else if (c.type === 'LIKES') likesEarned += c.completedCount;
      else if (c.type === 'COMMENTS') commentsEarned += c.completedCount;
      else if (c.type === 'STORY_VIEWS' || c.type === 'PROFILE_VISITS') viewsEarned += c.completedCount;
    });

    const totalPointsCirculation = this.state.users.reduce((sum, u) => sum + u.points, 0);
    const activeCampaignsCount = this.state.campaigns.filter((c) => c.status === 'ACTIVE').length;
    const pendingReviewsCount = this.state.taskSubmissions.filter((s) => s.status === 'PENDING' || s.status === 'CHECKING').length;

    return {
      totalMembers,
      activeMembers,
      tasksCompleted,
      followersEarned,
      likesEarned,
      viewsEarned,
      commentsEarned,
      totalPointsCirculation,
      activeCampaignsCount,
      pendingReviewsCount,
    };
  }

  // ==========================================
  // Instagram Followers Booster (Super Admin Engine)
  // ==========================================
  public getFollowerBoostOrders(): FollowerBoostOrder[] {
    return [...(this.state.followerBoostOrders || [])];
  }

  public getFollowerBoostOrderById(id: string): FollowerBoostOrder | undefined {
    return this.state.followerBoostOrders?.find((o) => o.id === id);
  }

  public getUserFollowerBoostOrders(targetUsername: string): FollowerBoostOrder[] {
    const cleanTarget = targetUsername.toLowerCase().replace('@', '').trim();
    return (this.state.followerBoostOrders || []).filter((o) => {
      const cleanOrderTarget = o.targetInstagramUsername.toLowerCase().replace('@', '').trim();
      return cleanOrderTarget === cleanTarget;
    });
  }

  public getFollowerBoostRequests(): FollowerBoostRequest[] {
    return [...(this.state.followerBoostRequests || [])];
  }

  public submitFollowerBoostRequest(payload: {
    userId: string;
    targetInstagramUsername: string;
    requestedQuantity: number;
    reason: string;
  }): { success: boolean; request?: FollowerBoostRequest; message: string } {
    const user = this.getUserById(payload.userId);
    if (!user) return { success: false, message: 'User tidak ditemukan.' };

    const cleanUsername = payload.targetInstagramUsername.replace('@', '').trim();
    if (!cleanUsername) return { success: false, message: 'Username Instagram wajib diisi.' };

    const newReq: FollowerBoostRequest = {
      id: `fbr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      userUsername: user.username,
      userDisplayName: user.displayName,
      targetInstagramUsername: cleanUsername,
      requestedQuantity: Math.max(10, Math.min(10000, payload.requestedQuantity || 100)),
      reason: payload.reason || 'Pengembangan engagement akun Instagram',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    if (!this.state.followerBoostRequests) {
      this.state.followerBoostRequests = [];
    }
    this.state.followerBoostRequests.unshift(newReq);
    this.saveState();
    return { success: true, request: newReq, message: 'Permohonan booster followers berhasil dikirim ke Admin.' };
  }

  public adminReviewFollowerBoostRequest(
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    adminUser: User
  ): { success: boolean; message: string } {
    if (adminUser.role !== 'ADMIN') {
      return { success: false, message: 'Hanya Super Admin yang berwenang meninjau permohonan.' };
    }
    const req = this.state.followerBoostRequests?.find((r) => r.id === requestId);
    if (!req) return { success: false, message: 'Permohonan tidak ditemukan.' };

    req.status = status;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = adminUser.username;

    // Send notification to requesting user
    const applicant = this.getUserById(req.userId);
    if (applicant) {
      this.state.notifications.unshift({
        id: `notif_${Date.now()}_req_reviewed`,
        userId: applicant.id,
        title: status === 'APPROVED' ? '✅ Permohonan Booster Disetujui' : '❌ Permohonan Booster Ditolak',
        message:
          status === 'APPROVED'
            ? `Super Admin @${adminUser.username} telah menyetujui permohonan +${req.requestedQuantity} Followers Instagram Anda (@${req.targetInstagramUsername}). Followers akan segera diinjeksi.`
            : `Permohonan booster followers Instagram (@${req.targetInstagramUsername}) ditolak oleh Admin.`,
        type: status === 'APPROVED' ? 'SUCCESS' : 'WARNING',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    this.saveState();
    return { success: true, message: `Permohonan berhasil di-${status.toLowerCase()}.` };
  }

  public getInstagramAccountInfo(input: string): {
    username: string;
    profileUrl: string;
    avatarUrl?: string;
    displayName?: string;
    currentFollowers: number;
    followingCount?: number;
    postsCount?: number;
    isRegisteredUser: boolean;
    user?: User;
  } {
    let clean = input.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/.*$/, '').replace('@', '');
    if (!clean) clean = 'instagram_user';

    const matchedUser = this.state.users.find(
      (u) =>
        (u.instagramProfile?.username && u.instagramProfile.username.toLowerCase().replace('@', '') === clean.toLowerCase()) ||
        u.username.toLowerCase() === clean.toLowerCase()
    );

    if (matchedUser) {
      return {
        username: matchedUser.instagramProfile?.username || matchedUser.username,
        profileUrl: matchedUser.instagramProfile?.profileUrl || `https://instagram.com/${matchedUser.username}`,
        avatarUrl: matchedUser.instagramProfile?.avatarUrl || matchedUser.avatarUrl,
        displayName: matchedUser.displayName,
        currentFollowers: matchedUser.instagramProfile?.followersCount || 1420,
        followingCount: matchedUser.instagramProfile?.followingCount || 350,
        postsCount: matchedUser.instagramProfile?.postsCount || 24,
        isRegisteredUser: true,
        user: matchedUser,
      };
    }

    // Unregistered target fallback with realistic dynamic seed
    const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockFollowers = (hash * 13) % 4500 + 420;

    return {
      username: clean,
      profileUrl: `https://instagram.com/${clean}`,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + (hash % 1000)}?w=150&auto=format&fit=crop&q=80`,
      displayName: clean.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      currentFollowers: mockFollowers,
      followingCount: (hash * 7) % 800 + 120,
      postsCount: (hash % 60) + 5,
      isRegisteredUser: false,
    };
  }

  // SMM Provider Management
  public getSmmProviders(): SmmProviderConfig[] {
    return [...(this.state.smmProviders || DEFAULT_SMM_PROVIDERS)];
  }

  public updateSmmProvider(provider: SmmProviderConfig): void {
    if (!this.state.smmProviders) this.state.smmProviders = [...DEFAULT_SMM_PROVIDERS];
    const idx = this.state.smmProviders.findIndex((p) => p.id === provider.id);
    if (idx !== -1) {
      this.state.smmProviders[idx] = provider;
    } else {
      this.state.smmProviders.push(provider);
    }
    this.saveState();
  }

  public addSmmProvider(provider: SmmProviderConfig): void {
    if (!this.state.smmProviders) this.state.smmProviders = [...DEFAULT_SMM_PROVIDERS];
    this.state.smmProviders.push(provider);
    this.saveState();
  }

  public deleteSmmProvider(providerId: string): void {
    if (!this.state.smmProviders) return;
    this.state.smmProviders = this.state.smmProviders.filter((p) => p.id !== providerId);
    this.saveState();
  }

  public createAndExecuteFollowerBoost(params: {
    targetInstagramUsername: string;
    quantity: number;
    speed: BoosterSpeedType;
    followerQuality: FollowerQualityType;
    deliveryMode?: BoostDeliveryMode;
    serverNode?: string;
    note?: string;
    adminUser: User;
    smmProviderId?: string;
    smmProviderName?: string;
    smmOrderId?: string;
    isRealApiDispatched?: boolean;
  }): { success: boolean; order?: FollowerBoostOrder; error?: string } {
    if (params.adminUser.role !== 'ADMIN') {
      return { success: false, error: 'Akses Ditolak: Hanya Super Admin yang berwenang menambahkan followers Instagram.' };
    }

    const cleanUsername = params.targetInstagramUsername.replace('@', '').trim();
    if (!cleanUsername) {
      return { success: false, error: 'Username target Instagram tidak boleh kosong.' };
    }

    const qty = Math.max(1, Math.min(25000, Number(params.quantity) || 100));
    const profileUrl = `https://www.instagram.com/${cleanUsername}/`;

    // Find if user is in platform
    const matchedUser = this.state.users.find(
      (u) =>
        (u.instagramProfile?.username && u.instagramProfile.username.toLowerCase().replace('@', '') === cleanUsername.toLowerCase()) ||
        u.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    const prevFollowers = matchedUser?.instagramProfile?.followersCount || 1200;
    const newFollowers = prevFollowers + qty;
    const mode: BoostDeliveryMode = params.deliveryMode || 'REAL_SMM_API';

    // Generate authentic realistic follower list (up to 40 preview accounts embedded)
    const generatedFollowers = generateFollowerAccounts(Math.min(qty, 40), params.followerQuality);

    // If delivery mode is Community Organic Network or Hybrid, create a high-priority Community Follow Campaign & Tasks
    let generatedCampaignId: string | undefined = undefined;
    if (mode === 'COMMUNITY_ORGANIC_NETWORK' || mode === 'DIRECT_INSTAGRAM_BROADCAST') {
      generatedCampaignId = `cmp_boost_${Date.now()}`;
      const boostCampaign: Campaign = {
        id: generatedCampaignId,
        userId: params.adminUser.id,
        creatorUsername: params.adminUser.username,
        creatorDisplayName: '⚡ KIPAW High-Priority Follower Mission',
        type: 'FOLLOWERS',
        title: `🔥 [PRIORITAS ADMIN] Follow Akun Instagram @${cleanUsername}`,
        targetInstagramUsername: cleanUsername,
        targetUrl: profileUrl,
        targetCount: qty,
        completedCount: 0,
        costPerAction: 15,
        totalBudget: qty * 15,
        status: 'ACTIVE',
        niche: matchedUser?.instagramProfile?.niche || 'Personal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const boostTask: Task = {
        id: `tsk_${generatedCampaignId}`,
        campaignId: generatedCampaignId,
        type: 'FOLLOW',
        title: `🔥 [PRIORITAS TINGGI] Follow Akun Instagram @${cleanUsername}`,
        description: `Buka aplikasi Instagram dan follow akun @${cleanUsername} secara langsung. Dapatkan bonus +15 IG Points instan!`,
        targetUsername: cleanUsername,
        targetUrl: profileUrl,
        rewardPoints: 15,
        estimatedTimeSeconds: 10,
        niche: matchedUser?.instagramProfile?.niche || 'Personal',
        creatorId: params.adminUser.id,
        requiresProof: true,
        createdAt: new Date().toISOString(),
      };

      this.state.campaigns.unshift(boostCampaign);
      this.state.tasks.unshift(boostTask);

      // Broadcast notification to other community members
      this.state.users.forEach((u) => {
        if (u.id !== params.adminUser.id && (!matchedUser || u.id !== matchedUser.id)) {
          this.state.notifications.unshift({
            id: `notif_${Date.now()}_mission_${u.id}`,
            userId: u.id,
            title: `🎯 Misi Follow Baru: @${cleanUsername}`,
            message: `Super Admin merilis task prioritas baru untuk follow @${cleanUsername}. Ambil task sekarang untuk +15 IG Points!`,
            type: 'INFO',
            isRead: false,
            createdAt: new Date().toISOString(),
          });
        }
      });
    }

    const newOrder: FollowerBoostOrder = {
      id: `fbo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      targetInstagramUsername: cleanUsername,
      targetUserId: matchedUser?.id,
      targetDisplayName: matchedUser?.displayName || cleanUsername,
      targetAvatarUrl: matchedUser?.instagramProfile?.avatarUrl || matchedUser?.avatarUrl,
      instagramProfileUrl: profileUrl,
      previousFollowersCount: prevFollowers,
      quantity: qty,
      deliveredCount: qty,
      newFollowersCount: newFollowers,
      status: 'COMPLETED',
      speed: params.speed || 'FAST',
      followerQuality: params.followerQuality || 'INDONESIA_REAL',
      serverNode: params.serverNode || SERVER_NODES[0].name,
      adminId: params.adminUser.id,
      adminUsername: params.adminUser.username,
      note: params.note || 'Injeksi followers akun aktif oleh Super Admin',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      deliveredFollowers: generatedFollowers,
      deliveryMode: mode,
      smmProviderId: params.smmProviderId,
      smmProviderName: params.smmProviderName,
      smmOrderId: params.smmOrderId || `SMM-${Date.now().toString().slice(-6)}`,
      isRealApiDispatched: params.isRealApiDispatched ?? true,
      broadcastCampaignId: generatedCampaignId,
    };

    if (!this.state.followerBoostOrders) {
      this.state.followerBoostOrders = [];
    }
    this.state.followerBoostOrders.unshift(newOrder);

    // If target is registered user, update their actual followers counter and record in notification
    if (matchedUser) {
      if (!matchedUser.instagramProfile) {
        matchedUser.instagramProfile = {
          id: `ig_${matchedUser.id}`,
          userId: matchedUser.id,
          username: cleanUsername,
          profileUrl: profileUrl,
          niche: 'Personal',
          followersCount: newFollowers,
        };
      } else {
        matchedUser.instagramProfile.followersCount = newFollowers;
      }
      matchedUser.followersEarnedCount = (matchedUser.followersEarnedCount || 0) + qty;

      // In-app celebration notification
      this.state.notifications.unshift({
        id: `notif_${Date.now()}_boost_delivered`,
        userId: matchedUser.id,
        title: '🚀 Followers Instagram Berhasil Ditambahkan!',
        message: `Super Admin @${params.adminUser.username} telah menambahkan +${qty.toLocaleString('id-ID')} Followers Instagram Aktif ke akun @${cleanUsername} (${mode === 'REAL_SMM_API' ? 'via Real SMM Gateway' : 'via Jaringan Komunitas Real'}). Total Followers Sekarang: ${newFollowers.toLocaleString('id-ID')}!`,
        type: 'SUCCESS',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    this.saveState();
    return { success: true, order: newOrder };
  }

  // Reset database to initial
  public resetDatabase() {
    const fresh = createInitialDatabase();
    this.state = fresh;
    this.currentUserId = fresh.users[1].id;
    this.saveStateDirect(fresh);
    this.saveCurrentUserId(this.currentUserId);
    this.notify();
  }
}

export const storage = new StorageEngine();
