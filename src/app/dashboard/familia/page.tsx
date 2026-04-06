'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Heart, Star, Flame, Shield, Award, Calendar,
  TrendingUp, Clock, CheckCircle2, BookOpen, Code2, 
  ChevronRight, ExternalLink, ShieldCheck, BarChart3,
  Users, Activity, Terminal, ArrowLeft, Sparkles, Bell
} from 'lucide-react'
import { useProfileStore } from '@/store/useProfileStore'
import Footer from '@/components/Footer'
import StreakTracker from '@/components/StreakTracker'

export default function FamiliaDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'projects' | 'alerts'>('overview')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isAdmin = activeProfile?.includes('Simulado') || activeProfile === 'Administrador'

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (!isMounted) return null

  // Mock child data
  const child = {
    name: 'Santiago Mendoza',
    level: 'Colegio',
    xp: 4200,
    rank: 8,
    streak: 7,
    completedModules: 6,
    totalModules: 12,
    weeklyHours: 8.5,
    lastActive: '2h ago',
    projectsCount: 4,
    certificatesCount: 2,
  }

  const weeklyActivity = [
    { day: 'Lun', hours: 1.5, active: true },
    { day: 'Mar', hours: 2.0, active: true },
    { day: 'Mié', hours: 0, active: false },
    { day: 'Jue', hours: 1.0, active: true },
    { day: 'Vie', hours: 2.5, active: true },
    { day: 'Sáb', hours: 1.5, active: true },
    { day: 'Dom', hours: 0, active: false },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono selection:bg-pink-500/30 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-pink-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/50 p-2 rounded-xl text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.2)] group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase italic leading-none">
                FAMILY<span className="text-pink-500">HUB</span>_
              </span>
              <span className="text-[8px] font-bold text-pink-500/60 tracking-[0.3em] uppercase">Parent_Dashboard_v1</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { id: 'overview', label: 'Resumen', icon: BarChart3 },
              { id: 'progress', label: 'Progreso', icon: TrendingUp },
              { id: 'projects', label: 'Proyectos', icon: Code2 },
              { id: 'alerts', label: 'Alertas', icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${
                  activeTab === tab.id
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]'
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
          {isAdmin && (
            <button onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 md:px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">NOC</span>
            </button>
          )}
          <button onClick={handleLogout} disabled={loading}
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 md:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* Mobile Tabs */}
      <div className="lg:hidden flex justify-around bg-[#0f172a]/95 border-b border-white/5 p-2 sticky top-[65px] z-40 backdrop-blur-md">
        {[
          { id: 'overview', icon: BarChart3 },
          { id: 'progress', icon: TrendingUp },
          { id: 'projects', icon: Code2 },
          { id: 'alerts', icon: Bell },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={`p-3 rounded-lg ${activeTab === tab.id ? 'bg-pink-500/10 text-pink-400' : 'text-slate-500'}`}>
            <tab.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8 relative z-10">
        
        {/* ═══ OVERVIEW ═══ */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            {/* Welcome */}
            <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 blur-[80px] rounded-full -translate-y-10 translate-x-10" />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-400">
                    <Heart className="w-3 h-3" /> FAMILY_DASHBOARD
                  </span>
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> CHILD_ACTIVE
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9] mb-4">
                  EL PROGRESO DE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">{child.name}_</span>
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                  Tu hijo lleva una racha de <span className="text-pink-400 font-black">{child.streak} días</span> programando. 
                  Ha completado <span className="text-emerald-400 font-black">{child.completedModules}/{child.totalModules}</span> módulos 
                  y está en el <span className="text-amber-400 font-black">Top #{child.rank}</span> de su grupo. 🎉
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Flame, label: 'RACHA', value: `${child.streak}d`, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                { icon: Star, label: 'XP_TOTAL', value: child.xp.toLocaleString(), color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { icon: Shield, label: 'RANKING', value: `#${child.rank}`, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                { icon: Clock, label: 'HORAS_SEM', value: `${child.weeklyHours}h`, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0b1120]/80 border border-white/10 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl group hover:border-pink-500/20 transition-all relative overflow-hidden text-center">
                  <div className={`w-14 h-14 ${s.bg} border ${s.border} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <s.icon className={`w-7 h-7 ${s.color}`} />
                  </div>
                  <p className={`text-3xl font-black ${s.color} italic`}>{s.value}</p>
                  <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Activity + Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity */}
              <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8">ACTIVIDAD_SEMANAL_</h3>
                <div className="grid grid-cols-7 gap-3">
                  {weeklyActivity.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      <div className="w-full aspect-[1/2] bg-[#020617] rounded-xl border border-white/5 relative overflow-hidden">
                        <div 
                          className={`absolute bottom-0 left-0 right-0 rounded-b-xl transition-all duration-1000 ${day.active ? 'bg-gradient-to-t from-pink-500 to-pink-500/40' : 'bg-white/5'}`}
                          style={{ height: `${Math.max(day.hours * 20, 5)}%` }}
                        />
                      </div>
                      <span className="text-[8px] font-black text-slate-600 uppercase">{day.day}</span>
                      <span className="text-[8px] font-mono text-slate-700">{day.hours}h</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest">
                  <span>Total: {child.weeklyHours}h</span>
                  <span>Último: {child.lastActive}</span>
                </div>
              </div>

              {/* Streak Card */}
              <StreakTracker variant="full" accentColor="orange" />
            </div>

            {/* Module Progress */}
            <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">PROGRESO_CURRÍCULO_</h3>
                <span className="text-[10px] font-black text-pink-400 bg-pink-500/10 px-4 py-2 rounded-xl border border-pink-500/20">
                  {Math.round((child.completedModules / child.totalModules) * 100)}% COMPLETO
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: child.totalModules }, (_, i) => {
                  const completed = i < child.completedModules
                  const current = i === child.completedModules
                  return (
                    <div key={i} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                      completed ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' :
                      current ? 'bg-pink-500/10 border-pink-500/30 animate-pulse shadow-[0_0_15px_rgba(236,72,153,0.1)]' :
                      'bg-white/5 border-white/5'
                    }`}>
                      {completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : current ? (
                        <Sparkles className="w-6 h-6 text-pink-400" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-slate-700" />
                      )}
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">M{i + 1}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROGRESS ═══ */}
        {activeTab === 'progress' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 mb-4 w-fit">
                <TrendingUp className="w-3 h-3" /> DETAILED_PROGRESS_REPORT
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                DETALLE DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">PROGRESO_</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { module: 'Introducción a HTML', progress: 100, xp: 500, status: 'completed', date: 'Ene 15' },
                { module: 'CSS & Responsive Design', progress: 100, xp: 600, status: 'completed', date: 'Feb 01' },
                { module: 'JavaScript Fundamentals', progress: 100, xp: 800, status: 'completed', date: 'Feb 15' },
                { module: 'Git & GitHub', progress: 100, xp: 400, status: 'completed', date: 'Feb 28' },
                { module: 'React Basics', progress: 100, xp: 900, status: 'completed', date: 'Mar 10' },
                { module: 'APIs & Fetch', progress: 100, xp: 700, status: 'completed', date: 'Mar 20' },
                { module: 'State Management', progress: 45, xp: 0, status: 'in-progress', date: 'En curso' },
                { module: 'Backend con Node.js', progress: 0, xp: 0, status: 'locked', date: '—' },
                { module: 'Bases de Datos', progress: 0, xp: 0, status: 'locked', date: '—' },
                { module: 'Deployment & DevOps', progress: 0, xp: 0, status: 'locked', date: '—' },
                { module: 'Proyecto Final', progress: 0, xp: 0, status: 'locked', date: '—' },
                { module: 'Certificación Global', progress: 0, xp: 0, status: 'locked', date: '—' },
              ].map((mod, i) => (
                <div key={i} className={`bg-[#0b1120]/80 border rounded-[2rem] p-6 backdrop-blur-xl shadow-2xl flex items-center gap-6 transition-all ${
                  mod.status === 'completed' ? 'border-emerald-500/20 hover:border-emerald-500/40' :
                  mod.status === 'in-progress' ? 'border-pink-500/20 hover:border-pink-500/40' :
                  'border-white/5 opacity-50'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    mod.status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                    mod.status === 'in-progress' ? 'bg-pink-500/10 border border-pink-500/20 animate-pulse' :
                    'bg-white/5 border border-white/10'
                  }`}>
                    {mod.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> :
                     mod.status === 'in-progress' ? <Sparkles className="w-6 h-6 text-pink-400" /> :
                     <BookOpen className="w-6 h-6 text-slate-700" />}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-black text-white uppercase tracking-tighter text-sm mb-2">{mod.module}</p>
                    <div className="h-2 w-full bg-[#020617] rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <div className={`h-full rounded-full transition-all duration-1000 ${
                        mod.status === 'completed' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                        'bg-gradient-to-r from-pink-600 to-pink-400'
                      }`} style={{ width: `${mod.progress}%` }} />
                    </div>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-sm font-black text-amber-400">{mod.xp > 0 ? `+${mod.xp} XP` : '—'}</p>
                    <p className="text-[8px] text-slate-600 font-mono mt-1">{mod.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        {activeTab === 'projects' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 mb-4 w-fit">
                  <Code2 className="w-3 h-3" /> CHILD_PORTFOLIO
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                  SUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">PROYECTOS_</span>
                </h2>
              </div>
              <button onClick={() => router.push('/portfolio/carlos-mendoza')} className="flex items-center gap-2 bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 border border-pink-500/30 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <ExternalLink className="w-3.5 h-3.5" /> Ver_Portafolio_Público
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'todo-app-react', desc: 'App de tareas con React y Supabase', tech: ['React', 'CSS'], date: 'Mar 10' },
                { name: 'mi-portfolio', desc: 'Portfolio personal con animaciones', tech: ['HTML', 'CSS', 'JS'], date: 'Feb 28' },
                { name: 'weather-api', desc: 'Consulta del clima con APIs', tech: ['JavaScript', 'API'], date: 'Feb 15' },
                { name: 'chat-realtime', desc: 'Chat en tiempo real', tech: ['React', 'Supabase'], date: 'Mar 20' },
              ].map((proj, i) => (
                <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl shadow-2xl hover:border-pink-500/20 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <Code2 className="w-5 h-5 text-pink-400" />
                    <h4 className="font-black text-lg text-white uppercase tracking-tighter group-hover:text-pink-400 transition-colors">{proj.name}</h4>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 font-sans">{proj.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {proj.tech.map((t, j) => (
                      <span key={j} className="text-[8px] font-black px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 uppercase tracking-widest">{t}</span>
                    ))}
                  </div>
                  <span className="text-[8px] text-slate-600 font-mono">{proj.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ALERTS ═══ */}
        {activeTab === 'alerts' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 mb-4 w-fit">
                <Bell className="w-3 h-3" /> NOTIFICATION_CENTER
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                CENTRO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">ALERTAS_</span>
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { type: 'success', icon: CheckCircle2, title: '¡Módulo Completado!', desc: 'Santiago completó "APIs & Fetch" con nota sobresaliente.', time: 'Hace 2h', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
                { type: 'streak', icon: Flame, title: '¡Racha de 7 Días!', desc: 'Santiago ha programado 7 días seguidos. ¡x2 XP activo!', time: 'Hace 5h', color: 'border-orange-500 bg-orange-500/10 text-orange-400' },
                { type: 'award', icon: Award, title: 'Nueva Certificación', desc: 'Certificado "JavaScript Avanzado" emitido y verificable.', time: 'Ayer', color: 'border-purple-500 bg-purple-500/10 text-purple-400' },
                { type: 'mentor', icon: Users, title: 'Sesión de Mentoría', desc: 'Ana García (Universidad) revisó el código de Santiago como mentora.', time: 'Hace 2d', color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400' },
                { type: 'time', icon: Clock, title: 'Reporte Semanal', desc: 'Santiago dedicó 8.5 horas esta semana, un 15% más que la anterior.', time: 'Hace 3d', color: 'border-blue-500 bg-blue-500/10 text-blue-400' },
              ].map((alert, i) => (
                <div key={i} className={`${alert.color} border-l-[6px] rounded-[2rem] p-6 md:p-8 flex items-start gap-6 group hover:translate-x-2 transition-all cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-xl ${alert.color} border flex items-center justify-center flex-shrink-0`}>
                    <alert.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-base text-white uppercase tracking-tighter mb-1">{alert.title}</p>
                    <p className="text-sm text-slate-400 font-sans leading-relaxed">{alert.desc}</p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 whitespace-nowrap mt-1">{alert.time}</span>
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
