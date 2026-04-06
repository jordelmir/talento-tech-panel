'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { GitBranch, ExternalLink, Star, Globe, Award, Calendar, ArrowLeft, Loader2, Code2, Zap, Terminal, Flame, Shield, CheckCircle2 } from 'lucide-react'

// Simulated portfolio data - production would query Supabase by username
const MOCK_PORTFOLIOS: Record<string, {
  name: string; username: string; level: string; avatar: string; bio: string;
  joinDate: string; totalXp: number; streak: number; rank: number;
  projects: { name: string; url: string; tech: string[]; description: string; stars: number; date: string }[];
  certificates: { module: string; date: string; id: string }[];
  skills: { name: string; level: number }[];
}> = {
  'carlos-mendoza': {
    name: 'Carlos Mendoza', username: 'carlos-mendoza', level: 'Colegio',
    avatar: 'CM', bio: 'Estudiante de Talento Tech. Apasionado por React y las APIs.',
    joinDate: '2024-01-15', totalXp: 8450, streak: 12, rank: 3,
    projects: [
      { name: 'todo-app-react', url: 'https://github.com/carlos/todo-app', tech: ['React', 'CSS', 'Supabase'], description: 'App de tareas con autenticación y base de datos real', stars: 5, date: '2024-03-10' },
      { name: 'portfolio-personal', url: 'https://github.com/carlos/portfolio', tech: ['HTML', 'CSS', 'JS'], description: 'Mi portafolio personal con animaciones CSS', stars: 3, date: '2024-02-28' },
      { name: 'weather-api', url: 'https://github.com/carlos/weather', tech: ['JavaScript', 'API REST'], description: 'Consulta del clima usando fetch y APIs externas', stars: 4, date: '2024-02-15' },
      { name: 'chat-realtime', url: 'https://github.com/carlos/chat', tech: ['React', 'Supabase', 'Realtime'], description: 'Chat en tiempo real con Supabase Realtime', stars: 8, date: '2024-03-20' },
    ],
    certificates: [
      { module: 'Frontend Fundamentals', date: '2024-02-01', id: 'CERT-2024-001' },
      { module: 'JavaScript Avanzado', date: '2024-03-01', id: 'CERT-2024-004' },
    ],
    skills: [
      { name: 'HTML/CSS', level: 90 },
      { name: 'JavaScript', level: 75 },
      { name: 'React', level: 60 },
      { name: 'Git', level: 80 },
      { name: 'Supabase', level: 55 },
      { name: 'APIs', level: 70 },
    ]
  },
  'sofia-torres': {
    name: 'Sofia Torres', username: 'sofia-torres', level: 'Universidad',
    avatar: 'ST', bio: 'Full-stack developer en formación. Next.js + Supabase + OCI.',
    joinDate: '2024-01-10', totalXp: 15200, streak: 28, rank: 1,
    projects: [
      { name: 'ecommerce-next', url: 'https://github.com/sofia/ecommerce', tech: ['Next.js', 'Stripe', 'Supabase'], description: 'E-commerce completo con pagos y dashboard admin', stars: 14, date: '2024-03-18' },
      { name: 'ai-chatbot', url: 'https://github.com/sofia/chatbot', tech: ['Next.js', 'Gemini API', 'Vercel'], description: 'Chatbot inteligente con Gemini AI', stars: 22, date: '2024-03-22' },
    ],
    certificates: [
      { module: 'Full-Stack Architecture', date: '2024-03-10', id: 'CERT-2024-002' },
      { module: 'React & State Management', date: '2024-02-20', id: 'CERT-2024-005' },
      { module: 'Cloud Infrastructure (OCI)', date: '2024-03-15', id: 'CERT-2024-006' },
    ],
    skills: [
      { name: 'React/Next.js', level: 92 },
      { name: 'TypeScript', level: 85 },
      { name: 'Node.js', level: 78 },
      { name: 'Supabase', level: 90 },
      { name: 'DevOps', level: 65 },
      { name: 'AI/ML APIs', level: 70 },
    ]
  },
}

