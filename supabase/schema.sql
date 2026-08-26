-- =========================================================================
-- KIPAW IG BOOSTER - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- REAL USER ENGAGEMENT PLATFORM (NO BOTS, NO PASSWORDS, REAL ACTIONS)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'MODERATOR')),
  points INTEGER NOT NULL DEFAULT 50 CHECK (points >= 0),
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  daily_streak INTEGER NOT NULL DEFAULT 1,
  last_daily_claim TIMESTAMP WITH TIME ZONE,
  tasks_completed_count INTEGER NOT NULL DEFAULT 0,
  followers_earned_count INTEGER NOT NULL DEFAULT 0,
  likes_earned_count INTEGER NOT NULL DEFAULT 0,
  views_earned_count INTEGER NOT NULL DEFAULT 0,
  comments_earned_count INTEGER NOT NULL DEFAULT 0,
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  suspension_reason TEXT,
  device_fingerprint TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INSTAGRAM PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.instagram_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  niche TEXT NOT NULL DEFAULT 'Personal',
  avatar_url TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('FOLLOWERS', 'LIKES', 'COMMENTS', 'STORY_VIEWS', 'PROFILE_VISITS')),
  title TEXT NOT NULL,
  target_instagram_username TEXT NOT NULL,
  target_url TEXT NOT NULL,
  comment_guide TEXT,
  target_count INTEGER NOT NULL CHECK (target_count > 0),
  completed_count INTEGER NOT NULL DEFAULT 0 CHECK (completed_count <= target_count),
  cost_per_action INTEGER NOT NULL CHECK (cost_per_action > 0),
  total_budget INTEGER NOT NULL CHECK (total_budget > 0),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'REJECTED', 'CANCELLED')),
  niche TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TASKS TABLE (Individual marketplace tasks generated from campaigns)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('FOLLOW', 'LIKE', 'COMMENT', 'STORY_VIEW', 'PROFILE_VISIT')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_username TEXT NOT NULL,
  target_url TEXT NOT NULL,
  reward_points INTEGER NOT NULL CHECK (reward_points > 0),
  estimated_time_seconds INTEGER NOT NULL DEFAULT 15,
  niche TEXT NOT NULL DEFAULT 'Other',
  creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  requires_proof BOOLEAN NOT NULL DEFAULT TRUE,
  comment_guide TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TASK SUBMISSIONS TABLE (Proof uploaded by users)
CREATE TABLE IF NOT EXISTS public.task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_instagram_username TEXT NOT NULL,
  proof_image_url TEXT,
  proof_text TEXT,
  reward_points INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CHECKING', 'APPROVED', 'REJECTED')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  CONSTRAINT unique_user_task_submission UNIQUE (task_id, user_id)
);

-- 6. CAMPAIGN PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.campaign_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_campaign_participant UNIQUE (campaign_id, user_id)
);

-- 7. POINTS TRANSACTIONS TABLE (Immutable Point Ledger)
CREATE TABLE IF NOT EXISTS public.points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('EARN', 'SPEND', 'BONUS', 'REFERRAL', 'ADMIN_ADJUSTMENT')),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. REFERRALS TABLE
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  reward_points INTEGER NOT NULL DEFAULT 100,
  status TEXT NOT NULL DEFAULT 'QUALIFIED' CHECK (status IN ('QUALIFIED', 'PENDING', 'REJECTED')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_tasks INTEGER,
  required_points INTEGER,
  required_streak INTEGER,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('BRONZE', 'SILVER', 'GOLD', 'SPECIAL'))
);

-- 10. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- 11. REPORTS TABLE (Abuse & Spam prevention)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('TASK', 'CAMPAIGN', 'USER')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'SUPER_ADMIN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'INFO' CHECK (type IN ('SUCCESS', 'INFO', 'WARNING', 'ALERT')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. DAILY REWARDS CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.daily_rewards (
  day INTEGER PRIMARY KEY CHECK (day BETWEEN 1 AND 7),
  points INTEGER NOT NULL CHECK (points > 0)
);

-- Insert Default Daily Rewards
INSERT INTO public.daily_rewards (day, points) VALUES
(1, 10),
(2, 15),
(3, 20),
(4, 30),
(5, 40),
(6, 60),
(7, 100)
ON CONFLICT (day) DO UPDATE SET points = EXCLUDED.points;

-- Insert Default Achievements
INSERT INTO public.achievements (id, icon, title, description, required_tasks, required_points, required_streak, badge_type) VALUES
('beginner', '🥉', 'Beginner', 'Selesaikan task pertamamu di KIPAW IG BOOSTER', 1, NULL, NULL, 'BRONZE'),
('active_user', '🥈', 'Active User', 'Selesaikan 20 tasks komunitas nyata', 20, NULL, NULL, 'SILVER'),
('growth_member', '🥇', 'Growth Member', 'Raih akumulasi 500 IG Points', NULL, 500, NULL, 'GOLD'),
('7_day_streak', '🔥', '7 Day Streak', 'Login dan klaim reward berturut-turut selama 7 hari', NULL, NULL, 7, 'SPECIAL'),
('100_tasks', '🚀', '100 Tasks', 'Selesaikan 100 tasks Instagram nyata', 100, NULL, NULL, 'GOLD'),
('1000_tasks', '🏆', '1,000 Tasks', 'Legenda komunitas: 1,000 tasks terselesaikan', 1000, NULL, NULL, 'SPECIAL'),
('top_contributor', '⭐', 'Top Contributor', 'Masuk ke dalam jajaran top rank mingguan', 50, 1000, NULL, 'SPECIAL')
ON CONFLICT (id) DO NOTHING;

-- Insert Default Global Settings
INSERT INTO public.settings (key, value) VALUES
('system_config', '{
  "followReward": 10,
  "likeReward": 5,
  "commentReward": 15,
  "storyViewReward": 3,
  "profileVisitReward": 2,
  "referralRewardReferrer": 100,
  "referralRewardNewUser": 50,
  "dailyTaskLimit": 50,
  "taskCooldownSeconds": 30,
  "minCampaignBudget": 50,
  "maxCampaignBudget": 10000,
  "minAccountAgeDays": 0,
  "requireAdminApproval": false,
  "announcementText": "Selamat datang di KIPAW IG BOOSTER! Dapatkan exposure nyata tanpa bot dan tanpa password.",
  "announcementActive": true
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all public user profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update only their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Instagram Profiles policies
CREATE POLICY "Anyone can view instagram profiles" ON public.instagram_profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage their own IG profile" ON public.instagram_profiles FOR ALL USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Anyone can view active campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Users can create their own campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own campaigns" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Anyone can view available tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Creators can manage tasks" ON public.tasks FOR ALL USING (auth.uid() = creator_id);

-- Task Submissions policies
CREATE POLICY "Users can view their own submissions" ON public.task_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON public.task_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Campaign owners can view submissions for their campaigns" ON public.task_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = task_submissions.campaign_id AND user_id = auth.uid())
);

-- Points Transactions policies
CREATE POLICY "Users can view their own ledger" ON public.points_transactions FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view and update their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
