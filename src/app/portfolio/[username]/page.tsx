import React from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { GitBranch, ExternalLink, Star, Globe, Award, Calendar, ArrowLeft, Loader2, Code2, Zap, Terminal, Flame, Shield, CheckCircle2 } from 'lucide-react'

// ISR setup for Next.js Caching: 1 hour (3600 seconds)
export const revalidate = 3600

export default async function PortfolioPage({ params }: { params: { username: string } }) {
  // Initialize server-side Supabase client for public fetching
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Fetch Profile and Institution Level
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      github_username,
      avatar_url,
      created_at,
      user_roles!inner(
        role,
        institutions(name, level)
      )
    `)
    .eq('github_username', params.username)
    .single()

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono">
        <div className="text-center">
          <Terminal className="w-16 h-16 text-slate-800 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">USER_NOT_FOUND_</h2>
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em]">El portafolio solicitado no existe</p>
          <Link href="/" className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all inline-block">
            Volver_al_Inicio
          </Link>
        </div>
      </div>
    )
  }

  // 2. Parallel Fetch for Projects, Certificates, Skills
  const [projectsRes, certsRes, skillsRes] = await Promise.all([
    supabase.from('portfolio_projects').select('*').eq('student_id', profile.id),
    supabase.from('certificates').select('*').eq('student_id', profile.id),
    supabase.from('user_skills').select('*').eq('user_id', profile.id)
  ])

  const projects = projectsRes.data || []
  const certificates = certsRes.data || []
  const skills = skillsRes.data || []

  const institutionLevel = Array.isArray(profile.user_roles) && profile.user_roles[0]?.institutions
    ? (profile.user_roles[0].institutions as any).level
    : 'Colegio'
    
  // Map internal schema levels to capitalize string outputs
  const levelDisplay = institutionLevel.charAt(0).toUpperCase() + institutionLevel.slice(1)

  const levelColors: Record<string, string> = {
    Universidad: 'from-purple-500 to-blue-500',
    Colegio: 'from-indigo-500 to-purple-500',
    Escuela: 'from-orange-500 to-pink-500',
    Ministry: 'from-yellow-500 to-emerald-500'
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono selection:bg-purple-500/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[35%] h-[35%] bg-blue-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 relative z-10">
        {/* Back */}
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-12 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> INICIO
        </Link>

        {/* Profile Header */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-8">
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${levelColors[levelDisplay] || levelColors.Colegio}`} />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${levelColors[levelDisplay] || levelColors.Colegio} flex items-center justify-center text-3xl font-black text-white shadow-2xl border border-white/20 overflow-hidden`}>
               {profile.avatar_url ? (
                 <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
               ) : (
                 profile.full_name?.substring(0, 2).toUpperCase() || 'TT'
               )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-3">{profile.full_name}</h1>
              <p className="text-slate-400 text-sm mb-4 font-sans">@{profile.github_username}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="text-[9px] font-black px-4 py-1.5 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400 uppercase tracking-widest">
                  <Shield className="w-3 h-3 inline mr-1.5" />{levelDisplay}
                </span>
                <span className="text-[9px] font-black px-4 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                  <Calendar className="w-3 h-3 inline mr-1.5" />Miembro desde {new Date(profile.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl mb-8">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">SKILLS_MATRIX_</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black mb-2">
                    <span className="text-white uppercase tracking-widest">{skill.name}</span>
                    <span className="text-purple-400 font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 p-[1px]">
                    <div className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)]" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">PROYECTOS_ ({projects.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl hover:border-purple-500/30 transition-all group relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full" />
                  
                  <div className="relative z-10 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Code2 className="w-5 h-5 text-purple-400" />
                        <h4 className="font-black text-lg text-white uppercase tracking-tighter group-hover:text-purple-400 transition-colors">{proj.name}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-xs font-black">{proj.stars}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-4 font-sans leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.tech_stack?.map((t: string, j: number) => (
                        <span key={j} className="text-[8px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 uppercase tracking-widest">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-4">
                    <span className="text-[8px] text-slate-600 font-mono">{new Date(proj.created_at).toLocaleDateString()}</span>
                    <a href={proj.url} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest">
                      <ExternalLink className="w-3 h-3" /> Ver_Repo
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">CERTIFICACIONES_ ({certificates.length})</h3>
            <div className="space-y-4">
              {certificates.map((cert, i) => (
                <Link key={i} href={`/certificados/${cert.custom_id}`} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between backdrop-blur-xl shadow-2xl hover:border-emerald-500/30 transition-all group block">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">{cert.module}</p>
                      <p className="text-[9px] text-slate-600 font-mono mt-1">{cert.custom_id} • {new Date(cert.issued_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest hidden md:inline">VERIFIED</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {skills.length === 0 && projects.length === 0 && certificates.length === 0 && (
           <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 mt-8">
             <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
             <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">ESTE PORTAFOLIO AÚN ESTÁ EN CONSTRUCCIÓN</p>
           </div>
        )}

        {/* Footer */}
        <div className="text-center py-12 opacity-30">
          <p className="text-[8px] font-mono tracking-[0.6em] uppercase">Powered by Talento Tech Colombia • {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  )
}
