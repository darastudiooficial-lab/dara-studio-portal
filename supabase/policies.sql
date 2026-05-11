-- ══ DARA STUDIO: Full Database Schema & RLS Policies ══
-- Instructions: Run this script in the Supabase SQL Editor.
-- This script creates the tables and then applies the security policies.

-- 1. Create PROFILES table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'collaborator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create PROJECTS table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'on_track', 'attention', 'completed')),
  estimate_range TEXT,
  package_type TEXT,
  delivery_speed TEXT DEFAULT 'standard',
  timeline_phase TEXT DEFAULT 'survey' CHECK (timeline_phase IN ('survey', 'floor_plans', 'design_review', 'permit_drawings', 'final_delivery')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create FILES table
CREATE TABLE IF NOT EXISTS files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('Inspiration', 'Video', 'Technical', 'Rush')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create LEADS table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  project_title TEXT,
  estimate_range TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create EMAILS_LOG table
CREATE TABLE IF NOT EXISTS emails_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT,
  recipient TEXT,
  status TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails_log ENABLE ROW LEVEL SECURITY;

-- 7. PROFILES Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Collaborators can view profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'collaborator')
);

-- 8. PROJECTS Policies
CREATE POLICY "Clients can view own projects" ON projects FOR SELECT USING (client_id = auth.uid());
CREATE POLICY "Admins can manage all projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Collaborators can view projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'collaborator')
);

-- 9. FILES Policies
CREATE POLICY "Clients can view own project files" ON files FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = files.project_id AND projects.client_id = auth.uid())
);
CREATE POLICY "Admins and Collaborators can manage files" ON files FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'collaborator'))
);

-- 10. LEADS Policies
CREATE POLICY "Users can view own leads by email" ON leads FOR SELECT USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage all leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 11. EMAILS_LOG Policies
CREATE POLICY "Admins can view email logs" ON emails_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 12. Trigger for profile creation (Optional but recommended)
-- This ensures a profile is created when a user signs up via Supabase Auth
-- Note: server.js already handles this manually, but this is a safety net.
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/
