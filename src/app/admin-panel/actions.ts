'use server'

import { createClient } from '@supabase/supabase-js'

// We use the anon key for now. If RLS blocks, we will adjust or add service role.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getNocTelemetry() {
  // 1. Audit Logs (Top 10)
  const { data: audits } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  // 2. FinOps Metrics
  const { data: finops } = await supabase
    .from('finops_metrics')
    .select('*')
    .order('service_name', { ascending: true })

  // 3. Traffic & Repos
  const { count: activeTraffic } = await supabase
    .from('live_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('active', true)
    
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

export async function getB2BData() {
  const { data: institutions, error } = await supabase
    .from('institutions')
    .select(`
      *,
      user_roles:user_roles(count)
    `)
    .order('name', { ascending: true })

  return institutions || []
}

export async function getTeachersData() {
  const { data: teachers, error } = await supabase
    .from('user_roles')
    .select(`
      id,
      role,
      profiles:user_id (
        full_name,
        github_username,
        avatar_url
      ),
      institutions:institution_id (
        name
      )
    `)
    .eq('role', 'teacher')

  return teachers || []
}

export async function logManeuver(message: string, status: 'success' | 'blocked' | 'info' = 'info') {
  await supabase.from('audit_logs').insert({
    actor: 'SUPER_ADMIN_MANUAL',
    action: message,
    classification: 'TACTICAL_MANEUVER',
    status: status
  })
}
