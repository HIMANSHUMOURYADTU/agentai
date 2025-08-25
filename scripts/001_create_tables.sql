-- Create projects table for tracking different onboarding funnels
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  funnel_steps JSONB NOT NULL, -- Array of step names/descriptions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create funnel_reports table for storing analysis results
CREATE TABLE IF NOT EXISTS public.funnel_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  report_data JSONB NOT NULL, -- Contains conversion rates, drop-off points, etc.
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create ai_insights table for storing AI-generated insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  funnel_report_id UUID REFERENCES public.funnel_reports(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'optimization', 'pattern', 'recommendation'
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects table
CREATE POLICY "Users can view their own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for funnel_reports table
CREATE POLICY "Users can view their own funnel reports" ON public.funnel_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own funnel reports" ON public.funnel_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnel reports" ON public.funnel_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnel reports" ON public.funnel_reports
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ai_insights table
CREATE POLICY "Users can view their own AI insights" ON public.ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI insights" ON public.ai_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI insights" ON public.ai_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI insights" ON public.ai_insights
  FOR DELETE USING (auth.uid() = user_id);
