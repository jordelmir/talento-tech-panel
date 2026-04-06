import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public API: GET /api/progress/[userId]
// Allows third parties (universities, employers, ministries) to verify student progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  if (!userId) {
    return NextResponse.json(
      { error: 'USER_ID_REQUIRED', message: 'Please provide a valid user ID' },
      { status: 400 }
    )
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'SERVICE_UNAVAILABLE', message: 'Database configuration missing' },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, created_at')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'USER_NOT_FOUND', message: 'No profile found for this user ID' },
        { status: 404 }
      )
    }

    // Fetch submissions (repos)
    const { data: submissions, error: subError } = await supabase
      .from('submissions')
      .select('repository_url, created_at')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })

    // Build response
    const response = {
      meta: {
        api_version: '1.0',
        provider: 'Talento Tech Colombia',
        verified: true,
        timestamp: new Date().toISOString(),
        documentation: 'https://talento-tech.vercel.app/docs',
      },
      student: {
        id: userId,
        name: profile.full_name || 'Anonymous',
        avatar_url: profile.avatar_url || null,
        member_since: profile.created_at,
      },
      progress: {
        total_submissions: submissions?.length || 0,
        repositories: (submissions || []).map((s: any) => ({
          url: s.repository_url,
          submitted_at: s.created_at,
        })),
      },
      verification: {
        status: 'VERIFIED',
        hash: `0x${Buffer.from(userId).toString('hex').substring(0, 16).toUpperCase()}`,
        verify_url: `https://talento-tech.vercel.app/api/progress/${userId}`,
      }
    }

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600',
        'X-Talento-Version': '1.0',
        'Access-Control-Allow-Origin': '*',
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
