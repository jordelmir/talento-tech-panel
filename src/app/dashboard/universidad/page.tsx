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
import { useProfileStore } from '@/store/useProfileStore'
import { ShieldCheck, Loader2, Search, BrainCircuit, Fingerprint, Globe, Cpu as CpuIcon, Users, Code2 } from 'lucide-react'
import Footer from '@/components/Footer'
import { getUserMetrics } from '../actions'
import StreakTracker from '@/components/StreakTracker'
import CodePlayground from '@/components/CodePlayground'
import MentorshipPanel from '@/components/MentorshipPanel'
import RepoSubmit from '@/components/RepoSubmit'
import { useToast } from '@/components/ToastProvider'

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
  const [dataLoading, setDataLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'live_code' | 'mentors' | 'stack' | 'settings'>('overview')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'warn'} | null>(null)
  const { showToast: globalToast } = useToast()
  
  const showToast = (message: string, type: 'success' | 'warn' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  // Real Data states
  const [userProfile, setUserProfile] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [activePeers, setActivePeers] = useState(0)
  const [userId, setUserId] = useState<string>('')

  React.useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUserId(session.user.id)
        const data = await getUserMetrics(session.user.id)
        setUserProfile(data.profile)
        setSubmissions(data.submissions)
        setActivePeers(data.activePeers)
      }
      setDataLoading(false)
    }
    fetchData()
  }, [])

  const isAdmin = activeProfile?.includes('Simulado') || activeProfile === 'Administrador'

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Navbar Universitario (Dark Hacker Mode) */}
      <nav className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/20 border border-purple-500/50 p-2 rounded-lg text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-slate-100">
              Talento<span className="text-purple-500">Tech</span> 
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {[
              { id: 'overview', label: 'Dashboard', icon: Activity },
              { id: 'repos', label: 'Repositorios', icon: GitBranch },
              { id: 'live_code', label: 'Playground', icon: Code2 },
              { id: 'mentors', label: 'Mentors', icon: Users },
              { id: 'stack', label: 'Infraestructura', icon: Database },
              { id: 'settings', label: 'Settings', icon: Zap },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">NOC_ACCESS</span>
            </button>
          )}

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-50">
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex justify-around bg-[#0f172a]/95 border-b border-white/5 p-2 sticky top-[57px] z-40 backdrop-blur-md">
        {[
          { id: 'overview', icon: Activity },
          { id: 'repos', icon: GitBranch },
          { id: 'live_code', icon: Code2 },
          { id: 'mentors', icon: Users },
          { id: 'stack', icon: Database },
          { id: 'settings', icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500'}`}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-[60] animate-in fade-in slide-in-from-right-5">
          <div className={`px-4 py-2 rounded-lg border backdrop-blur-xl shadow-2xl flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest
            ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-amber-500/10 border-amber-500/50 text-amber-400'}
          `}>
             <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
             {toast.message}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <StreakTracker variant="full" accentColor="blue" />
            {/* Superior Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-[10px] text-purple-400 font-mono uppercase tracking-widest mb-1">Compute_Units</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-white">128.4</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">+12.5%</span>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest mb-1">Network_IO</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-white">2.4 Gbps</h3>
                  <span className="text-[10px] text-blue-400 font-mono">STABLE</span>
                </div>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-[10px] text-rose-400 font-mono uppercase tracking-widest mb-1">Shield_Status</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-white">HARDENED</h3>
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-center">
                <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-1">Active_Tasks</p>
                <div className="flex justify-between items-end">
                  <h3 className="text-2xl font-black text-white">14</h3>
                  <span className="text-[10px] text-emerald-500 font-mono">ON_TIME</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#0b1120]/80 border border-white/10 rounded-2xl p-6 md:p-10 relative overflow-hidden flex flex-col justify-center backdrop-blur-xl">
                {/* Visual Grid Ambient */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 text-[10px] font-black text-purple-400 mb-6 bg-purple-500/10 w-max px-4 py-1.5 rounded-full border border-purple-500/20 tracking-tighter uppercase">
                    <Fingerprint className="w-3 h-3" /> Digital Identity Verified: {userProfile?.full_name || 'MASTER_ARCHITECT'}
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
                    Ingeniería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Sistemas</span>
                  </h1>
                  <p className="text-slate-400 text-sm md:text-lg max-w-xl leading-relaxed font-sans opacity-80">
                    Tu entorno de desarrollo está sincronizado con la infraestructura global. Gestiona tus microservicios, monitorea el tráfico y optimiza tu arquitectura.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 mt-10 relative z-10 border-t border-white/5 pt-8">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest flex items-center gap-2">
                       <Globe className="w-3 h-3" /> Nodes_Deploys
                    </p>
                    <p className="flex items-baseline gap-1 text-3xl font-black text-white">
                      {dataLoading ? '...' : submissions.length}<span className="text-xs font-bold text-purple-500">.OPS</span>
                    </p>
                  </div>
                  <div className="w-px h-10 bg-white/10 hidden sm:block" />
                  <div>
                    <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest flex items-center gap-2">
                       <BrainCircuit className="w-3 h-3" /> System_Rank
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter shadow-sm shadow-blue-500/20">Alpha-Tier</p>
                  </div>
                  <div className="w-px h-10 bg-white/10 hidden sm:block" />
                  <div className="flex flex-col">
                    <p className="text-[10px] text-slate-500 mb-2 font-mono uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-3 h-3 text-emerald-400" /> Latency_avg
                    </p>
                    <p className="text-3xl font-black text-emerald-400 tracking-tighter">14<span className="text-xs ml-1">ms</span></p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 w-full">
                  <RepoSubmit userId={userId || 'simulated'} variant="full" onSubmitSuccess={() => showToast('Sistema subido para análisis', 'success')} />
                </div>
              </div>

              <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl group hover:border-purple-500/30 transition-all">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
                    <BrainCircuit className="w-4 h-4 text-purple-400" /> Core_Capabilities
                  </h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="flex-1 w-full relative min-h-[240px] flex items-center justify-center">
                  {!isMounted ? (
                    <div className="text-slate-500 font-mono text-[10px] animate-pulse">ALIGNED_RADAR_PIPELINE...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Radar name="Proficiency" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} strokeWidth={3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 justify-center">
                   <div className="px-2 py-1 bg-white/5 border border-white/5 text-[9px] text-slate-500 rounded font-mono uppercase tracking-tighter hover:text-white transition-colors">Algoritmia_90</div>
                   <div className="px-2 py-1 bg-white/5 border border-white/5 text-[9px] text-slate-500 rounded font-mono uppercase tracking-tighter hover:text-white transition-colors">Seguridad_85</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
              <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
                    <GitBranch className="w-4 h-4 text-blue-400" /> Git_Telemetry / PR_Velocity
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-blue-400"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PULL_REQUESTS</span>
                    <span className="flex items-center gap-1.5 text-[9px] font-mono text-rose-400"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> BUGS_FOUND</span>
                  </div>
                </div>
                <div className="h-[280px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPRsUniv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="time" fontSize={9} stroke="#475569" tickLine={false} axisLine={false} />
                        <YAxis fontSize={9} stroke="#475569" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="prs" name="Commit Freq" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPRsUniv)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
              </div>

               <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                 <div className="flex justify-between items-center mb-8">
                   <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 font-mono">
                     <Terminal className="w-4 h-4 text-purple-400" /> Deployment_Journal (Real_Time)
                   </h3>
                   <button onClick={() => showToast('Refrescando registros de despliegue...', 'success')} className="p-1.5 hover:bg-white/5 rounded-md transition-colors">
                     <Search className="w-3.5 h-3.5 text-gray-500" />
                   </button>
                 </div>
                 <div className="space-y-3">
                   {submissions.slice(0, 5).map((sub, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] mb-1" />
                              <div className="w-[1px] h-4 bg-white/10" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-white uppercase tracking-tighter group-hover:text-purple-400 transition-colors">
                                {sub.repository_url.split('/').pop()?.substring(0, 20)}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-[9px] text-slate-500 font-mono">HASH: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                                <span className="text-[9px] text-slate-600 font-mono">{new Date(sub.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">PASSED</span>
                        </div>
                     </div>
                   ))}
                   {submissions.length === 0 && (
                     <div className="py-20 flex flex-col items-center justify-center opacity-30">
                        <Terminal className="w-12 h-12 mb-4" />
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em]">NO_LOGS_DETECTED</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'live_code' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CodePlayground accentColor="blue" />
          </div>
        )}

        {activeTab === 'mentors' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MentorshipPanel accentColor="blue" />
          </div>
        )}

        {activeTab === 'repos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#0b1120] border border-white/10 rounded-2xl p-8">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h2 className="text-2xl font-black text-white tracking-tight">Consola de Repositorios</h2>
                   <p className="text-slate-500 text-sm">Gestiona tus participaciones y envíos a revisión.</p>
                </div>
                {userId && <RepoSubmit userId={userId} variant="compact" onSubmitSuccess={() => window.location.reload()} />}
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {submissions.map((sub, i) => (
                   <div key={i} className="p-5 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white">
                            <GitCommit className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors uppercase">{sub.repository_url.split('/').pop()}</h4>
                            <p className="text-xs text-slate-500 font-mono">{sub.repository_url}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">VERIFIED</p>
                         </div>
                         <button onClick={() => window.open(sub.repository_url, '_blank')} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/30 transition-all">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                         </button>
                      </div>
                   </div>
                ))}
                {submissions.length === 0 && <div className="py-20 text-center text-slate-600 font-mono uppercase tracking-widest">QUEUE_EMPTY</div>}
             </div>
          </div>
        )}

        {activeTab === 'stack' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> Infraestructura Aprovisionada
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'PostgreSQL (Supabase)', status: 'online', usage: '45%' },
                    { name: 'Redis Cache (KV)', status: 'online', usage: '12%' },
                    { name: 'Oracle Cloud VM (Compute)', status: 'warning', usage: '89%' },
                    { name: 'Edge Nodes (Vercel)', status: 'online', usage: '22%' },
                    { name: 'AI Interface (Gemini)', status: 'online', usage: '5%' }
                  ].map((infra, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-white/5 rounded-xl">
                           <CloudRain className={`w-6 h-6 ${infra.status === 'online' ? 'text-cyan-400' : 'text-amber-400'}`} />
                        </div>
                        <span className={`w-2 h-2 rounded-full ${infra.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white mb-1 uppercase tracking-tight">{infra.name}</p>
                        <div className="flex justify-between items-center">
                           <p className="text-[10px] text-slate-500 font-mono">UTILIZATION_RATE</p>
                           <p className="text-xs font-bold text-cyan-400 font-mono">{infra.usage}</p>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                           <div className="bg-cyan-500 h-full rounded-full" style={{ width: infra.usage }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto space-y-6">
              <div className="bg-[#0b1120] border border-white/10 rounded-2xl p-8">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Zap className="text-purple-400" /> Perfil Técnico</h2>
                 <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-center justify-between">
                       <div>
                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Nombre Público</p>
                          <p className="text-white font-bold">{userProfile?.full_name || 'Anonymous Developer'}</p>
                       </div>
                       <button className="text-xs font-bold text-purple-400 hover:text-white transition-colors">EDIT_REF</button>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                       <p className="text-xs text-slate-500 uppercase font-bold mb-3">Notificaciones Críticas (Warp Drive)</p>
                       <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                          <p className="text-sm text-slate-300">Alertas de fallo en Build</p>
                          <div className="w-10 h-5 bg-purple-600 rounded-full relative">
                             <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>
      <Footer variant="dashboard" />
    </div>
  )
}
