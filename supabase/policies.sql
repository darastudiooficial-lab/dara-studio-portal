-- ══ DARA STUDIO: Row Level Security (RLS) Policies ══
-- Instructions: Run this script in the Supabase SQL Editor.

-- 1. Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES Policies
-- Clients/Users see their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admins have full control
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Collaborators can view profile names to identify clients
CREATE POLICY "Collaborators can view profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'collaborator')
);

-- 3. PROJECTS Policies
-- Clients see only their projects
CREATE POLICY "Clients can view own projects" ON projects FOR SELECT USING (
  client_id = auth.uid()
);

-- Admins see all
CREATE POLICY "Admins can manage all projects" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Collaborators see all projects (or assigned projects)
CREATE POLICY "Collaborators can view projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'collaborator')
);

-- 4. FILES Policies
-- Clients see files belonging to their projects
CREATE POLICY "Clients can view own project files" ON files FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = files.project_id 
    AND projects.client_id = auth.uid()
  )
);

-- Admins/Collaborators can manage files
CREATE POLICY "Admins and Collaborators can manage files" ON files FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'collaborator'))
);

-- 5. LEADS Policies
-- Users can view leads matching their email (to resume sessions)
CREATE POLICY "Users can view own leads by email" ON leads FOR SELECT USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Admins manage all leads
CREATE POLICY "Admins can manage all leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. EMAILS_LOG Policies (Internal Only)
ALTER TABLE emails_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view email logs" ON emails_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
