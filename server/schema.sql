-- 1. PROFILES (Users)
-- Extends Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'admin', 'collaborator')),
    auth_provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS
-- Raw submissions from EstimateWizard (Save for Later)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    raw_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'raw' CHECK (status IN ('raw', 'accepted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS
-- Finalized projects from EstimateWizard
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_collaborator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'on_hold', 'completed', 'canceled')),
    timeline_phase TEXT NOT NULL DEFAULT 'survey' CHECK (timeline_phase IN ('survey', 'floor_plans', 'design_review', 'permit_drawings', 'final_delivery')),
    wizard_data JSONB NOT NULL, -- Stores pkg, delivery, sqft, address, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FILES
-- Metadata for uploaded files linked to projects
CREATE TABLE IF NOT EXISTS public.files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Inspiration', 'Video', 'Technical')),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EMAILS_LOG
-- Audit trail for communications
CREATE TABLE IF NOT EXISTS public.emails_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient TEXT NOT NULL,
    email_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails_log ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads: Only admins can read
CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects: Role-based access
CREATE POLICY "Clients see own projects" ON public.projects FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Collaborators see assigned projects" ON public.projects FOR SELECT USING (
    assigned_collaborator_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Files: Owners, collaborators and admins
CREATE POLICY "Files access policy" ON public.files FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR 
            p.assigned_collaborator_id = auth.uid() OR
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);

-- Emails Log: Read-only for admins
CREATE POLICY "Admins can view email logs" ON public.emails_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_modtime BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- INDEXES for performance
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_files_project ON public.files(project_id);
CREATE INDEX idx_emails_log_recipient ON public.emails_log(recipient);

-- 6. STORAGE BUCKET
-- Run this in Supabase SQL Editor or ensure storage extensions are enabled
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false) ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- 1. Allow authenticated users to upload to their project folder
-- (We use the project_id as the folder name)

-- ==========================================
-- STORAGE SETUP (Supabase Storage)
-- ==========================================

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies

-- Policy: Allow authenticated users to upload files to their own project folders
-- Note: This assumes folder name matches project_id and project_id is linked to user
CREATE POLICY "Users can upload to their project folders"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-files' 
  AND (
    -- Admin check
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    -- Project owner check (path matches project_id)
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id::text = (storage.foldername(name))[1] 
      AND client_id = auth.uid()
    )
  )
);

-- Policy: Allow project owners, collaborators, and admins to read files
CREATE POLICY "Project participants can view files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (
    -- Admin check
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    -- Project owner check
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id::text = (storage.foldername(name))[1] 
      AND client_id = auth.uid()
    )
    OR
    -- Collaborator check
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id::text = (storage.foldername(name))[1] 
      AND assigned_collaborator_id = auth.uid()
    )
  )
);

-- Policy: Allow project owners to delete their own files
CREATE POLICY "Users can delete their project files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-files'
  AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    OR
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE id::text = (storage.foldername(name))[1] 
      AND client_id = auth.uid()
    )
  )
);

-- Enable Realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    sender_role text CHECK (sender_role IN ('client', 'admin', 'collaborator')) NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- INDEXES
CREATE INDEX messages_project_id_idx ON public.messages(project_id);
CREATE INDEX messages_created_at_idx ON public.messages(created_at);

-- RLS FOR MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read project messages"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                p.client_id = auth.uid() OR 
                p.assigned_collaborator_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            )
        )
    );

CREATE POLICY "Users can insert project messages"
    ON public.messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            WHERE p.id = project_id
            AND (
                p.client_id = auth.uid() OR 
                p.assigned_collaborator_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
            )
        )
    );

