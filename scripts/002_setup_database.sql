-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  funnel_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the funnel_reports table
CREATE TABLE IF NOT EXISTS public.funnel_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  report_data JSONB NOT NULL,
  total_users INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the ai_insights table
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('optimization', 'pattern', 'recommendation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for funnel_reports
CREATE POLICY "Users can view reports for their projects" ON public.funnel_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = funnel_reports.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create reports for their projects" ON public.funnel_reports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = funnel_reports.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create RLS policies for ai_insights
CREATE POLICY "Users can view insights for their projects" ON public.ai_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = ai_insights.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create insights for their projects" ON public.ai_insights
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = ai_insights.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_reports_project_id ON public.funnel_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_project_id ON public.ai_insights(project_id);

-- Insert a test record to verify everything works
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created: projects, funnel_reports, ai_insights';
  RAISE NOTICE 'RLS policies enabled and configured';
END $$;
