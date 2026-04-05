'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Code2, GitMerge, GitPullRequest, 
  TerminalSquare, BookMarked, Medal, ArrowRight,
  Zap, Trophy, LayoutDashboard, ShieldCheck, 
  Loader2, Activity, Search, BrainCircuit, Fingerprint
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
  
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'ranking'>('overview')
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-300">
      
      {/* Navbar Colegio Premium */}
      <nav className="bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="bg-purple-600 p-2 rounded-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                <Trophy className="w-5 h-5" />
             </div>
             <span className="font-black text-2xl tracking-tighter text-white">
                TALENTO<span className="text-purple-500">TECH</span>
             </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'missions', label: 'Retos Activos', icon: Zap },
              { id: 'ranking', label: 'Hall of Fame', icon: Trophy },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-purple-500/50' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              <ShieldCheck className="w-4 h-4" />
              NOC
            </button>
          )}

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 bg-[#0A0A0A]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap className="w-32 h-32 text-purple-500" /></div>
                  <h2 className="text-4xl font-black tracking-tighter mb-2 text-white">¡Hola de nuevo, {userName}!</h2>
                  <p className="text-gray-400 max-w-md">Tienes <span className="text-purple-400 font-bold">3 retos pendientes</span> para completar el nivel Bronce. Tu racha de 5 días sigue activa. 🔥</p>
                  
                  <div className="mt-10 flex gap-4">
                     <button onClick={() => setActiveTab('missions')} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-purple-600/20 transition-all border border-purple-400/30">Lanzar Próximo Reto</button>
                     <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border border-white/10">Ver Inventario</button>
                  </div>
               </div>

               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between text-white shadow-2xl">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Tu Rango Actual</p>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                          <Trophy className="w-8 h-8 text-white" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black tracking-tighter">GOLD TIER</h3>
                          <p className="text-xs text-gray-500 font-mono tracking-widest">TOP_NODES: #12 / 500</p>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-gray-400">Progreso a Platino</span>
                        <span className="text-purple-400">850 / 1000 XP</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500" style={{ width: '85%' }} />
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0A0A0A]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black tracking-tighter text-white">Actividad de Desarrollo</h3>
                      <div className="flex gap-2 text-[10px] items-center">
                         <span className="w-2 h-2 rounded-full bg-purple-500" />
                         <span className="text-gray-500 font-bold uppercase tracking-widest">Commits Semanales</span>
                      </div>
                   </div>
                   <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={mockCommits}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12, fontWeight: 900 }} />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: 'rgba(168,85,247,0.1)' }} contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} />
                            <Bar dataKey="commits" radius={[8, 8, 0, 0]}>
                               {mockCommits.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 5 ? '#a855f7' : '#27272a'} />
                               ))}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl text-white shadow-2xl">
                      <h4 className="font-black text-sm uppercase tracking-[0.2em] text-gray-500 mb-6">Comunidad Live</h4>
                      <div className="space-y-4">
                         {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3 group cursor-pointer">
                               <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-all overflow-hidden text-white flex items-center justify-center font-black text-[10px]">
                                  {i}U
                               </div>
                               <div>
                                  <p className="text-xs font-black text-white group-hover:text-purple-400 transition-colors">GhostUser_{i*432}</p>
                                  <p className="text-[10px] text-gray-600 font-black uppercase">Completó Reto React V2</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>

                   <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all group relative overflow-hidden shadow-2xl shadow-purple-500/20">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                      <BrainCircuit className="w-10 h-10 group-hover:scale-125 transition-transform" />
                      <div>
                        <p className="font-black text-2xl tracking-tighter">SALA DE PARES</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">5 compañeros online</p>
                      </div>
                   </button>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 text-white">
            <div className="flex justify-between items-end">
               <h2 className="text-4xl font-black tracking-tighter">Retos del Módulo 04</h2>
               <div className="flex gap-2">
                  <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500">Frontend Masters</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { title: 'Dominando Flexbox', xp: '250 XP', diff: 'EASY', color: 'emerald' },
                 { title: 'The Grid Protocol', xp: '450 XP', diff: 'MEDIUM', color: 'purple' },
                 { title: 'Animations Tier-1', xp: '800 XP', diff: 'HARD', color: 'rose' },
                 { title: 'API Integration', xp: '500 XP', diff: 'MEDIUM', color: 'blue' },
                 { title: 'State Warriors', xp: '1000 XP', diff: 'GOD', color: 'fuchsia' },
                 { title: 'Deployment Edge', xp: '300 XP', diff: 'EASY', color: 'emerald' },
               ].map((mission, i) => (
                 <div key={i} className="bg-[#0A0A0A]/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-white/20 transition-all group relative shadow-2xl">
                    <div className="flex justify-between items-start mb-10">
                       <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border border-slate-700 bg-white/5 text-slate-400`}>
                          RET_LVL: {mission.diff}
                       </div>
                       <span className="font-mono text-[10px] text-gray-600">ID_MISSION_{i+100}</span>
                    </div>
                    <h4 className="text-xl font-black mb-1 group-hover:text-purple-400 transition-colors uppercase">{mission.title}</h4>
                    <p className="text-xs text-gray-500 font-bold mb-8">Recompensa: <span className="text-white font-black">{mission.xp}</span></p>
                    
                    <button className="w-full py-4 rounded-2xl bg-white/5 group-hover:bg-purple-600 text-[10px] font-black uppercase tracking-[0.2em] transition-all group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                       Iniciar Protocolo
                    </button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-10 text-white">
             <div className="text-center mb-16">
                <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-6xl font-black tracking-tighter uppercase italic">Hall of Fame</h2>
                <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Los mejores 10 del cohorte actual</p>
             </div>
             
             <div className="space-y-4">
                {[1,2,3,4,5].map(rank => (
                   <div key={rank} className={`flex items-center justify-between p-6 rounded-3xl backdrop-blur-xl border transition-all ${rank === 1 ? 'bg-amber-500/10 border-amber-500/30 scale-105' : 'bg-[#0A0A0A]/60 border-white/10 shadow-2xl'}`}>
                      <div className="flex items-center gap-6">
                         <span className={`text-4xl font-black italic ${rank === 1 ? 'text-amber-500' : 'text-gray-700'}`}>0{rank}</span>
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 overflow-hidden border border-white/10 flex items-center justify-center font-black">
                               {rank}U
                            </div>
                            <div>
                               <p className="font-black text-xl tracking-tighter uppercase">Alumno_Promesa_{rank*7}</p>
                               <p className="text-[10px] font-mono text-gray-600 uppercase">COLOMBIA_REG_NODE</p>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black tracking-tighter text-purple-400">{2000 - rank*150} XP</p>
                         <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Sincronizado</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}
      </main>
      <Footer variant="dashboard" />
    </div>
  )
}
