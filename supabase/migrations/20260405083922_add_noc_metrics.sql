-- ==============================================================================
-- TALENTO TECH - NOC TIER-1 INFRASTRUCTURE METRICS (AUDIT & FINOPS)
-- ==============================================================================

-- 1. AUDIT LOGS (Security and Telemetry Trackings)
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    classification TEXT NOT NULL,
    status TEXT CHECK (status IN ('success', 'blocked', 'warning', 'info')) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NOC Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'superadmin'))
);
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true); -- Relaxed for system edge functions, in production should be service_role only.

-- Insert initial genesis audit logs to keep "real 0s" flowing
INSERT INTO public.audit_logs (actor, action, classification, status) VALUES
('system_initializer', 'NOC V2 Telemetry Engine Started', 'System', 'success');

-- 2. FINOPS METRICS (AI & Cloud Quota Trackings)
CREATE TABLE public.finops_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL UNIQUE,
    current_usage NUMERIC DEFAULT 0,
    limit_quota NUMERIC NOT NULL,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.finops_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "NOC Admins can view finops metrics" ON public.finops_metrics FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'superadmin'))
);

-- Insert baseline real records (Starting at 0 usage, but defining known limits)
INSERT INTO public.finops_metrics (service_name, current_usage, limit_quota) VALUES
('Gemini 1.5 Pro', 0, 100),
('Claude 3 Opus', 0, 100),
('Supabase DB', 0, 100),
('Vercel Edge', 0, 100);

-- Function to increment active sessions if we wanted a trigger, but we'll read `live_sessions` via count.
