import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8'

const GITHUB_TOKEN = Deno.env.get('GITHUB_API_TOKEN')

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener sesiones activas con sus repositorios
    const { data: activeSessions, error: sessionError } = await supabaseClient
      .from('live_sessions')
      .select(`
        id,
        user_id,
        last_commit_at,
        profiles (
          github_username,
          repository_submissions (
            repo_url,
            status
          )
        )
      `)
      .eq('active', true)

    if (sessionError) throw sessionError

    const updates = []

    for (const session of activeSessions) {
      const submissions = session.profiles?.repository_submissions || []
      const latestRepo = submissions[submissions.length - 1]?.repo_url

      if (!latestRepo) continue

      // Extraer owner/repo de: https://github.com/owner/repo
      const match = latestRepo.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) continue

      const [_, owner, repo] = match
      const repoPath = `${owner}/${repo.replace(/\.git$/, '')}`

      try {
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Talento-Tech-Pulse-Agent'
        }
        if (GITHUB_TOKEN) {
          headers['Authorization'] = `token ${GITHUB_TOKEN}`
        }

        const ghResp = await fetch(`https://api.github.com/repos/${repoPath}/commits?per_page=1`, { headers })
        
        if (ghResp.ok) {
          const commits = await ghResp.json()
          if (commits.length > 0) {
            const lastCommitDate = new Date(commits[0].commit.committer.date)
            const currentLastCommit = session.last_commit_at ? new Date(session.last_commit_at) : null

            // Si hay un commit nuevo, actualizamos
            if (!currentLastCommit || lastCommitDate > currentLastCommit) {
              updates.push(
                supabaseClient
                  .from('live_sessions')
                  .update({ 
                    last_commit_at: lastCommitDate.toISOString(),
                    status: 'coding' // Reseteamos el estado si hay actividad
                  })
                  .eq('id', session.id)
              )
            }
          }
        }
      } catch (err) {
        console.error(`Error polling ${repoPath}:`, err)
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: activeSessions.length, 
      updated: updates.length 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
