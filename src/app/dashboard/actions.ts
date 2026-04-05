'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getUserMetrics(userId: string) {
  // 1. My Submissions
  const { data: submissions } = await supabase
    .from('repository_submissions')
    .select('*')
    .eq('student_id', userId)
    .order('created_at', { ascending: false })

  // 2. Active Peers in my Institution
  // First, find user's institution
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('institution_id')
    .eq('user_id', userId)
    .single()

  let activePeers = 0
  if (roleData?.institution_id) {
    const { count } = await supabase
      .from('live_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('institution_id', roleData.institution_id)
      .eq('active', true)
    activePeers = count || 0
  }

  // 3. User Profile Info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  return {
    submissions: submissions || [],
    activePeers,
    profile
  }
}

export async function getTeacherDashboardData(teacherId: string) {
  // 1. Institution
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('institution_id')
    .eq('user_id', teacherId)
    .single()

  if (!roleData?.institution_id) return null

  // 2. Students in Institution
  const { data: students } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `)
    .eq('institution_id', roleData.institution_id)
    .eq('role', 'student')

  // 3. Live Sessions for those students
  const { data: sessions } = await supabase
    .from('live_sessions')
    .select('*')
    .eq('institution_id', roleData.institution_id)
    .eq('active', true)

  return {
    students: students || [],
    sessions: sessions || []
  }
}
