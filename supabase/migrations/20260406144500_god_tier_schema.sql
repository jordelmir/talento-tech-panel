-- 6. PORTFOLIO & VERIFICATION (God-Tier Public Profiles)

CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  module TEXT NOT NULL,
  issued_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  custom_id TEXT UNIQUE NOT NULL
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public certificates are viewable by everyone" ON certificates FOR SELECT USING (true);
CREATE POLICY "Admins can insert certificates" ON certificates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'superadmin'))
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  stars INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public projects are viewable by everyone" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Students can manage their own projects" ON portfolio_projects FOR ALL USING (auth.uid() = student_id);

CREATE TABLE IF NOT EXISTS user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  UNIQUE(user_id, name)
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public skills are viewable by everyone" ON user_skills FOR SELECT USING (true);
CREATE POLICY "Users can manage their own skills" ON user_skills FOR ALL USING (auth.uid() = user_id);

-- 7. FAMILY OBSERVER LAYER (Guardians)
CREATE TABLE IF NOT EXISTS family_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES profiles(id) NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT CHECK (status IN ('active', 'pending')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(parent_id, student_id)
);

ALTER TABLE family_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view their links" ON family_links FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Students can view their links" ON family_links FOR SELECT USING (auth.uid() = student_id);
-- A student's profile, submissions, and skills become readable to their linked parent.
-- This requires robust logic in edge queries. No explicit cross-table RLS to keep performance high; backend Edge routes will explicitly check family_links.
