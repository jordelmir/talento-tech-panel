'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Star, Trophy, Target, Gamepad2, 
  Map, Sparkles, BookOpen, GraduationCap,
  Search, Cpu, Rocket, ShieldCheck, Loader2,
  Heart, Zap, Crown, User, Users, Medal, ChevronRight, Activity, Terminal
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts'
import { useProfileStore } from '@/store/useProfileStore'
import Footer from '@/components/Footer'
import { getUserMetrics } from '../actions'

const rankings = [
  { name: 'Player_Ultra', pts: 25 },
  { name: 'Gamer_Coder', pts: 21 },
  { name: 'Web_Hero', pts: 18 },
]

export default function EscuelaDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  
  const [activeTab, setActiveTab] = useState<'mission_control' | 'awards' | 'gear'>('mission_control')
  const [playerName, setPlayerName] = useState('Super Creador')
  
  // Real Data states
  const [submissions, setSubmissions] = useState<any[]>([])

  React.useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const data = await getUserMetrics(session.user.id)
        setSubmissions(data.submissions)
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
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-orange-500/30 overflow-x-hidden">
      
      {/* Background Dots Grid - Universidad Style */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
           style={{ 
             backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }} 
      />

      {/* Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navbar Escolar High-Fidelity */}
      <nav className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('mission_control')}>
            <div className="bg-gradient-to-br from-orange-500/20 to-pink-600/20 border border-orange-500/50 p-2 rounded-xl text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)] group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase italic leading-none">
                TALENTO<span className="text-orange-500">KIDS</span>_
              </span>
              <span className="text-[8px] font-bold text-orange-500/60 tracking-[0.3em] uppercase">Gami_Engine_v0.9</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'mission_control', label: 'Misiones', icon: Gamepad2, color: 'text-orange-400' },
              { id: 'awards', label: 'Premios', icon: Trophy, color: 'text-yellow-400' },
              { id: 'gear', label: 'Equipo', icon: Sparkles, color: 'text-pink-400' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${
                  activeTab === tab.id 
                    ? 'bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)] border border-white/20' 
                    : `text-slate-500 hover:text-white hover:bg-white/5`
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${tab.color}`} />
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
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 md:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log_Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden flex justify-around bg-[#0f172a]/95 border-b border-white/5 p-2 sticky top-[65px] z-40 backdrop-blur-md">
        {[
          { id: 'mission_control', icon: Gamepad2, color: 'text-orange-400' },
          { id: 'awards', icon: Trophy, color: 'text-yellow-400' },
          { id: 'gear', icon: Sparkles, color: 'text-pink-400' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-slate-500'}`}
          >
            <tab.icon className={`w-5 h-5 ${tab.color}`} />
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 relative z-10">
        
        {activeTab === 'mission_control' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 md:space-y-10">
            {/* Hero Section - Universidad Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl group backdrop-blur-xl">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 -translate-y-10 translate-x-10 rotate-45 group-hover:rotate-0 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                       <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                         <ShieldCheck className="w-3 h-3" />
                         Digital Identity Verified
                       </div>
                       <div className="flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 font-mono">
                         SYNC_OK: 2024_KIDS
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                       <div className="flex-1">
                          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-[0.9] uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-orange-500/50">
                            BIENVENIDO, <br />{playerName}_
                          </h2>
                          <p className="text-slate-400 font-medium max-w-sm mb-8 text-sm md:text-base leading-relaxed">
                            Has completado el <span className="text-orange-400 font-black underline underline-offset-4">85% de tus misiones</span>. <br/>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 block">Protocolo: ACCESO_ESTELAR_ACTIVO</span>
                          </p>
                          
                          <div className="flex flex-wrap gap-3">
                             <button className="bg-orange-600 hover:bg-orange-500 text-white px-8 md:px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all flex items-center gap-2 group border border-orange-400/30">
                               Continuar Aventura
                               <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                             </button>
                             <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all backdrop-blur-md">
                               Mapa Táctico
                             </button>
                          </div>
                       </div>
                       
                       <div className="w-full md:w-auto p-10 bg-[#020617]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] flex flex-col items-center shadow-2xl text-center min-w-[240px] group-hover:border-orange-500/20 transition-all">
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-400/20 to-pink-500/20 border border-orange-500/50 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,115,22,0.15)] relative group-hover:scale-105 transition-transform">
                            <Star className="w-10 h-10 text-orange-400 fill-orange-400 animate-pulse" />
                            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-50" />
                          </div>
                          <span className="text-6xl font-black text-white italic tracking-tighter leading-none">{dataLoading ? '...' : (submissions.length + 12) * 100}</span>
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mt-4 leading-none">PUNTOS_XP_TOTAL</span>
                          <div className="w-full h-px bg-white/5 my-4" />
                          <div className="flex gap-4">
                             <div>
                                <p className="text-xs font-black text-white italic">24</p>
                                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Nivel</p>
                             </div>
                             <div className="w-px h-6 bg-white/10" />
                             <div>
                                <p className="text-xs font-black text-orange-400 italic">PRO</p>
                                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Rango</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Squad Sidebar - Universidad Style */}
               <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col justify-between group overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-xl font-black tracking-tighter text-white uppercase italic">SQUAD_ONLINE</h3>
                        <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          NET_ACTIVE
                        </p>
                      </div>
                      <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                        <Users className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       {[1,2,3].map(i => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-orange-500/30 hover:bg-white/10 transition-all cursor-pointer group/item relative overflow-hidden">
                             <div className="w-10 h-10 rounded-xl bg-[#020617] border border-white/10 flex items-center justify-center text-orange-500 font-black text-xs shadow-inner">U{i}</div>
                             <div>
                                <p className="font-black text-sm text-slate-200 group-hover/item:text-orange-400 transition-colors uppercase block">HeroUser_{i*12}</p>
                                <div className="flex items-center gap-2 mt-1">
                                   <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full bg-orange-500 w-2/3" />
                                   </div>
                                   <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">LVL {rankings[i-1]?.pts || 5}</p>
                                </div>
                             </div>
                             <div className="absolute right-4 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <ChevronRight className="w-3 h-3 text-slate-500" />
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                  
                  <button className="mt-8 w-full py-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-[inset_0_0_20px_rgba(251,146,60,0.05)]">
                    <Gamepad2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Entrar a Sala de Juego
                    <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500 w-0 group-hover:w-full transition-all duration-500" />
                  </button>
               </div>
            </div>

            {/* Missions Section - Universidad Multi-gradient Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
               <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl backdrop-blur-xl relative group">
                  <div className="absolute top-10 right-10 p-4 border border-orange-500/20 rounded-2xl bg-orange-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Zap className="text-orange-400 fill-orange-400 w-6 h-6 animate-pulse" />
                  </div>
                  
                  <div className="mb-10">
                     <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">MISIONES_TACTICAS</h3>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Estatus: 03_PENDIENTES_DE_CARGA</p>
                  </div>
                  
                  <div className="space-y-5">
                     {[
                        { title: 'Variables Mágicas', color: 'from-orange-500 to-amber-500', icon: Zap, status: '80%', tag: 'CORE_JS' },
                        { title: 'El Gran Bucle', color: 'from-pink-500 to-purple-500', icon: Rocket, status: '20%', tag: 'LOGIC_V2' },
                        { title: 'Misterio de CSS', color: 'from-blue-500 to-cyan-500', icon: Sparkles, status: '5%', tag: 'DESIGN_UI' },
                     ].map((m, i) => (
                        <div key={i} className="p-5 bg-[#020617]/40 border border-white/5 rounded-[1.5rem] group hover:border-orange-500/40 transition-all relative overflow-hidden">
                           <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-xl text-white bg-gradient-to-br ${m.color} shadow-lg shadow-black/40`}><m.icon className="w-5 h-5" /></div>
                                 <div>
                                   <h4 className="font-black text-xs text-white uppercase tracking-widest">{m.title}</h4>
                                   <p className="text-[8px] font-mono text-slate-500 group-hover:text-orange-400/60 transition-colors mt-0.5">{m.tag}</p>
                                 </div>
                              </div>
                              <span className="font-black text-xs text-white italic font-mono">{m.status}</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                              <div className={`bg-gradient-to-r ${m.color} h-full transition-all duration-1000 shadow-[0_0_15px_rgba(251,146,60,0.3)]`} style={{ width: m.status }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl group">
                  <div className="absolute -top-10 -right-10 p-20 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Trophy className="w-48 h-48 text-white" />
                  </div>
                  
                  <div className="mb-10">
                    <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">RANKING_PLAYER_BASE_</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] mt-1">Sincronizado con Nodo Central_LA</p>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    {[
                      { name: 'Player_Ultra', xp: '2,500', medal: '🥇', c: 'text-yellow-400', b: 'border-yellow-500/20 bg-yellow-500/5' },
                      { name: 'Gamer_Coder', xp: '2,100', medal: '🥈', c: 'text-slate-400', b: 'border-slate-500/20 bg-white/5' },
                      { name: 'Web_Hero', xp: '1,850', medal: '🥉', c: 'text-orange-400', b: 'border-orange-500/20 bg-orange-500/5' },
                    ].map((user, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl border ${user.b} group/leader cursor-default transition-all hover:-translate-x-2`}>
                        <div className="flex items-center gap-5">
                           <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{user.medal}</span>
                           <div>
                             <p className="font-black text-sm md:text-base text-slate-200 group-hover/leader:text-white transition-colors uppercase italic">{user.name}</p>
                             <div className="flex items-center gap-1.5 mt-1">
                               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status: Active</span>
                             </div>
                           </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-black text-lg md:text-xl ${user.c} font-mono tracking-tighter`}>{user.xp} XP</span>
                          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-none mt-1">Global_Pos: 0{idx+1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-10 w-full py-4 text-slate-600 hover:text-white font-black uppercase text-[9px] tracking-[0.4em] transition-colors border-t border-white/5 group-hover:border-orange-500/20">
                    HISTORIAL_COMPLETO_SYSTEM
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
             <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="w-24 h-24 bg-yellow-500/5 border border-yellow-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.15)] relative">
                  <Trophy className="w-12 h-12 text-yellow-500 animate-bounce" />
                  <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-full" />
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">MURO DE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">CAMPEONES_</span></h2>
                <p className="text-slate-500 font-bold text-sm md:text-lg mt-6 uppercase tracking-[0.3em] opacity-80">Legado Digital encriptado en el núcleo.</p>
             </div>
             
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {submissions.map((sub, i) => (
                  <div key={i} className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center text-center group hover:-translate-y-3 transition-all hover:border-yellow-500/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                     <div className="absolute top-4 right-4"><Sparkles className="w-4 h-4 text-orange-400 group-hover:animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                     <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/10 flex items-center justify-center mb-8 text-white group-hover:rotate-12 transition-transform relative">
                        <Star className="w-10 h-10 fill-white" />
                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <h4 className="font-black text-white uppercase text-[10px] tracking-widest truncate w-full mb-4 px-2">{sub.repository_url.split('/').pop()}</h4>
                     <div className="px-5 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-full text-[9px] font-black uppercase tracking-widest group-hover:bg-yellow-500 group-hover:text-black transition-colors">LEGENDARIO_CORE</div>
                  </div>
                ))}
                
                {Array.from({ length: Math.max(0, 10 - submissions.length) }).map((_, i) => (
                  <div key={i} className="bg-white/0 border border-dashed border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center opacity-10 group hover:opacity-20 transition-opacity">
                     <Zap className="w-12 h-12 text-slate-500 animate-pulse" />
                     <span className="text-[8px] font-black uppercase tracking-widest mt-4">NO_DATA_STREAM</span>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'gear' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                 <div className="md:col-span-1 space-y-6">
                    <div className="aspect-square bg-[#0b1120]/80 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center p-10 group relative overflow-hidden shadow-2xl backdrop-blur-xl">
                       <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-36 h-36 bg-[#020617] rounded-full flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-700 shadow-inner overflow-hidden relative">
                         <User className="w-16 h-16 text-slate-400 group-hover:text-white transition-colors" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                       </div>
                       <div className="absolute bottom-10 flex gap-3">
                          <div className="p-2 bg-yellow-500/20 border border-yellow-500/40 rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.2)]"><Crown className="w-5 h-5 text-yellow-500" /></div>
                          <div className="p-2 bg-pink-500/20 border border-pink-500/40 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.2)]"><Medal className="w-5 h-5 text-pink-500" /></div>
                       </div>
                    </div>
                    <div className="bg-[#0b1120]/90 border border-white/10 rounded-[2rem] p-8 text-white text-center shadow-xl backdrop-blur-md group relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
                       <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 mb-3">PODER_DE_CÓDIGO_SYST</p>
                       <p className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 group-hover:scale-110 transition-transform">LVL 24</p>
                       <div className="mt-4 flex items-center justify-center gap-1.5 opacity-50">
                          <Terminal className="w-3 h-3 text-pink-500" />
                          <span className="text-[8px] font-mono tracking-widest uppercase">Kernel_Optimized</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="md:col-span-3 bg-[#0b1120]/80 border border-white/10 rounded-[3rem] p-6 md:p-14 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 p-20 opacity-5 -rotate-12 translate-x-10 translate-y-10 group-hover:rotate-0 transition-transform duration-1000"><Cpu className="w-64 h-64 text-white" /></div>
                    
                    <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-white mb-12 flex items-center gap-5 uppercase italic leading-none">
                       <div className="p-3.5 bg-pink-500/10 border border-pink-500/30 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.15)] group-hover:bg-pink-500 group-hover:text-white transition-all">
                        <Sparkles className="text-pink-500 group-hover:text-white w-7 h-7" />
                       </div> 
                       ADITAMENTOS_MALETIN
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-7 relative z-10">
                       {[
                          { name: 'Super Código', icon: Cpu, unlocked: true, color: 'text-orange-400', b: 'border-orange-500/20 bg-orange-500/5' },
                          { name: 'Gorro Master', icon: GraduationCap, unlocked: true, color: 'text-yellow-400', b: 'border-yellow-500/20 bg-yellow-500/5' },
                          { name: 'Mira Láser', icon: Target, unlocked: false, color: 'text-rose-400', b: 'border-rose-500/20' },
                          { name: 'Botas Cohete', icon: Rocket, unlocked: false, color: 'text-emerald-400', b: 'border-emerald-500/20' },
                          { name: 'Escudo Kernel', icon: ShieldCheck, unlocked: false, color: 'text-cyan-400', b: 'border-cyan-500/20' },
                          { name: 'Vibración Bug', icon: Zap, unlocked: false, color: 'text-amber-400', b: 'border-amber-500/20' },
                          { name: 'Libro Antiguo', icon: BookOpen, unlocked: false, color: 'text-indigo-400', b: 'border-indigo-500/20' },
                          { name: 'Corazón Dev', icon: Heart, unlocked: false, color: 'text-pink-400', b: 'border-pink-500/20' },
                       ].map((item, i) => (
                          <div key={i} className={`aspect-square rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center justify-center p-6 group relative overflow-hidden ${item.unlocked ? `${item.b} hover:border-white/40 hover:-translate-y-2` : 'bg-white/0 border-dashed border-white/5 opacity-20'}`}>
                             {item.unlocked && <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                             <item.icon className={`w-10 h-10 mb-4 transition-all duration-500 ${item.unlocked ? `${item.color} group-hover:scale-125 group-hover:rotate-6` : 'text-slate-600'}`} />
                             <span className={`text-[9px] font-black uppercase text-center tracking-widest ${item.unlocked ? 'text-slate-300' : 'text-slate-700'}`}>{item.name}</span>
                             {item.unlocked && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/10 rounded-full" />}
                          </div>
                       ))}
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
