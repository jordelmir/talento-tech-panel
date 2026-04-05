'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Star, Trophy, Target, Gamepad2, 
  Map, Sparkles, BookOpen, GraduationCap,
  Search, Cpu, Rocket, ShieldCheck, Loader2,
  Heart, Zap, Crown, User, Medal
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts'
import { useProfileStore } from '@/store/useProfileStore'
import Footer from '@/components/Footer'
import { getUserMetrics } from '../actions'

const mockMissions = [
  { name: 'Algoritmos Básicos', pts: 120 },
  { name: 'Lógica Visual', pts: 80 },
  { name: 'Ciber-Seguridad Kids', pts: 200 },
  { name: 'Pensamiento Crítico', pts: 150 },
]

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-300">
      
      {/* Navbar Escolar Premium */}
      <nav className="bg-white/80 backdrop-blur-2xl border-b-4 border-orange-500/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('mission_control')}>
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-3 rounded-2xl text-white shadow-xl shadow-orange-500/20 group-hover:rotate-12 transition-transform">
              <Rocket className="w-6 h-6" />
            </div>
            <span className="font-black text-3xl tracking-tighter text-slate-900 hidden sm:inline uppercase italic">
              TALENTO<span className="text-orange-500">KIDS</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1.5 rounded-[2rem] border-2 border-slate-200 shadow-inner">
            {[
              { id: 'mission_control', label: 'Misiones', icon: Gamepad2, color: 'text-orange-500', bg: 'hover:bg-orange-50' },
              { id: 'awards', label: 'Premios', icon: Trophy, color: 'text-yellow-500', bg: 'hover:bg-yellow-50' },
              { id: 'gear', label: 'Mi Equipo', icon: Sparkles, color: 'text-purple-500', bg: 'hover:bg-purple-50' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all uppercase tracking-tighter ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-[0_8px_0_#e2e8f0] translate-y-[-4px] border-2 border-slate-200' 
                    : `text-slate-400 ${tab.bg} opacity-70`
                }`}
              >
                <tab.icon className={`w-5 h-5 ${tab.color}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_#059669] active:translate-y-[2px] active:shadow-none transition-all">
              <ShieldCheck className="w-4 h-4" />
              NOC
            </button>
          )}

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-600 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        
        {activeTab === 'mission_control' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
                     <div>
                        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">Nivel Actual: EXPLORADOR</div>
                        <h2 className="text-5xl font-black tracking-tighter mb-4 leading-none">¡Esa es la actitud, <br />{playerName}! 🌩️</h2>
                        <p className="text-white/80 font-bold max-w-sm mb-10">Has completado el <span className="text-yellow-300">85% de tus misiones</span> semanales. ¡Falta muy poco para el cofre legendario!</p>
                        
                        <div className="flex gap-4">
                           <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_8px_0_#cbd5e1] hover:translate-y-1 hover:shadow-[0_4px_0_#cbd5e1] transition-all">Continuar Aventura</button>
                           <button className="bg-indigo-700/50 hover:bg-indigo-700/70 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">Ver Mapa</button>
                        </div>
                     </div>
                     
                     <div className="p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] flex flex-col items-center shadow-2xl text-center min-w-[180px]">
                        <Star className="w-12 h-12 text-yellow-300 fill-yellow-300 mb-2 filter drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
                        <span className="text-5xl font-black">{dataLoading ? '...' : submissions.length * 100}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">PUNTOS_XP</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white border-4 border-slate-100 rounded-[3rem] p-8 shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-slate-800 mb-2">Compañeros</h3>
                    <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">En línea ahora</p>
                    
                    <div className="space-y-4">
                       {[1,2,3].map(i => (
                          <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all cursor-pointer group">
                             <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">U{i}</div>
                             <div>
                                <p className="font-black text-slate-800 group-hover:text-orange-500 transition-colors">HeroUser_{i*12}</p>
                                <p className="text-[10px] font-bold text-slate-400">Nivel {rankings[i-1]?.pts || 5} • Online</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                  
                  <button className="mt-8 w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_6px_0_#c2410c] hover:translate-y-1 hover:shadow-[0_2px_0_#c2410c] transition-all">SALA DE JUEGO 🎮</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white border-4 border-slate-100 rounded-[3rem] p-10 shadow-xl">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-3xl font-black tracking-tighter text-slate-800">Misiones Actuales</h3>
                     <Zap className="text-orange-500 fill-orange-500 w-6 h-6 animate-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                     {[
                        { title: 'Variables Mágicas', color: 'bg-blue-500', icon: Zap, status: '80%' },
                        { title: 'El Gran Bucle', color: 'bg-emerald-500', icon: Rocket, status: '20%' },
                        { title: 'Misterio de CSS', color: 'bg-purple-500', icon: Sparkles, status: '0%' },
                     ].map((m, i) => (
                        <div key={i} className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] group hover:border-indigo-200 transition-all">
                           <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-4">
                                 <div className={`p-4 rounded-2xl text-white ${m.color} shadow-lg shadow-indigo-500/10`}><m.icon className="w-6 h-6" /></div>
                                 <h4 className="font-black text-xl text-slate-800 uppercase tracking-tighter">{m.title}</h4>
                              </div>
                              <span className="font-black text-indigo-600 italic">{m.status}</span>
                           </div>
                           <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div className={`${m.color} h-full`} style={{ width: m.status }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Trophy className="w-40 h-40" /></div>
                  <h3 className="text-3xl font-black tracking-tighter mb-2 italic">Ranking Global</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-12">Top exploradores de hoy</p>
                  
                  <div className="space-y-6">
                    {[
                      { name: 'Player_Ultra', xp: '2,500', medal: '🥇', c: 'text-yellow-400' },
                      { name: 'Gamer_Coder', xp: '2,100', medal: '🥈', c: 'text-slate-300' },
                      { name: 'Web_Hero', xp: '1,850', medal: '🥉', c: 'text-orange-400' },
                    ].map((user, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                           <span className="text-2xl">{user.medal}</span>
                           <p className="font-black text-lg group-hover:text-orange-500 transition-colors uppercase italic">{user.name}</p>
                        </div>
                        <span className={`font-black text-xl ${user.c}`}>{user.xp} XP</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="mt-12 w-full py-4 text-white/50 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">Ver Tabla Completa</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'awards' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
             <div className="text-center max-w-2xl mx-auto">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Muro de Campeones</h2>
                <p className="text-slate-500 font-bold text-lg">Cada misión que terminas te da una medalla dorada única.</p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 focus:outline-none">
                {submissions.map((sub, i) => (
                  <div key={i} className="bg-white border-4 border-slate-100 rounded-[2.5rem] p-8 flex flex-col items-center text-center group hover:scale-110 transition-all hover:border-yellow-400 shadow-xl cursor-default relative">
                     <div className="absolute top-4 right-4"><Sparkles className="w-4 h-4 text-orange-400 hidden group-hover:block animate-pulse" /></div>
                     <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-xl shadow-orange-500/20 flex items-center justify-center mb-6 text-white group-hover:rotate-12 transition-transform">
                        <Star className="w-10 h-10 fill-white" />
                     </div>
                     <h4 className="font-black text-slate-800 uppercase text-[10px] tracking-tighter truncate w-full mb-2">{sub.repository_url.split('/').pop()}</h4>
                     <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[8px] font-black uppercase tracking-widest">LEGENDARIO</div>
                  </div>
                ))}
                
                {Array.from({ length: 6 - (submissions.length % 6) }).map((_, i) => (
                  <div key={i} className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center opacity-30">
                     <Zap className="w-12 h-12 text-slate-300" />
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'gear' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <div className="md:col-span-1 space-y-4">
                    <div className="aspect-square bg-slate-100 rounded-[3rem] border-4 border-slate-200 flex flex-col items-center justify-center p-8 group relative overflow-hidden shadow-2xl">
                       <User className="w-24 h-24 text-slate-400 group-hover:scale-110 transition-transform" />
                       <div className="absolute bottom-6 flex gap-2">
                          <Crown className="w-6 h-6 text-yellow-500" />
                          <Medal className="w-6 h-6 text-indigo-500" />
                       </div>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-6 text-white text-center">
                       <p className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-2">Poder Total</p>
                       <p className="text-4xl font-black italic tracking-tighter">LVL 24</p>
                    </div>
                 </div>
                 
                 <div className="md:col-span-3 bg-white border-4 border-slate-100 rounded-[4rem] p-12 shadow-xl">
                    <h3 className="text-3xl font-black tracking-tighter text-slate-800 mb-10 flex items-center gap-4">
                       <Sparkles className="text-purple-500" /> Maletín de Poderes
                    </h3>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                       {[
                          { name: 'Super Código', icon: Cpu, unlocked: true },
                          { name: 'Gorro Master', icon: GraduationCap, unlocked: true },
                          { name: 'Mira Láser', icon: Target, unlocked: false },
                          { name: 'Botas Cohete', icon: Rocket, unlocked: false },
                          { name: 'Escudo Kernel', icon: ShieldCheck, unlocked: false },
                          { name: 'Vibración Bug', icon: Zap, unlocked: false },
                          { name: 'Libro Antiguo', icon: BookOpen, unlocked: false },
                          { name: 'Corazón Dev', icon: Heart, unlocked: false },
                       ].map((item, i) => (
                          <div key={i} className={`aspect-square rounded-3xl border-4 flex flex-col items-center justify-center p-6 group transition-all cursor-pointer ${item.unlocked ? 'bg-indigo-50 border-indigo-200 hover:border-indigo-400' : 'bg-slate-50 border-dashed border-slate-200 opacity-40'}`}>
                             <item.icon className={`w-10 h-10 mb-4 ${item.unlocked ? 'text-indigo-600 group-hover:scale-125 transition-transform' : 'text-slate-300'}`} />
                             <span className={`text-[10px] font-black uppercase text-center ${item.unlocked ? 'text-indigo-600' : 'text-slate-400'}`}>{item.name}</span>
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
