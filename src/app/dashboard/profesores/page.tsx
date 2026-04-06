'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Users, Search, AlertTriangle, CheckCircle, 
  BookOpen, Beaker, UserX, BarChart3, Fingerprint,
  Activity, ShieldCheck, Loader2, ChevronRight,
  LayoutDashboard, Settings, MoreVertical, Terminal,
  LineChart as LineIcon, Eye, Database,
  GitBranch, GitCommit, GitPullRequest, Globe, Server, Cpu, Code2, Cloud, CheckCircle2, Wrench
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { useProfileStore } from '@/store/useProfileStore'
import Footer from '@/components/Footer'
import { getTeacherDashboardData } from '../actions'
import { useToast } from '@/components/ToastProvider'

const performanceData = [
  { week: 'Sem 1', avg: 65, participation: 80 },
  { week: 'Sem 2', avg: 70, participation: 85 },
  { week: 'Sem 3', avg: 68, participation: 78 },
  { week: 'Sem 4', avg: 75, participation: 90 },
  { week: 'Sem 5', avg: 82, participation: 95 },
  { week: 'Sem 6', avg: 85, participation: 92 },
]

export default function ProfesoresDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { showToast } = useToast()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'stack' | 'students' | 'audit' | 'config'>('overview')
  
  // Real Data states
  const [students, setStudents] = useState<any[]>([])
  const [activeSessions, setActiveSessions] = useState<any[]>([])

  React.useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const data = await getTeacherDashboardData(session.user.id)
        if (data) {
          setStudents(data.students)
          setActiveSessions(data.sessions)
        }
      }
      setDataLoading(false)
    }
    fetchData()
  }, [])

  const isAdmin = activeProfile?.includes('Simulado') || activeProfile === 'Administrador'
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Background Dots Grid - Universidad Style */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }} 
      />

      {/* Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-emerald-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navbar Docente High-Fidelity */}
      <nav className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 p-2 rounded-xl text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase italic leading-none">
                COMMAND<span className="text-cyan-500">CENTER</span>_
              </span>
              <span className="text-[8px] font-bold text-cyan-500/60 tracking-[0.3em] uppercase">Ecosystem_Manager_v2.0</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'overview', label: 'Monitor_Global', icon: BarChart3 },
              { id: 'repos', label: 'Repos_Cohorte', icon: GitBranch },
              { id: 'stack', label: 'Infra_Monitor', icon: Server },
              { id: 'students', label: 'Gestión_Salón', icon: Users },
              { id: 'audit', label: 'Ghost_Audit', icon: Fingerprint },
              { id: 'config', label: 'Ajustes', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${
                  activeTab === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden xl:block">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="SEARCH_NODE..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#020617]/50 border border-white/10 outline-none pl-9 pr-4 py-2 rounded-xl text-[9px] font-black uppercase w-48 focus:border-cyan-500/50 transition-all text-white placeholder:text-slate-700"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 md:px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">NOC_ACCESS</span>
            </button>
          )}

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 md:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Log_Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex justify-around bg-[#0f172a]/95 border-b border-white/5 p-2 sticky top-[65px] z-40 backdrop-blur-md">
        {[
          { id: 'overview', icon: BarChart3 },
          { id: 'repos', icon: GitBranch },
          { id: 'stack', icon: Server },
          { id: 'students', icon: Users },
          { id: 'audit', icon: Fingerprint },
          { id: 'config', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500'}`}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 relative z-10">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Legend / Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[9px] font-black text-cyan-400 tracking-widest mb-4 w-fit">
                    <Activity className="w-3 h-3" />
                    LIVE_COHORTE_TELEMETRY
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-500/50">
                    MONITOR_ <br /> GLOBAL_V2
                  </h2>
               </div>
               <div className="flex gap-4">
                  <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-xl backdrop-blur-md">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Users className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">Total_Nodes</p>
                        <p className="text-xl font-black text-white italic">{dataLoading ? '...' : students.length}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
              <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl group hover:border-cyan-500/40 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 -translate-y-10 translate-x-10 rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                 <div className="flex justify-between items-start mb-10 relative z-10">
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Health_Protocol</p>
                   <div className="p-2 bg-cyan-500/10 rounded-lg"><Activity className="w-4 h-4 text-cyan-500" /></div>
                 </div>
                 <h2 className="text-5xl font-black italic tracking-tighter mb-4 relative z-10">82.4<span className="text-xl text-cyan-400 ml-1">%</span></h2>
                 <p className="text-[9px] text-emerald-500 font-mono flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/20 w-fit">
                   <CheckCircle className="w-3 h-3" />
                   STATUS_STABLE
                 </p>
              </div>

              <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl group hover:border-rose-500/40 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 -translate-y-10 translate-x-10 rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                 <div className="flex justify-between items-start mb-10 relative z-10">
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Thread_Alerts</p>
                   <div className="p-2 bg-rose-500/10 rounded-lg"><Fingerprint className="w-4 h-4 text-rose-500" /></div>
                 </div>
                 <h2 className="text-5xl font-black text-rose-500 italic tracking-tighter mb-4 relative z-10">02<span className="text-xs text-rose-400/50 ml-2 font-mono uppercase tracking-[0.2em]">Priority_1</span></h2>
                 <p className="text-[9px] text-rose-400 font-mono flex items-center gap-2 bg-rose-500/5 px-3 py-1.5 rounded-full border border-rose-500/20 w-fit animate-pulse">
                   <AlertTriangle className="w-3 h-3" />
                   ACTION_REQUIRED
                 </p>
              </div>

              <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl col-span-1 lg:col-span-2 group hover:border-emerald-500/40 transition-all relative overflow-hidden">
                 <div className="flex justify-between items-start relative z-10">
                    <div>
                       <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-3">Sync_Efficiency_Global</p>
                       <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-500">SYNC_INDEX: 94.1</h2>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      HARDENED_SYS
                    </div>
                 </div>
                 <div className="h-2 w-full bg-[#020617] rounded-full mt-10 overflow-hidden border border-white/5 p-[1px] relative z-10">
                    <div className="h-full bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-1000" style={{ width: '94%' }} />
                 </div>
                 <div className="flex justify-between mt-4 text-[7px] font-mono text-slate-600 tracking-widest opacity-50 relative z-10">
                    <span>BUFFER_LOAD: 12%</span>
                    <span>LATENCY_MS: 0.12</span>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl group overflow-hidden">
                  <div className="flex justify-between items-center mb-12 relative z-10">
                     <div>
                        <h3 className="font-black text-2xl text-white tracking-tighter uppercase italic leading-none">Curva_Aprendizaje_A1</h3>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Node_History: Sem 1 - Sem 6</p>
                     </div>
                     <div className="hidden sm:flex gap-6">
                        <div className="flex items-center gap-2 text-[9px] font-black text-cyan-400 uppercase tracking-widest transition-all hover:scale-110"><span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shadow-[0_0_10px_rgba(6,182,212,0.6)] border border-white/10" /> Promedio</div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest transition-all hover:scale-110"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] border border-white/10" /> Participación</div>
                     </div>
                  </div>
                  <div className="h-[350px] w-full relative z-10">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                           <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }} />
                           <YAxis hide />
                           <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', color: '#fff', fontSize: '10px', backdropFilter: 'blur(10px)' }} />
                           <Line type="monotone" dataKey="avg" stroke="#06b6d4" strokeWidth={5} dot={{ r: 6, fill: '#020617', strokeWidth: 3, stroke: '#06b6d4' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                           <Line type="monotone" dataKey="participation" stroke="#10b981" strokeWidth={2} strokeDasharray="6 8" dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-2 opacity-20">
                     <Terminal className="w-3 h-3" />
                     <span className="text-[8px] font-mono tracking-[0.8em] uppercase">Telemetry_Stream_0x77AF</span>
                  </div>
               </div>

               <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl flex flex-col group relative overflow-hidden hover:border-cyan-500/20 transition-all">
                  <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12 group-hover:rotate-0 -translate-y-10 translate-x-10">
                    <Database className="w-64 h-64 text-white" />
                  </div>
                  
                  <h3 className="font-black text-2xl text-white tracking-tighter mb-10 flex items-center gap-4 uppercase italic leading-none">
                     <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                      <AlertTriangle className="text-amber-500 w-5 h-5 flex-shrink-0" /> 
                     </div>
                     NOTIF_CRITICAS
                  </h3>
                  
                  <div className="space-y-5 flex-1 relative z-10">
                     {[
                       { title: 'Detección IA_DETECTED', user: 'M. Salazar', color: 'border-amber-500 bg-amber-500/10 text-amber-400', tag: 'ACADEMIC_INTEGRITY' },
                       { title: 'Inactividad_TIMEOUT', user: 'J. Perez', color: 'border-rose-500 bg-rose-500/10 text-rose-400', tag: 'SESSION_EXPIRED' },
                       { title: 'Performance_LOW', user: 'L. Mendez', color: 'border-slate-700 bg-slate-800/10 text-slate-400', tag: 'METRIC_WARNING' },
                     ].map((alert, i) => (
                       <div key={i} className={`p-5 rounded-2xl border-l-[6px] ${alert.color} group/item hover:translate-x-2 transition-all cursor-pointer relative shadow-lg`}>
                          <p className="font-black text-xs leading-none mb-2 uppercase tracking-widest">{alert.title}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{alert.user}</p>
                            <span className="text-[7px] font-mono opacity-40">{alert.tag}</span>
                          </div>
                          <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                       </div>
                     ))}
                  </div>
                  
                  <button onClick={() => showToast('Auditoría Ghost IA iniciada. Escaneando repositorios de la cohorte...', 'success')} className="w-full mt-12 bg-cyan-600/10 hover:bg-cyan-600 hover:text-white text-cyan-400 border border-cyan-500/30 rounded-2xl py-5 font-black text-[10px] uppercase tracking-[0.4em] transition-all relative z-10 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                     Lanzar Auditoría Ghost_AI
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* REPOS_COHORTE - TEACHER EDITION                                       */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'repos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[80px] rounded-full -translate-y-20 translate-x-20" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4 w-fit">
                      <GitBranch className="w-3 h-3" /> COHORTE_REPOSITORY_MATRIX
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                      REPOS_ <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">COHORTE_</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.2em]">
                      Monitoreo de repositorios de todos los estudiantes del salón
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => showToast('Generando manifesto de repositorios...', 'info')} className="bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl flex items-center gap-2">
                      <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" /> Exportar_Manifest
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'TOTAL_REPOS', value: students.length > 0 ? (students.length * 3).toString() : '0', color: 'text-cyan-400' },
                    { label: 'ACTIVE_PUSHES_24H', value: '12', color: 'text-emerald-400' },
                    { label: 'REVIEW_PENDING', value: '4', color: 'text-amber-400' },
                    { label: 'PASS_RATE_GLOBAL', value: '96%', color: 'text-purple-400' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center hover:border-white/20 transition-all">
                      <p className={`text-2xl font-black italic ${s.color}`}>{s.value}</p>
                      <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Repos Table */}
            <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
              <div className="px-8 md:px-12 py-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-black text-xl text-white uppercase italic tracking-tighter">Registro_de_Envíos_Global</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-[9px] font-black uppercase tracking-widest">ALL</button>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">NEEDS_REVIEW</button>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {students.map((est, i) => (
                  <div key={i} className="px-8 md:px-12 py-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center group-hover:border-cyan-500/40 transition-all shadow-inner overflow-hidden">
                        {est.profiles?.avatar_url ? <img src={est.profiles.avatar_url} className="w-full h-full object-cover" /> : <span className="text-slate-600 font-black text-xs">ID</span>}
                      </div>
                      <div>
                        <p className="font-black text-base text-white uppercase tracking-tighter leading-none group-hover:text-cyan-400 transition-colors mb-1">
                          {est.profiles?.full_name || 'Anonymous_Node'}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] text-slate-600 font-mono flex items-center gap-1.5">
                            <GitCommit className="w-3 h-3 text-cyan-500" /> 3 repos
                          </span>
                          <span className="text-[9px] text-slate-600 font-mono flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> 100% passed
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 uppercase tracking-widest hidden md:flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> ALL_SYNCED
                      </span>
                      <button onClick={() => showToast('Detalle del estudiante disponible próximamente', 'info')} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all">
                        <Eye className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                      </button>
                    </div>
                  </div>
                ))}

                {students.length === 0 && (
                  <div className="px-12 py-32 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mx-auto mb-6 animate-pulse">
                      <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700">SCANNING_REPOSITORY_MATRIX...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* INFRA_MONITOR - TEACHER EDITION                                       */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'stack' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
              <div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4 w-fit">
                  <Server className="w-3 h-3" /> INFRASTRUCTURE_LAYER_V2
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                  INFRA_ <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">MONITOR_</span>
                </h2>
                <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.2em]">
                  Monitoreo de salud del ecosistema institucional
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ALL_SYSTEMS_NOMINAL</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Supabase (Auth + DB)', status: 'online', health: '99.9%', latency: '12ms', icon: Database, color: 'emerald', desc: 'Autenticación y almacenamiento de datos' },
                { name: 'Vercel (CDN + Deploy)', status: 'online', health: '100%', latency: '45ms', icon: Globe, color: 'cyan', desc: 'Despliegue y edge functions' },
                { name: 'GitHub (Source Control)', status: 'online', health: '100%', latency: '80ms', icon: GitBranch, color: 'purple', desc: 'Repositorios y CI/CD' },
                { name: 'Oracle Cloud (Compute)', status: 'online', health: '99.8%', latency: '120ms', icon: Server, color: 'blue', desc: 'Instancias de cómputo OCI' },
                { name: 'Gemini AI (Inference)', status: 'online', health: '99.5%', latency: '250ms', icon: Cpu, color: 'amber', desc: 'Motor de IA para auditorías' },
                { name: 'Edge Functions (WAF)', status: 'online', health: '100%', latency: '8ms', icon: ShieldCheck, color: 'rose', desc: 'Firewall y protección perimetral' },
              ].map((svc, i) => (
                <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2.5rem] p-8 group hover:border-emerald-500/30 transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${svc.color}-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 bg-${svc.color}-500/10 border border-${svc.color}-500/20 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                        <svc.icon className={`w-7 h-7 text-${svc.color}-400`} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[7px] text-emerald-400 font-mono mt-1 uppercase tracking-widest">LIVE</span>
                      </div>
                    </div>
                    
                    <h4 className="text-base font-black text-white mb-1 uppercase tracking-tighter leading-tight">{svc.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{svc.desc}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#020617]/50 rounded-xl p-3 border border-white/5">
                        <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">HEALTH</p>
                        <p className="text-lg font-black text-emerald-400">{svc.health}</p>
                      </div>
                      <div className="bg-[#020617]/50 rounded-xl p-3 border border-white/5">
                        <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">LATENCY</p>
                        <p className="text-lg font-black text-cyan-400">{svc.latency}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black">
                        <span className="text-slate-500 uppercase tracking-widest">UPTIME_30D</span>
                        <span className="text-emerald-400 font-mono">{svc.health}</span>
                      </div>
                      <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div className="bg-gradient-to-r from-emerald-600 to-cyan-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: svc.health }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
             <div className="bg-[#0b1120]/80 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl relative">
                <div className="px-8 md:px-12 py-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                   <div>
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
                          <Users className="text-cyan-500 w-8 h-8"/> 
                        </div>
                        <div>
                          <h3 className="font-black text-3xl md:text-4xl text-white uppercase italic tracking-tighter leading-none">Libro_de_Registro_V1</h3>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-3 leading-none opacity-60">Cohorte: 2024-Q1 • Sincronización Nodo_Sur</p>
                        </div>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="relative group/search">
                         <Search className="w-3.5 h-3.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/search:text-cyan-500 transition-colors" />
                         <input 
                           type="text" 
                           placeholder="FILTER_NODES..." 
                           className="bg-[#020617]/50 border border-white/10 outline-none pl-11 pr-6 py-3 rounded-2xl text-[10px] font-black uppercase w-64 focus:border-cyan-500/50 transition-all text-white placeholder:text-slate-800"
                         />
                      </div>
                      <button onClick={() => showToast('Exportación CSV disponible próximamente', 'info')} className="bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:border-cyan-500/50 transition-all shadow-xl">
                        Exp_Nodes (.CSV)
                      </button>
                   </div>
                </div>
                
                <div className="overflow-x-auto relative z-10">
                   <table className="w-full text-left min-w-[1000px]">
                      <thead>
                         <tr className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                            <th className="px-12 py-6">Identidad_Nodo_Core</th>
                            <th className="px-12 py-6">Bitácora_Misiones</th>
                            <th className="px-12 py-6">XP_Global_Total</th>
                            <th className="px-12 py-6">Status_Protocol</th>
                            <th className="px-12 py-6 text-right">Acciones_V2</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 whitespace-nowrap">
                         {students.map((est, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-all group cursor-default">
                               <td className="px-12 py-7">
                                  <div className="flex items-center gap-6">
                                     <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center font-black text-slate-700 transition-all group-hover:border-cyan-500/40 group-hover:scale-105 overflow-hidden shadow-inner relative">
                                        {est.profiles?.avatar_url ? <img src={est.profiles.avatar_url} className="w-full h-full object-cover" /> : 'ID'}
                                        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                     </div>
                                     <div>
                                        <p className="font-black text-white text-base uppercase tracking-tighter leading-none group-hover:text-cyan-400 transition-colors mb-2">{est.profiles?.full_name || 'Anonymous_Node'}</p>
                                        <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                                          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{est.profile_id.substring(0,18).toUpperCase()}_0x</p>
                                        </div>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-12 py-7">
                                  <div className="flex -space-x-3 group-hover:-space-x-1.5 transition-all duration-500">
                                     {[1,2,3,4].map(s => (
                                       <div key={s} className="w-10 h-10 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center text-[10px] font-black shadow-2xl relative group/icon">
                                          <Activity className="w-4 h-4 text-cyan-500 group-hover/icon:animate-pulse" />
                                          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover/icon:opacity-100 transition-opacity rounded-xl" />
                                       </div>
                                     ))}
                                     <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-black text-cyan-400 shadow-xl backdrop-blur-md hover:bg-cyan-500 hover:text-black transition-all cursor-pointer">+5</div>
                                  </div>
                               </td>
                               <td className="px-12 py-7">
                                  <div className="inline-flex flex-col">
                                    <span className="font-mono font-black text-emerald-400 bg-emerald-500/5 px-5 py-2.5 rounded-xl border border-emerald-500/20 text-base tracking-tighter shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                      12,450_XP
                                    </span>
                                    <span className="text-[7px] text-slate-700 font-mono text-center mt-2 tracking-[0.3em] uppercase">Delta_Verified</span>
                                  </div>
                               </td>
                               <td className="px-12 py-7">
                                  <span className="inline-flex items-center gap-3 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-5 py-2.5 rounded-[1.2rem] uppercase border border-emerald-500/20 tracking-widest group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse group-hover:bg-black" />
                                     Online_Node
                                  </span>
                                </td>
                                <td className="px-12 py-7 text-right">
                                  <button onClick={() => showToast('Menú de opciones del nodo activo', 'info')} className="p-3.5 bg-[#020617] border border-white/10 rounded-2xl hover:border-cyan-500/40 hover:bg-white/5 transition-all group/btn shadow-xl">
                                    <MoreVertical className="w-5 h-5 text-slate-500 group-hover/btn:text-white" />
                                  </button>
                                </td>
                            </tr>
                         ))}
                         {students.length === 0 && (
                            <tr>
                               <td colSpan={5} className="px-12 py-32 text-center relative overflow-hidden">
                                 <div className="flex flex-col items-center gap-6 relative z-10 transition-all">
                                   <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 animate-pulse">
                                     <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-700 mb-2">FETCHING_COHORTE_DATA_STREAM...</p>
                                      <p className="text-[8px] font-mono text-slate-800 uppercase tracking-widest">Protocol: Handshake_Initiated</p>
                                   </div>
                                 </div>
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>

                <div className="px-12 py-6 bg-white/5 border-t border-white/5 flex justify-between items-center relative z-10">
                   <p className="text-[9px] font-mono text-slate-700 tracking-[0.4em] uppercase leading-none">Paging_Kernel_v1.2</p>
                   <div className="flex gap-2">
                      <button className="p-2 border border-white/10 rounded-lg opacity-30 cursor-not-allowed"><ChevronRight className="w-4 h-4 rotate-180" /></button>
                      <button className="p-2 border border-white/10 rounded-lg hover:border-cyan-500/40 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {(activeTab === 'audit' || activeTab === 'config') && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 text-center max-w-4xl mx-auto">
              <div className="bg-[#0b1120]/80 border border-white/10 inline-block p-14 md:p-20 rounded-[4rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:rotate-12 group-hover:opacity-10 transition-all duration-1000 -translate-y-10 translate-x-10"><Fingerprint className="w-64 h-64 text-white" /></div>
                 
                 <div className="w-24 h-24 bg-cyan-500/10 border border-cyan-500/30 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
                   <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                   <div className="absolute inset-0 bg-cyan-500/5 blur-2xl rounded-full" />
                 </div>
                 
                 <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter italic leading-none">CIFRADO_DE_ALTA_ <br /> DENSIDAD_</h2>
                 <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-md mx-auto mt-8 leading-relaxed opacity-60 italic">
                   GHOST_PROTOCOL v4.0 está validando el kernel de seguridad y tus credenciales tácticas para acceso OCI_ROOT.
                 </p>
                 
                 <div className="mt-12 flex items-center justify-center gap-2 text-[8px] font-mono text-slate-800 tracking-[1em] uppercase">
                    Handshaking_Secure_Link_
                 </div>
              </div>
           </div>
        )}

      </main>
      <Footer variant="dashboard" />
    </div>
  )
}
