'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Terminal, GitBranch, Cpu, Database, CloudRain,
  Activity, Zap, ShieldAlert, GitCommit, CheckCircle2, ChevronRight 
} from 'lucide-react'
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts'

const radarData = [
  { subject: 'Algoritmia', A: 120, fullMark: 150 },
  { subject: 'Cloud Native', A: 98, fullMark: 150 },
  { subject: 'Arquitectura', A: 86, fullMark: 150 },
  { subject: 'DevOps/CI', A: 99, fullMark: 150 },
  { subject: 'Seguridad', A: 85, fullMark: 150 },
  { subject: 'Bases de Datos', A: 110, fullMark: 150 },
]

const healthData = [
  { time: '0h', prs: 2, bugs: 1 },
  { time: '4h', prs: 5, bugs: 0 },
  { time: '8h', prs: 12, bugs: 2 },
  { time: '12h', prs: 8, bugs: 0 },
  { time: '16h', prs: 15, bugs: 4 },
  { time: '20h', prs: 25, bugs: 1 },
  { time: '24h', prs: 30, bugs: 0 },
]

export default function UniversidadDashboard() {
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
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-purple-500/30">
      
      {/* Navbar Universitario (Dark Hacker Mode) */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600/20 border border-purple-500/50 p-2 rounded-lg text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter text-slate-100 flex items-center gap-2">
            Talento<span className="text-purple-500">Tech</span> 
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/10 uppercase tracking-widest">University_Tier</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/50 border border-white/10 px-3 py-1.5 rounded-md text-[10px] text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>SESSION_ACTIVE</span>
          </div>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-50">
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">SIGNOUT</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Superior Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0b1120] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
            {/* Ambient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-4 bg-purple-500/10 w-max px-3 py-1 rounded-full border border-purple-500/20">
                <Terminal className="w-3 h-3" /> TERMINAL_ACCESS: GRANTED
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-2">
                Ingeniería de Software
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
                Auditoría en vivo de tus despliegues. Asegúrate de que tus Pull Requests pasen los pipelines de CI/CD para mantener tu SLA por encima de 99.9%.
              </p>
            </div>
            
            <div className="flex items-center gap-6 mt-8 relative z-10 border-t border-white/5 pt-6">
              <div>
                <p className="text-[10px] text-slate-500 mb-1">TOTAL LINES CODED</p>
                <p className="flex items-baseline gap-1 text-2xl font-black text-white">
                  34.2<span className="text-sm font-medium text-purple-500">K</span>
                </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-[10px] text-slate-500 mb-1">GLOBAL RANK</p>
                <p className="text-2xl font-black text-white">#42</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Competencias Core
            </h3>
            <div className="flex-1 w-full relative min-h-[220px] flex items-center justify-center">
              {!isMounted ? (
                <div className="text-slate-500 font-mono text-[10px] animate-pulse">BOOTING_RADAR_CORES...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)' }} />
                    <Radar name="Score" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Infraestructura Aprovisionada
            </h3>
            <div className="space-y-4">
              {[
                { name: 'PostgreSQL (Supabase)', status: 'online', usage: '45%' },
                { name: 'Redis Cache', status: 'online', usage: '12%' },
                { name: 'Oracle Cloud VM Instance', status: 'warning', usage: '89%' },
              ].map((infra, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CloudRain className={`w-5 h-5 ${infra.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{infra.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">CPU/RAM LOAD: {infra.usage}</p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${infra.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors py-2 rounded-lg text-xs font-bold text-slate-300">
              Admin Console &gt;_
            </button>
          </div>

          <div className="lg:col-span-2 bg-[#0b1120] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-400" /> Pull Requests vs Bugs 
              </h3>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">LIVE DATA 24H</span>
            </div>
            
            <div className="h-[250px] w-full flex items-center justify-center">
              {!isMounted ? (
                <div className="text-slate-500 font-mono text-[10px] animate-pulse">CALCULATING_DIFFS...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPRs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBugs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" fontSize={10} stroke="#64748b" tickLine={false} axisLine={false} />
                    <YAxis fontSize={10} stroke="#64748b" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ fontSize: '12px' }} />
                    <Area type="monotone" dataKey="prs" name="Pull Requests" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPRs)" />
                    <Area type="step" dataKey="bugs" name="Bugs Reportados" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorBugs)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
