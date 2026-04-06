'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Code2, GitMerge, GitPullRequest, 
  TerminalSquare, BookMarked, Medal, ArrowRight,
  Zap, Trophy, LayoutDashboard, ShieldCheck, 
  Loader2, Activity, Search, BrainCircuit, Fingerprint,
  ChevronRight, Users, Star, Cpu, Terminal,
  GitBranch, GitCommit, Database, CloudRain, CheckCircle2, Globe, Server
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'
import { useProfileStore } from '@/store/useProfileStore'
import Footer from '@/components/Footer'
import { getUserMetrics } from '../actions'

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
  const [dataLoading, setDataLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'repos' | 'stack' | 'missions' | 'ranking'>('overview')
  const [userName, setUserName] = useState('Cadete')

  // Real Data states
  const [submissions, setSubmissions] = useState<any[]>([])
  const [activePeers, setActivePeers] = useState(0)

  React.useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const data = await getUserMetrics(session.user.id)
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

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Background Dots Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }} 
      />

      {/* Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navbar Colegio */}
      <nav className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('overview')}>
             <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/50 p-2 rounded-xl text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform">
                <TerminalSquare className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             <div className="flex flex-col">
               <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase italic leading-none">
                  TALENTO<span className="text-purple-500">TEEN</span>_
               </span>
               <span className="text-[8px] font-bold text-purple-500/60 tracking-[0.3em] uppercase">Core_System_A3</span>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'overview', label: 'Terminal', icon: LayoutDashboard },
              { id: 'repos', label: 'Code_Vault', icon: GitBranch },
              { id: 'stack', label: 'Tech_Stack', icon: Database },
              { id: 'missions', label: 'Retos_Binarios', icon: Zap },
              { id: 'ranking', label: 'Hall_of_Fame', icon: Trophy },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
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
            <span className="hidden sm:inline">Log_Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex justify-around bg-[#0f172a]/95 border-b border-white/5 p-2 sticky top-[65px] z-40 backdrop-blur-md">
        {[
          { id: 'overview', icon: LayoutDashboard },
          { id: 'repos', icon: GitBranch },
          { id: 'stack', icon: Database },
          { id: 'missions', icon: Zap },
          { id: 'ranking', icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-purple-600/20 text-purple-400' : 'text-slate-500'}`}
          >
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 relative z-10">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 -translate-y-16 translate-x-16 rotate-45 group-hover:rotate-0 transition-transform duration-1000" />
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                       <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                         <ShieldCheck className="w-3 h-3" />
                         Digital Identity Verified
                       </div>
                       <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 font-mono">
                         SYNC_OK: 2024_TEEN
                       </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase italic leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-500/50">
                      HOLA DE NUEVO, <br />{userName}_
                    </h2>
                    <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed mb-10">
                      Tienes <span className="text-purple-400 font-black underline underline-offset-4">3 retos críticos</span> pendientes para el nivel Bronce. <br/>
                      Tu racha de <span className="text-indigo-400 font-black">5 días</span> está online. 🔥
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                       <button onClick={() => setActiveTab('missions')} className="bg-purple-600 hover:bg-purple-500 text-white px-8 md:px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all border border-purple-400/30 flex items-center gap-3 group">
                          Lanzar Próximo Reto
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                       </button>
                       <button onClick={() => setActiveTab('repos')} className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/10 backdrop-blur-md flex items-center gap-2">
                        <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                        Ver Mis Repos
                       </button>
                    </div>
                  </div>
               </div>

               <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl flex flex-col justify-between text-white shadow-2xl group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12 group-hover:rotate-0">
                    <Trophy className="w-48 h-48 text-white" />
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 leading-none">RANGO_TEMPORADA_SYST</p>
                    <div className="flex items-center gap-6 mb-10">
                       <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.15)] border border-amber-400/30 group-hover:scale-110 transition-transform relative">
                          <Trophy className="w-10 h-10 text-white filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                          <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full" />
                       </div>
                       <div>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-500">GOLD_TIER</h3>
                          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">NODE_ID: #12 / 500</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-500 uppercase tracking-[0.2em]">Sync_Protocol: Platinum</span>
                        <span className="text-purple-400">850 / 1000 XP</span>
                     </div>
                     <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-1000" style={{ width: '85%' }} />
                     </div>
                     <div className="flex items-center justify-center gap-1.5 opacity-40">
                        <Terminal className="w-3 h-3 text-slate-500" />
                        <span className="text-[7px] font-mono tracking-[0.3em] uppercase">Delta_Pulse_Stable</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl group overflow-hidden">
                   <div className="flex justify-between items-center mb-12 relative z-10">
                      <div>
                        <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">TELEMETRÍA_CODE_V3</h3>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Data_Stream: Activo</p>
                      </div>
                      <div className="flex gap-6 text-[9px] items-center">
                         <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                           <span className="text-slate-300 font-black uppercase tracking-widest">Commits_Global</span>
                         </div>
                      </div>
                   </div>
                   <div className="h-72 w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={mockCommits}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }} />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: 'rgba(168,85,247,0.03)' }} contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '15px', color: '#fff', fontSize: '10px', backdropFilter: 'blur(10px)' }} />
                            <Bar dataKey="commits" radius={[8, 8, 0, 0]}>
                               {mockCommits.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 5 ? '#8b5cf6' : 'rgba(168,85,247,0.1)'} className="hover:fill-purple-500 transition-all duration-300" />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="mt-6 flex items-center justify-between opacity-30 text-[8px] font-mono uppercase tracking-[0.5em]">
                      <span>Node_0x4F2</span>
                      <span>Buffer_Clear_Ready</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl text-white shadow-2xl group transition-all hover:border-purple-500/20">
                      <div className="flex items-center justify-between mb-10">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500">SQUAD_ACTIVITY_LOG</h4>
                        <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:bg-purple-500/10 transition-colors">
                          <Users className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                        </div>
                      </div>
                      <div className="space-y-5">
                         {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-5 group/item cursor-pointer p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                               <div className="w-12 h-12 rounded-xl bg-[#020617] border border-white/5 group-hover/item:border-purple-500/50 transition-all overflow-hidden flex items-center justify-center relative">
                                  <span className="text-slate-600 font-black text-xs relative z-10">{i}U</span>
                                  <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-200 group-hover/item:text-purple-400 transition-colors uppercase italic tracking-tighter">GhostUser_{i*432}</p>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Reto: React_Hooks_V3</p>
                                </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <button className="w-full bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-[#0b1120]/80 border border-purple-500/20 hover:border-purple-500/40 text-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 transition-all group relative overflow-hidden shadow-2xl backdrop-blur-xl group-hover:-translate-y-2">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000" />
                      
                      <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 group-hover:border-purple-500/50 transition-all shadow-[0_0_30px_rgba(168,85,247,0.1)] relative">
                        <BrainCircuit className="w-10 h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        <div className="absolute inset-0 bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-center relative z-10">
                        <p className="font-black text-3xl tracking-tighter uppercase italic leading-none mb-2">SALA_DE_PARES</p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{activePeers} COMPAÑEROS ONLINE</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* CODE_VAULT (REPOS) - TEEN EDITION                                     */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'repos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full -translate-y-20 translate-x-20" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-10">
                  <div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 mb-4 w-fit">
                      <GitBranch className="w-3 h-3" /> REPOSITORY_PROTOCOL_V3
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                      CODE_ <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">VAULT_</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.2em]">
                      Gestiona tus repositorios y envíos. Cada commit cuenta.
                    </p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-[10px] uppercase tracking-widest flex items-center gap-3 border border-purple-400/30">
                    <GitCommit className="w-4 h-4" /> Nuevo Envío
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'REPOS_TOTAL', value: submissions.length.toString(), color: 'text-purple-400' },
                    { label: 'COMMITS_WEEK', value: '47', color: 'text-indigo-400' },
                    { label: 'PASS_RATE', value: '100%', color: 'text-emerald-400' },
                    { label: 'XP_FROM_CODE', value: `${submissions.length * 200}`, color: 'text-amber-400' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                      <p className={`text-2xl font-black italic ${s.color}`}>{s.value}</p>
                      <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Repo List */}
            <div className="space-y-4">
              {submissions.map((sub, i) => (
                <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-6 md:p-8 flex items-center justify-between group hover:border-purple-500/30 hover:bg-[#020617] transition-all shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-purple-500/50 transition-all shadow-inner">
                      <GitCommit className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-white group-hover:text-purple-400 transition-colors uppercase tracking-tighter leading-none mb-2">
                        {sub.repository_url.split('/').pop()}
                      </h4>
                      <div className="flex items-center gap-4">
                        <p className="text-[9px] text-slate-600 font-mono truncate max-w-[300px]">{sub.repository_url}</p>
                        <span className="text-[8px] text-slate-700 font-mono">HASH: {Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right hidden md:block">
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-600">{new Date(sub.created_at).toLocaleDateString()}</span>
                    <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-400" />
                    </button>
                  </div>
                </div>
              ))}

              {submissions.length === 0 && (
                <div className="bg-[#0b1120]/80 border border-dashed border-white/10 rounded-[2.5rem] p-20 text-center">
                  <Terminal className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-3">QUEUE_EMPTY_</h3>
                  <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em]">
                    Ejecuta tu primer commit para activar el Code Vault
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TECH_STACK (INFRAESTRUCTURA) - TEEN EDITION                            */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'stack' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
              <div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 w-fit">
                  <Database className="w-3 h-3" /> INFRASTRUCTURE_LAYER
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                  TECH_ <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">STACK_</span>
                </h2>
                <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.2em]">
                  Tu ecosistema de desarrollo en la nube
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'GitHub (Repositorios)', status: 'online', usage: '65%', desc: 'Control de versiones y colaboración', icon: GitBranch, color: 'purple' },
                { name: 'Vercel (Deploy)', status: 'online', usage: '30%', desc: 'Despliegue automático de tu código', icon: Globe, color: 'blue' },
                { name: 'Supabase (Base de Datos)', status: 'online', usage: '20%', desc: 'Almacenamiento y autenticación', icon: Database, color: 'emerald' },
                { name: 'Editor VS Code', status: 'online', usage: '90%', desc: 'Tu IDE de desarrollo pro', icon: Code2, color: 'indigo' },
                { name: 'Terminal / CLI', status: 'learning', usage: '35%', desc: 'Comandos y scripts del sistema', icon: TerminalSquare, color: 'cyan' },
                { name: 'Gemini AI (Asistente)', status: 'online', usage: '50%', desc: 'Inteligencia artificial para coding', icon: BrainCircuit, color: 'amber' },
              ].map((infra, i) => (
                <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-purple-500/30 transition-all backdrop-blur-xl shadow-2xl relative overflow-hidden">
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${infra.color}-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 bg-${infra.color}-500/10 border border-${infra.color}-500/20 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
                        <infra.icon className={`w-7 h-7 text-${infra.color}-400`} />
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${infra.status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                    </div>
                    
                    <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tighter leading-tight">{infra.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">{infra.desc}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black">
                        <span className="text-slate-500 uppercase tracking-widest">DOMINION_RATE</span>
                        <span className="text-purple-400 font-mono">{infra.usage}</span>
                      </div>
                      <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 p-[1px]">
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.3)]" style={{ width: infra.usage }} />
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[8px] text-slate-700 font-mono uppercase tracking-widest">
                        STATUS: {infra.status === 'online' ? 'ACTIVE_NODE' : 'LEARNING_MODE'}
                      </span>
                      <span className="text-[8px] text-purple-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                        INSPECT →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
               <div>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500/50">RETOS_ <br />BINARIOS_</h2>
                 <p className="text-slate-500 text-sm mt-4 font-bold uppercase tracking-[0.3em] opacity-80 flex items-center gap-3">
                   <TerminalSquare className="w-4 h-4 text-purple-500" />
                   Módulo 04: Arquitecturas_Descentralizadas
                 </p>
               </div>
               <div className="flex gap-4">
                  <div className="px-6 py-3 bg-[#0b1120]/80 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3 shadow-xl backdrop-blur-md">
                    <Fingerprint className="w-4 h-4 text-purple-500 animate-pulse" />
                    Frontend_Core_V3
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                  { title: 'Protocolo Flexbox', xp: '250 XP', diff: 'LOW', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                  { title: 'The Grid Engine', xp: '450 XP', diff: 'MID', color: 'text-purple-400', border: 'border-purple-500/20' },
                  { title: 'Cyber_Animations', xp: '800 XP', diff: 'HIGH', color: 'text-rose-400', border: 'border-rose-500/20' },
                  { title: 'REST_Interceptor', xp: '500 XP', diff: 'MID', color: 'text-blue-400', border: 'border-blue-500/20' },
                  { title: 'State_Singularity', xp: '1000 XP', diff: 'BOSS', color: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
                  { title: 'Deployment_Edge', xp: '300 XP', diff: 'LOW', color: 'text-cyan-400', border: 'border-cyan-500/20' },
                ].map((mission, i) => (
                  <div key={i} className={`bg-[#0b1120]/80 border ${mission.border} rounded-[2.5rem] p-10 backdrop-blur-xl hover:border-white/40 transition-all group relative shadow-2xl overflow-hidden hover:-translate-y-2`}>
                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     
                     <div className="flex justify-between items-start mb-16 relative z-10">
                        <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase border border-white/5 bg-[#020617]/60 ${mission.color} tracking-[0.2em] shadow-inner`}>
                           DIFF: {mission.diff}
                        </div>
                        <span className="font-mono text-[10px] text-slate-700 tracking-tighter leading-none opacity-50 uppercase">Sec_0x{i+100}_CORE</span>
                     </div>
                     
                     <div className="relative z-10">
                        <h4 className="text-3xl font-black mb-3 group-hover:text-purple-400 transition-colors uppercase italic tracking-tighter leading-none">{mission.title}</h4>
                        <p className="text-[11px] text-slate-500 font-bold mb-12 tracking-[0.2em]">RECOMPENSA: <span className="text-white font-black">{mission.xp}</span></p>
                        
                        <button className="w-full py-5 rounded-2xl bg-[#020617] border border-white/5 group-hover:bg-purple-600 group-hover:border-purple-400/50 text-[10px] font-black uppercase tracking-[0.4em] transition-all group-hover:text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center gap-3">
                           Iniciar_Protocolo
                           <Zap className="w-3.5 h-3.5" />
                        </button>
                     </div>

                     <div className="absolute bottom-4 left-10 right-10 flex gap-2">
                        {[1,2,3,4].map(s => <div key={s} className="h-1 flex-1 bg-white/5 rounded-full" />)}
                     </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-10 text-white">
             <div className="text-center mb-24 relative">
                <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full -z-10" />
                <div className="w-24 h-24 bg-purple-500/5 border border-purple-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(168,85,247,0.1)] group">
                  <Trophy className="w-12 h-12 text-purple-500 animate-pulse group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-500/50">HALL_OF_ <br /> FAME_</h2>
                <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-[11px] mt-8 opacity-70">Global_Sync: Nodo_Sur_Core_IAD1</p>
             </div>
             
             <div className="space-y-6">
                {[1,2,3,4,5].map(rank => (
                   <div key={rank} className={`flex items-center justify-between p-8 rounded-[3rem] backdrop-blur-3xl border transition-all relative overflow-hidden group ${rank === 1 ? 'bg-purple-500/5 border-purple-500/30 scale-105 shadow-[0_0_60px_rgba(168,85,247,0.15)]' : 'bg-[#0b1120]/60 border-white/5 shadow-2xl hover:border-white/20'}`}>
                      {rank === 1 && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent pointer-events-none" />}
                      
                      <div className="flex items-center gap-8 relative z-10">
                         <span className={`text-5xl font-black italic tracking-tighter leading-none ${rank === 1 ? 'text-purple-500' : 'text-slate-800'}`}>0{rank}_</span>
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#020617] border border-white/10 flex items-center justify-center font-black group-hover:border-purple-500/40 transition-all shadow-inner overflow-hidden relative">
                               <span className="text-slate-500 text-sm group-hover:text-purple-400">U{rank}</span>
                               <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                               <p className="font-black text-2xl tracking-tighter uppercase italic group-hover:text-purple-400 transition-all leading-none">Alumno_Promesa_{rank*7}</p>
                               <div className="flex items-center gap-3 mt-2">
                                 <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-0.5">REG_NODE: CO-ANT-0{rank}_SEC</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="text-right relative z-10 flex flex-col items-end">
                         <p className="text-3xl font-black tracking-tighter text-purple-400 font-mono leading-none">{2000 - rank*150} XP</p>
                         <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] mt-3 bg-white/5 px-3 py-1 rounded-full border border-white/5">PROTO_OK</p>
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="mt-20 text-center opacity-30 flex items-center justify-center gap-6">
                <div className="h-px w-20 bg-white/10" />
                <span className="text-[9px] font-mono tracking-[0.6em] uppercase">End_Of_Transmission</span>
                <div className="h-px w-20 bg-white/10" />
             </div>
          </div>
        )}
      </main>
      <Footer variant="dashboard" />
    </div>
  )
}
