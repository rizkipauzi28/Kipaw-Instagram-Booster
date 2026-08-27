export type NicheType =
  | 'Fashion'
  | 'Gaming'
  | 'Kuliner'
  | 'Beauty'
  | 'Education'
  | 'Business'
  | 'Technology'
  | 'Travel'
  | 'Personal'
  | 'Other';

export type TaskType =
  | 'FOLLOW'
  | 'LIKE'
  | 'COMMENT'
  | 'STORY_VIEW'
  | 'PROFILE_VISIT';

export type TaskStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export type SubmissionStatus = 'PENDING' | 'CHECKING' | 'APPROVED' | 'REJECTED';

export type CampaignType =
  | 'FOLLOWERS'
  | 'LIKES'
  | 'COMMENTS'
  | 'STORY_VIEWS'
  | 'PROFILE_VISITS';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';

export type TransactionType =
  | 'EARN'
  | 'SPEND'
  | 'BONUS'
  | 'REFERRAL'
  | 'ADMIN_ADJUSTMENT'
  | 'CAMPAIGN_REFUND';

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export interface InstagramProfile {
  id: string;
  userId: string;
  username: string; // e.g. "tokosaya" or "@tokosaya"
  profileUrl: string;
  niche: NicheType;
  verifiedAt?: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  password?: string;
  role: UserRole;
  points: number;
  referralCode: string;
  referredBy?: string;
  dailyStreak: number;
  lastDailyClaim?: string; // ISO date
  tasksCompletedCount: number;
  followersEarnedCount: number;
  likesEarnedCount: number;
  viewsEarnedCount: number;
  commentsEarnedCount: number;
  isSuspended: boolean;
  isBanned: boolean;
  suspensionReason?: string;
  createdAt: string;
  instagramProfile?: InstagramProfile;
  deviceFingerprint?: string;
  ipAddress?: string;
}

export interface Campaign {
  id: string;
  userId: string;
  creatorUsername: string;
  creatorDisplayName: string;
  creatorAvatarUrl?: string;
  type: CampaignType;
  title: string;
  targetInstagramUsername: string;
  targetUrl: string; // post URL or profile URL or reel URL
  commentGuide?: string; // e.g. "Keren banget produknya!", "Info order dong"
  targetCount: number;
  completedCount: number;
  costPerAction: number;
  totalBudget: number;
  status: CampaignStatus;
  niche?: NicheType;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  campaignId: string;
  type: TaskType;
  title: string;
  description: string;
  targetUsername: string;
  targetUrl: string;
  rewardPoints: number;
  estimatedTimeSeconds: number;
  niche: NicheType;
  creatorId: string;
  creatorAvatarUrl?: string;
  requiresProof: boolean;
  commentGuide?: string;
  createdAt: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  campaignId: string;
  userId: string;
  userUsername: string;
  userDisplayName: string;
  userInstagramUsername: string;
  userAvatarUrl?: string;
  taskType: TaskType;
  targetUsername: string;
  targetUrl: string;
  rewardPoints: number;
  proofImageUrl?: string;
  proofText?: string;
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // positive or negative
  balanceAfter: number;
  description: string;
  referenceId?: string; // taskId, campaignId, referralId
  createdAt: string;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referredUserId: string;
  referredUsername: string;
  rewardPoints: number;
  status: 'QUALIFIED' | 'PENDING' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
}

export interface DailyRewardConfig {
  day: number;
  points: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  requiredTasks?: number;
  requiredPoints?: number;
  requiredStreak?: number;
  badgeType: 'BRONZE' | 'SILVER' | 'GOLD' | 'SPECIAL';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AbuseReport {
  id: string;
  reporterId: string;
  reporterUsername: string;
  targetType: 'TASK' | 'CAMPAIGN' | 'USER';
  targetId: string;
  reason: string;
  details: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface SystemSettings {
  followReward: number;
  likeReward: number;
  commentReward: number;
  storyViewReward: number;
  profileVisitReward: number;
  referralRewardReferrer: number;
  referralRewardNewUser: number;
  dailyTaskLimit: number;
  taskCooldownSeconds: number;
  minCampaignBudget: number;
  maxCampaignBudget: number;
  minAccountAgeDays: number;
  requireAdminApproval: boolean;
  announcementText: string;
  announcementActive: boolean;
}

export interface PlatformStats {
  totalMembers: number;
  activeMembers: number;
  tasksCompleted: number;
  followersEarned: number;
  likesEarned: number;
  viewsEarned: number;
  commentsEarned: number;
  totalPointsCirculation: number;
  activeCampaignsCount: number;
  pendingReviewsCount: number;
}