export default function PortfolioPage() {
  const params = useParams()
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<typeof MOCK_PORTFOLIOS[string] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = params.username as string
    setTimeout(() => {
      setPortfolio(MOCK_PORTFOLIOS[username] || null)
      setLoading(false)
    }, 1000)
  }, [params.username])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] font-mono">LOADING_PORTFOLIO...</p>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono">
        <div className="text-center">
          <Terminal className="w-16 h-16 text-slate-800 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">USER_NOT_FOUND_</h2>
          <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em]">El portafolio solicitado no existe</p>
          <button onClick={() => router.push('/')} className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            Volver_al_Inicio
          </button>
        </div>
      </div>
    )
  }

  const p = portfolio
  const levelColors: Record<string, string> = {
    Universidad: 'from-purple-500 to-blue-500',
    Colegio: 'from-indigo-500 to-purple-500',
    Escuela: 'from-orange-500 to-pink-500',
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
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> INICIO
        </button>

        {/* Profile Header */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-8">
          <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${levelColors[p.level] || levelColors.Colegio}`} />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${levelColors[p.level] || levelColors.Colegio} flex items-center justify-center text-3xl font-black text-white shadow-2xl border border-white/20`}>
              {p.avatar}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-3">{p.name}</h1>
              <p className="text-slate-400 text-sm mb-4 font-sans">{p.bio}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400 uppercase tracking-widest`}>
                  <Shield className="w-3 h-3 inline mr-1.5" />{p.level}
                </span>
                <span className="text-[9px] font-black px-4 py-1.5 rounded-full border bg-amber-500/10 border-amber-500/20 text-amber-400 uppercase tracking-widest">
                  <Zap className="w-3 h-3 inline mr-1.5" />{p.totalXp.toLocaleString()} XP
                </span>
                <span className="text-[9px] font-black px-4 py-1.5 rounded-full border bg-orange-500/10 border-orange-500/20 text-orange-400 uppercase tracking-widest">
                  <Flame className="w-3 h-3 inline mr-1.5" />{p.streak}d Racha
                </span>
                <span className="text-[9px] font-black px-4 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                  <Star className="w-3 h-3 inline mr-1.5" />Rank #{p.rank}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl mb-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">SKILLS_MATRIX_</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {p.skills.map((skill, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-black mb-2">
                  <span className="text-white uppercase tracking-widest">{skill.name}</span>
                  <span className="text-purple-400 font-mono">{skill.level}%</span>
                </div>
                <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <div className="bg-gradient-to-r from-purple-600 to-cyan-500 h-full rounded-full shadow-[0_0_10px_rgba(168,85,247,0.3)] transition-all duration-1000" style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">PROYECTOS_ ({p.projects.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {p.projects.map((proj, i) => (
              <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl hover:border-purple-500/30 transition-all group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full" />
                
                <div className="relative z-10">
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
                    {proj.tech.map((t, j) => (
                      <span key={j} className="text-[8px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-slate-600 font-mono">{new Date(proj.date).toLocaleDateString('es-CO')}</span>
                    <a href={proj.url} target="_blank" rel="noopener" className="flex items-center gap-1.5 text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest">
                      <ExternalLink className="w-3 h-3" /> Ver_Repo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">CERTIFICACIONES_ ({p.certificates.length})</h3>
          <div className="space-y-4">
            {p.certificates.map((cert, i) => (
              <div key={i} onClick={() => router.push(`/certificados/${cert.id}`)} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-6 flex items-center justify-between backdrop-blur-xl shadow-2xl hover:border-emerald-500/30 transition-all group cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter">{cert.module}</p>
                    <p className="text-[9px] text-slate-600 font-mono mt-1">{cert.id} • {new Date(cert.date).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest hidden md:inline">VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 opacity-30">
          <p className="text-[8px] font-mono tracking-[0.6em] uppercase">Powered by Talento Tech Colombia • {new Date().getFullYear()}</p>
        </div>
      </main>
    </div>
  )
}
