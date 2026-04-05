'use server'

import { createClient } from '@supabase/supabase-js'

// We use the anon key for now. If RLS blocks, we will adjust or add service role.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getNocTelemetry() {
  // 1. Audit Logs
  const { data: audits } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  // 2. FinOps Metrics
  const { data: finops } = await supabase
    .from('finops_metrics')
    .select('*')
    .order('service_name', { ascending: true })

  // 3. Traffico Activo & Repos Evaluados (We simulate count due to lack of heavy data)
  // Real count of live_sessions
  const { count: activeTraffic } = await supabase
    .from('live_sessions')
    .select('*', { count: 'exact', head: true })
    
  const { count: reposCount } = await supabase
    .from('repository_submissions')
    .select('*', { count: 'exact', head: true })

  return {
    audits: audits || [],
    finops: finops || [],
    activeTraffic: activeTraffic || 0,
    reposCount: reposCount || 0,
  }
}
