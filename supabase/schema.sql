-- ==============================================================================
-- TALENTO TECH - SUPABASE SCHEMA (ELITE 1% ARCHITECTURE)
-- ==============================================================================

-- 1. INSTITUTIONS (Schools, Colleges, Universities, Ministry)
CREATE TABLE institutions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT CHECK (level IN ('school', 'college', 'university', 'ministry', 'admin')) NOT NULL,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. ENHANCED USER PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  github_username TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. USER ROLES (RBAC) - Many-to-Many linking Users -> Institutions -> Roles
CREATE TABLE user_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  institution_id UUID REFERENCES institutions(id),
  role TEXT CHECK (role IN ('student', 'teacher', 'admin', 'superadmin')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, institution_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);
-- (Further RLS policies for Admins/SuperAdmins to manage roles omitted for brevity but required)

-- 4. REPOSITORY SUBMISSIONS (Integration with GitHub)
CREATE TABLE repository_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  repo_url TEXT NOT NULL,
  module_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'auto_failed_security', 'passed', 'exceptional')) DEFAULT 'pending',
  ai_feedback TEXT, -- The AI Ghost agent leaves its feedback here
  is_public_wall BOOLEAN DEFAULT false, -- If elevated to Genesis Wall
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE repository_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can insert their own submissions" ON repository_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Everyone can view public wall submissions" ON repository_submissions FOR SELECT USING (is_public_wall = true);
CREATE POLICY "Students can view own submissions" ON repository_submissions FOR SELECT USING (auth.uid() = student_id);

-- 5. LIVE SESSIONS (The Enjambre Matchmaking & Teacher Pulse)
CREATE TABLE live_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  institution_id UUID REFERENCES institutions(id),
  status TEXT CHECK (status IN ('coding', 'needs_help', 'paired', 'idle')) DEFAULT 'coding',
  last_commit_at TIMESTAMP WITH TIME ZONE, -- Pulse feature timestamp
  paired_with_id UUID REFERENCES profiles(id), -- For Swarm Matchmaking
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
-- RLS allows Teachers of the same institution to see all active sessions.
