'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Code2, GitMerge, GitPullRequest, 
  TerminalSquare, BookMarked, Medal, ArrowRight 
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

const mockCommits = [
  { day: 'Lun', commits: 5 },
  { day: 'Mar', commits: 12 },
  { day: 'Mie', commits: 8 },
  { day: 'Jue', commits: 25 },
  { day: 'Vie', commits: 18 },
  { day: 'Sab', commits: 40 },
  { day: 'Dom', commits: 10 },
]

export default function ColegioDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-300">
      
      {/* Navbar Colegio */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg">
            <TerminalSquare className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">
            Talento<span className="text-blue-600">Tech</span> <span className="text-sm border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full ml-1 font-mono">HIGH_SCHOOL</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-slate-600">
            <GitMerge className="w-4 h-4 text-purple-500" />
            <span>BRANCH: MAIN</span>
          </div>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Desconectar Sesión</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        
        {/* Hero Section Technical */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />
          
          <div className="relative z-10 w-full md:w-auto">
            <p className="text-blue-400 font-mono text-sm mb-3">~/estudiantes/perfil/carrera-tecnica</p>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Especialidad: Full-Stack Dev</h1>
            <p className="text-slate-400 text-lg max-w-xl">Prepárate para la industria. Tus contribuciones a repositorios abiertos son monitoreadas para estructurar tu CV tecnológico.</p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center">
              <span className="text-3xl font-black mb-1">14</span>
              <span className="text-slate-400 text-xs font-mono uppercase">Repos Creados</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center border-b-4 border-b-emerald-500">
              <span className="text-3xl font-black mb-1 text-emerald-400">82%</span>
              <span className="text-slate-400 text-xs font-mono uppercase">Avg. Code Health</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Column */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <GitPullRequest className="w-5 h-5 text-blue-500" /> Frecuencia de Commits GItHub
                </h2>
                <span className="text-xs font-mono bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200">Últimos 7 días</span>
              </div>
              
              <div className="h-[300px] w-full flex items-center justify-center">
                {!isMounted ? (
                  <div className="text-slate-300 font-mono text-xs animate-pulse tracking-widest uppercase italic">Initializing_Edge_Nodes...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockCommits} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="commits" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCommits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Materias Activas */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><BookMarked className="w-5 h-5 text-purple-500" />Ruta de Certificación</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Estructuras de Datos con Python', progress: 80, active: true },
                  { name: 'Desarrollo Web Frontend (React)', progress: 45, active: true },
                  { name: 'Bases de Datos & SQL', progress: 0, active: false },
                  { name: 'Arquitecturas Cloud', progress: 0, active: false }
                ].map((course, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${course.active ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                    <h3 className="font-bold text-slate-800 mb-3">{course.name}</h3>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${course.active ? 'bg-blue-500' : 'bg-slate-300'}`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="mt-2 text-right text-xs font-mono font-bold text-slate-500">{course.progress}% COMPLETADO</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column: Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Medal className="w-5 h-5 text-amber-500" /> Leaderboard Técnica
            </h2>
            
            <div className="space-y-4 flex-1">
              {[
                { name: 'Camila Rodriguez', pts: '12,500', me: false },
                { name: 'Andres Felipe (Tú)', pts: '11,200', me: true },
                { name: 'Sebastian Vargas', pts: '9,850', me: false },
                { name: 'Laura Gomez', pts: '9,100', me: false },
                { name: 'Diego Torres', pts: '8,400', me: false },
              ].map((student, i) => (
                <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border ${student.me ? 'bg-blue-50 border-blue-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                    ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-slate-200 text-slate-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}
                  `}>
                    #{i+1}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`font-bold truncate ${student.me ? 'text-blue-700' : 'text-slate-700'}`}>{student.name}</p>
                    <p className="text-xs font-mono text-slate-500">{student.pts} EXP</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-slate-900 text-white rounded-xl py-3 font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              Ver Ránking Completo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
