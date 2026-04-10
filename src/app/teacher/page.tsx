'use client'

import { useEffect, useState, useCallback } from 'react'
import { Activity, GitBranch as Github, Zap, ShieldAlert, GitCommit, HeartPulse, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase'

// Tipos base para la UI
type StudentTelemetry = {
  id: string
  name: string
  github_user: string
  role: string // 'school' | 'college' | 'university'
  last_commit_mins_ago: number
  status: 'optimal' | 'warning' | 'critical'
  paired_with?: string // Para el Swarm Matchmaking
}

export default function TeacherPulseDashboard() {
  const supabase = createClient()
  const [telemetry, setTelemetry] = useState<StudentTelemetry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTelemetry = useCallback(async () => {
    const { data, error } = await supabase
      .from('live_sessions')
      .select(`
        id,
        status,
        last_commit_at,
        profiles (
          full_name,
          github_username
        ),
        paired_with:profiles!live_sessions_paired_with_id_fkey (
          full_name
        )
      `)
      .eq('active', true)

    if (!error && data) {
      const now = new Date()
      const mapped: StudentTelemetry[] = data.map((session: any) => {
        const lastCommit = session.last_commit_at ? new Date(session.last_commit_at) : null
        const diffMins = lastCommit ? Math.floor((now.getTime() - lastCommit.getTime()) / 60000) : 999
        
        let status: 'optimal' | 'warning' | 'critical' = 'optimal'
        if (session.status === 'needs_help' || diffMins > 45) status = 'critical'
        else if (diffMins > 20) status = 'warning'

        return {
          id: session.id,
          name: session.profiles?.full_name || 'Estudiante',
          github_user: session.profiles?.github_username || 'unknown',
          role: 'university', // Placeholder hasta unir con instituciones
          last_commit_mins_ago: diffMins,
          status,
          paired_with: session.paired_with?.full_name
        }
      })
      setTelemetry(mapped)
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchTelemetry()
    const interval = setInterval(fetchTelemetry, 5000)
    return () => clearInterval(interval)
  }, [fetchTelemetry])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Activity className="w-12 h-12 text-cyan-400 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 font-sans p-4 sm:p-6 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      
      {/* Top Navigation / Status Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="text-cyan-400 w-8 h-8 relative z-10" />
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-20"></div>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">O.C.T.A.V.O</h1>
          </div>
          <p className="text-sm text-slate-500 mt-2 tracking-wide uppercase font-semibold">
            Orquestación Central de Telemetría y Análisis de Vanguardia Operativa
          </p>
        </div>
        
        <div className="flex gap-4 mt-6 md:mt-0">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 px-6 shadow-inner flex flex-col items-center">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Nivel Red</span>
            <span className="text-cyan-400 font-mono text-xl">Estable</span>
          </div>
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-3 px-6 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-transparent"></div>
            <span className="text-xs text-rose-500/70 font-bold uppercase tracking-widest">Riesgo Deserción</span>
            <span className="text-rose-400 font-mono text-xl animate-pulse">1 Alumno</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: GitHub Pulse Radar */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-slate-400" /> 
              Radar de Frecuencia (GitHub Pulse)
            </h2>
            <span className="text-xs text-slate-500 uppercase flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              <HeartPulse className="w-3 h-3 text-cyan-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          
          <div className="grid gap-4">
            {telemetry.map((student) => (
              <div 
                key={student.id} 
                className={`relative overflow-hidden group bg-[#0A0A0A]/80 border backdrop-blur-sm rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] ${
                  student.status === 'critical' ? 'border-rose-500/50 hover:border-rose-400' :
                  student.status === 'warning' ? 'border-amber-500/50 hover:border-amber-400' :
                  'border-white/5 hover:border-cyan-500/30'
                }`}
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-r ${
                  student.status === 'critical' ? 'from-rose-500 via-transparent to-transparent' : 'from-cyan-500 via-transparent to-transparent'
                }`}></div>

                <div className="flex items-center gap-4 sm:gap-6 relative z-10 w-full">
                  {/* Status Indicator */}
                  <div className="flex flex-col items-center gap-2 w-16">
                    <div className={`w-3 h-3 rounded-full ${
                      student.status === 'critical' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-ping' :
                      student.status === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                      'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    }`}></div>
                  </div>

                  {/* Student Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-200">{student.name}</h3>
                    <p className="text-sm font-mono text-slate-500">@{student.github_user}</p>
                  </div>

                  {/* Telemetry Data (Pulse) */}
                  <div className="flex-1 text-left sm:text-right flex flex-col sm:items-end gap-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <GitCommit className="w-4 h-4" />
                      Último despliegue
                    </div>
                    <div className={`font-mono text-xl font-bold ${
                      student.status === 'critical' ? 'text-rose-400' :
                      student.status === 'warning' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      hace {student.last_commit_mins_ago} m
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full sm:w-48 flex sm:justify-end">
                    {student.status === 'critical' && !student.paired_with && (
                      <button className="bg-rose-500/10 text-rose-400 border border-rose-500/50 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
                        <ShieldAlert className="w-4 h-4" />
                        Intervenir
                      </button>
                    )}
                    {student.paired_with && (
                      <div className="bg-cyan-900/30 border border-cyan-800/50 text-cyan-300 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Swarm: {student.paired_with}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Swarm AI & Genesis Auto-Review */}
        <div className="space-y-8">
          
          {/* Swarm Matchmaking AI Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20"><Zap className="w-24 h-24 text-cyan-500" /></div>
            
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 relative z-10">
              <Zap className="w-5 h-5 text-amber-400" />
              Inteligencia de Enjambre
            </h2>
            
            <div className="space-y-6 relative z-10">
              <p className="text-sm text-slate-400 leading-relaxed">
                El motor bayesiano ha detectado que <strong className="text-rose-400">Carlos Díaz</strong> lleva 55 min bloqueado en el Módulo de Autenticación.
              </p>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wider">Algoritmo de Curación P2P</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400">María Paz R.</span>
                  <span className="text-slate-600">---- {'>'} </span>
                  <span className="text-rose-300">Carlos Díaz</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 border-t border-slate-800 pt-2">
                  María resolvió exactamente el mismo 'Error RLS' hace 12 min. Match sugerido al 98% de efectividad.
                </p>
              </div>

              <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] transition-all flex justify-center items-center gap-2">
                Autorizar Enlace Peer-to-Peer
              </button>
            </div>
          </div>

          {/* AI Code Reviewer Widget */}
          <div className="bg-[#050505] border border-emerald-900/30 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5" />
              Auditoría Cero-Confianza (IA)
            </h2>
            <div className="space-y-4">
              <div className="flex border-l-2 border-emerald-500 pl-4 py-1 flex-col">
                <span className="text-sm font-bold text-slate-200">repo: supabase-backend-04</span>
                <span className="text-xs text-slate-400 mt-1">Escaneo de seguridad Nacional limpio. Políticas RLS estrictas detectadas. Listo para Muro.</span>
              </div>
              <button className="text-xs flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold uppercase tracking-wider transition-colors pt-2 border-t border-white/5 w-full">
                <Trophy className="w-4 h-4" />
                Elevar a Muro Génesis
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
