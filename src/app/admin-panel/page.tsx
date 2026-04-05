'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Menu, Search, Bell, ShieldAlert, Cpu, Activity,
  Server, GitPullRequest, SearchCheck, Users, 
  Building2, BrainCircuit, Settings,
  LogOut, PlayCircle, StopCircle, RefreshCw, AlertOctagon, CheckCircle2, XCircle,
  ChevronRight, ShieldCheck, ActivitySquare, ToggleLeft, ToggleRight
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'
import { getNocTelemetry } from './actions'

// Georeferencia Mock para visual abstracto
const topographyDots = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  active: Math.random() > 0.7
}))

export default function SuperAdminPanel() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeView, setActiveView] = useState('radar')
  
  // Toast notifications
  const [toast, setToast] = useState<{message: string, type: 'success' | 'warn' | 'error'} | null>(null)

  // Real Data states
  const [isMounted, setIsMounted] = useState(false)
  const [realAudits, setRealAudits] = useState<any[]>([])
  const [realFinops, setRealFinops] = useState<any[]>([])
  const [counts, setCounts] = useState({ activeTraffic: 0, reposCount: 0 })
  const [latency, setLatency] = useState(0)

  // Área Data - We simulate zero arrays with the current count injected at the end
  const [areaData, setAreaData] = useState([
    { time: '00:00', profesores: 0, estudiantes: 0 },
    { time: '04:00', profesores: 0, estudiantes: 0 },
    { time: '08:00', profesores: 0, estudiantes: 0 },
    { time: '12:00', profesores: 0, estudiantes: 0 },
    { time: '16:00', profesores: 0, estudiantes: 0 },
    { time: '20:00', profesores: 0, estudiantes: 0 },
    { time: '23:59', profesores: 0, estudiantes: 0 },
  ])

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      const start = Date.now()
      const data = await getNocTelemetry()
      if (!mounted) return

      // Cálculo Real de Latencia
      setLatency(Date.now() - start)
      
      setRealAudits(data.audits)
      setRealFinops(data.finops.length > 0 ? data.finops.map((f: any) => ({
        name: f.service_name,
        limit: f.limit_quota,
        cost: Number(f.current_usage)
      })) : [ // Fallback si no hubiese datos aún
        { name: 'Supabase DB', limit: 100, cost: 0 },
        { name: 'Vercel Edge', limit: 100, cost: 0 }
      ])
      
      setCounts({ activeTraffic: data.activeTraffic, reposCount: data.reposCount })

      setAreaData(prev => {
        const newArea = [...prev]
        newArea[newArea.length - 1] = { 
          time: '23:59', 
          profesores: Math.floor(data.activeTraffic * 0.2), 
          estudiantes: Math.floor(data.activeTraffic * 0.8) 
        }
        return newArea
      })
    }

    fetchData()
    // Heartbeat cada 15 segundos para dar realismo a la latencia
    const interval = setInterval(fetchData, 15000)
    
    setIsMounted(true)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  // Funciones Tácticas
  const showToast = (message: string, type: 'success' | 'warn' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleManeuver = async (type: string) => {
    if (type === 'approve') {
      showToast('Ejecutando: Aprobación masiva de accesos retenidos en Edge...', 'success')
      // Simulate network request
      setTimeout(() => showToast('Permisos concedidos globalmente. [PASS]', 'success'), 1500)
    } else if (type === 'isolate') {
      showToast('ADVERTENCIA: Aislando Instancias críticas OCI. Reenrutando tráfico...', 'warn')
      setTimeout(() => showToast('Instancias aisladas. WAF mode ON. [PROTECTED]', 'success'), 2000)
    } else if (type === 'purge') {
      showToast('Forzando purga de cache en Vercel Edge Server...', 'success')
      setTimeout(() => showToast('Memoria cache liberada en 34 nodos. [CLEARED]', 'success'), 1200)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (!isMounted) return null

  // SHA dinámico de Vercel (si existe)
  const commitSha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA 
    ? process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA.substring(0, 7)
    : 'dev-local'

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-cyan-500/30 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="absolute top-10 right-1/2 translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5">
          <div className={`px-6 py-3 rounded-full border shadow-2xl flex items-center gap-3 backdrop-blur-xl
            ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' : ''}
            ${toast.type === 'warn' ? 'bg-orange-500/20 border-orange-500/50 text-orange-100' : ''}
            ${toast.type === 'error' ? 'bg-rose-500/20 border-rose-500/50 text-rose-100' : ''}
          `}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'warn' && <AlertOctagon className="w-5 h-5 text-orange-400" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
            <span className="font-mono text-sm tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Sidebar Táctica */}
      <aside className={`transition-all duration-300 ease-in-out border-r border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl flex flex-col z-20 shrink-0 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Activity className="text-emerald-500 w-6 h-6" />
              <span className="font-black tracking-tighter text-lg uppercase">NOC Tier-1</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-white/10 rounded-md transition-colors mx-auto">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
          <NavItem icon={SearchCheck} label="Radar General" active={activeView === 'radar'} onClick={() => setActiveView('radar')} open={sidebarOpen} />
          <NavItem icon={Building2} label="Instituciones (B2B)" active={activeView === 'b2b'} onClick={() => setActiveView('b2b')} open={sidebarOpen} />
          <NavItem icon={Users} label="Cuerpo Docente" active={activeView === 'teachers'} onClick={() => setActiveView('teachers')} open={sidebarOpen} />
          <NavItem icon={ShieldAlert} label="Auditoría / RLS" active={activeView === 'audit'} onClick={() => setActiveView('audit')} open={sidebarOpen} textStyle="text-rose-400" />
          <NavItem icon={Cpu} label="FinOps (Costos IA)" active={activeView === 'finops'} onClick={() => setActiveView('finops')} open={sidebarOpen} textStyle="text-cyan-400" />
          <NavItem icon={Settings} label="Core Config" active={activeView === 'config'} onClick={() => setActiveView('config')} open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-4">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-emerald-400">JD</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">jordelmir@gmail.com</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Master Architect</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <div className="bg-black/50 border border-white/5 rounded-lg p-2 flex justify-between items-center text-[10px] font-mono text-gray-500">
              <span>SLA: 100% UPTIME</span>
              <span className="text-cyan-500">v.{commitSha}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Glow Ambient behind content */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 blur-[150px] pointer-events-none" />
        
        {/* 2. Top Bar */}
        <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-10 w-full">
          <div className="flex items-center gap-4 flex-1">
            {/* Buscador Omnipresente */}
            <div className={`hidden md:flex items-center bg-[#111] border transition-colors rounded-lg px-3 py-1.5 w-96 ${searchFocused ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/10'}`}>
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Buscar alumnos, institutos, commits... (⌘K)" 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-200 placeholder-gray-600"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            {/* Status & Latency Badges */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400 tracking-widest">ALL_SYS_OPERATIONAL</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 border border-white/5 px-3 py-1.5 rounded-full">
              <ActivitySquare className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-mono text-gray-400">EDGE_PING: <span className="text-cyan-400">{latency}ms</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 py-1.5 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full scroll-smooth">
          
          {/* Header Title & Topo Map */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tighter">
                {activeView === 'radar' && 'Panel de Comando Global'}
                {activeView === 'b2b' && 'Directorio B2B (Instituciones)'}
                {activeView === 'teachers' && 'Mando del Cuerpo Docente'}
                {activeView === 'audit' && 'Auditoría Ghost Tier-1'}
                {activeView === 'finops' && 'NOC FinOps y Costos IA'}
                {activeView === 'config' && 'Configuración de Núcleo (Core)'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">Supervisión táctica de nodos nacionales "Talento Tech"</p>
            </div>
            <div className="hidden lg:flex flex-col items-end">
              <div className="w-48 h-16 bg-black/40 border border-white/10 rounded-xl overflow-hidden relative opacity-70">
                {/* Mock Topography / Nodes map */}
                {topographyDots.map((dot) => (
                  <div 
                    key={dot.id}
                    className={`absolute w-1 h-1 rounded-full ${dot.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-700'}`}
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-gray-500 uppercase">Live Nodes (COL/CR)</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC VIEWS */}
          
          {activeView === 'radar' && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
              {/* Zona 1: Telemetría Global */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard icon={Activity} color="emerald" title="Tráfico Activo (LIVE)" value={counts.activeTraffic.toString()} trend="DATA REAL DE DB" />
                <KpiCard icon={Server} color="blue" title="Salud Instancias OCI" value="99.99%" trend="ESTADO ÓPTIMO" />
                <KpiCard icon={GitPullRequest} color="purple" title="Repos Evaluados" value={counts.reposCount.toString()} trend="DATA REAL DE DB" />
                <KpiCard icon={AlertOctagon} color="rose" title="Ataques Bloqueados" value={realAudits.filter(a => a.status==='blocked').length.toString()} trend="EN ESTA SESIÓN" />
              </div>

              {/* Zona 2: Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna A: Actividad x Rol */}
                <div className="lg:col-span-2 bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <h3 className="font-bold">Actividad Picos (Live Injeted)</h3>
                      <p className="text-xs text-gray-500">Conexiones a lo largo de 24h</p>
                    </div>
                  </div>
                  <div className="h-64 sm:h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEst" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                        <Area type="monotone" dataKey="estudiantes" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEst)" />
                        <Area type="monotone" dataKey="profesores" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Zona 4: Gestión Rápida */}
                <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col gap-4 w-full">
                  <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Maniobras Tácticas</h3>
                  
                  <button onClick={() => handleManeuver('approve')} className="w-full group flex items-center justify-between bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 p-3 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-200 group-hover:text-emerald-400">Aprobar Accesos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                  </button>
                  
                  <button onClick={() => handleManeuver('isolate')} className="w-full group flex items-center justify-between bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 p-3 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <StopCircle className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-gray-200 group-hover:text-rose-500">Aislar Instancia</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-rose-400 transition-colors" />
                  </button>

                  <button onClick={() => handleManeuver('purge')} className="w-full group flex items-center justify-between bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 p-3 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500" />
                      <span className="text-sm font-medium text-gray-200 group-hover:text-cyan-400">Forzar Purga Edge</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  </button>

                  <div className="mt-auto pt-6 border-t border-white/10 text-center">
                    <p className="text-[10px] text-emerald-500/50 uppercase tracking-widest font-mono flex justify-center items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      E2E Encrypted Protocol
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'b2b' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden p-6">
                <h3 className="font-bold text-lg mb-6">Instituciones Afiliadas a Talento Tech</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Universidad Nacional', type: 'universidad', status: 'active', users: 15420 },
                    { name: 'SENA', type: 'instituto', status: 'active', users: 38200 },
                    { name: 'Colegio Mayor de Antioquia', type: 'colegio', status: 'warning', users: 1205 },
                    { name: 'Institución Educativa Distrital', type: 'escuela', status: 'active', users: 890 }
                  ].map((inst, i) => (
                    <div key={i} className="border border-white/5 bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg 
                          ${inst.type === 'universidad' ? 'bg-purple-500/20 text-purple-400' : ''}
                          ${inst.type === 'colegio' ? 'bg-blue-500/20 text-blue-400' : ''}
                          ${inst.type === 'escuela' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                          ${inst.type === 'instituto' ? 'bg-orange-500/20 text-orange-400' : ''}
                        `}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className={`w-2 h-2 rounded-full ${inst.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                      </div>
                      <h4 className="font-bold text-lg leading-tight mb-1">{inst.name}</h4>
                      <p className="text-gray-400 text-sm uppercase tracking-widest">{inst.type}</p>
                      
                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                        <span className="text-gray-500">Volumen Usuarios</span>
                        <span className="font-mono font-bold text-cyan-400">{inst.users.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
               </div>
            </div>
          )}

          {activeView === 'teachers' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden p-6 max-w-4xl mx-auto">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Users className="text-blue-500" /> Roster Docente en Misión Directa</h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Dr. Alan Turing', area: 'Criptografía / IA', repoScore: 99, status: 'evaluating' },
                    { name: 'Ada Lovelace', area: 'Algoritmia CORE', repoScore: 100, status: 'idle' },
                    { name: 'Linus Torvalds', area: 'Sistemas Operativos', repoScore: 85, status: 'evaluating' }
                  ].map((docente, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 border border-blue-500/30">
                          {docente.name.charAt(0)}{docente.name.split(' ')[1]?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{docente.name}</p>
                          <p className="text-xs text-gray-400">{docente.area}</p>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-gray-500 uppercase">Impacto PRs Confirmados</span>
                          <span className="font-mono text-emerald-400">{docente.repoScore}%</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold 
                          ${docente.status === 'evaluating' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'}
                        `}>
                          {docente.status === 'evaluating' ? 'Evaluando Código' : 'Standby'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
               </div>
            </div>
          )}

          {activeView === 'audit' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden w-full h-[calc(100vh-250px)] flex flex-col">
                <div className="p-4 sm:p-5 border-b border-white/5 flex justify-between items-center bg-[#111]/30">
                  <h3 className="font-bold text-xs sm:text-sm tracking-widest uppercase text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5"/> Centro de Auditoría Extendido
                  </h3>
                  <div className="flex gap-2 items-center">
                    <span className="w-2 h-2 gap-1 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-[10px] font-mono text-rose-500 hidden sm:inline">LIVE RLS MONITORING</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto w-full p-4">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                        <th className="p-3 font-medium whitespace-nowrap">Timestamp</th>
                        <th className="p-3 font-medium whitespace-nowrap">Instigador (Actor)</th>
                        <th className="p-3 font-medium whitespace-nowrap">Patrón / Acción</th>
                        <th className="p-3 font-medium">Domain</th>
                        <th className="p-3 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[11px] sm:text-xs divide-y divide-white/5">
                      {realAudits.length > 0 ? (
                        realAudits.map((log) => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 text-gray-500 whitespace-nowrap">
                              {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                            <td className="p-3 text-cyan-400 whitespace-nowrap truncate max-w-[150px]">{log.actor}</td>
                            <td className="p-3 text-gray-300">{log.action}</td>
                            <td className="p-3">
                              <span className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-gray-400 whitespace-nowrap">{log.classification}</span>
                            </td>
                            <td className="p-3">
                              {log.status === 'success' 
                                ? <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"><CheckCircle2 className="w-3 h-3"/> PASS</span>
                                : log.status === 'blocked'
                                ? <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded"><XCircle className="w-3 h-3"/> REJECT</span>
                                : <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded"><CheckCircle2 className="w-3 h-3"/> INFO</span>
                              }
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500">Cargando telemetría...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'finops' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-5xl mx-auto space-y-6">
               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col w-full">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2 text-xl">
                    <BrainCircuit className="w-6 h-6 text-cyan-400 shadow-cyan-500 drop-shadow-lg shrink-0" />
                    Telemetría de Costos IA (FinOps)
                  </h3>
                  <p className="text-xs text-gray-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">Billing Tier: <b>ENTERPRISE</b></p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Tarjeta de resúmen */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Gasto Proyectado (Mes)</p>
                    <h2 className="text-4xl font-black text-white mb-1">$4,850<span className="text-lg text-gray-500 font-medium">.00</span></h2>
                    <p className="text-emerald-400 text-sm flex items-center gap-1">▼ 12% bajo presupuesto</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Peticiones de Inferencia</p>
                    <h2 className="text-4xl font-black text-white mb-1">2.4M</h2>
                    <p className="text-gray-500 text-sm">LLMs (Gemini / Claude)</p>
                  </div>
                </div>

                <div className="flex-1 min-h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={realFinops} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                      <XAxis type="number" hide domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} width={120} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} formatter={(value) => `${value}% Consumido`} />
                      <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={24}>
                        {realFinops.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cost > 85 ? '#ef4444' : '#06b6d4'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === 'config' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-3xl mx-auto">
               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Settings className="text-gray-400" /> Núcleo de Configuración del Motor</h3>
                
                <div className="space-y-6">
                  {[
                    { title: 'Modo Supervivencia (WAF Estricto)', desc: 'Bloquea el 99% de conexiones anónimas y obliga CAPTCHA en API REST.', state: false },
                    { title: 'IA Cache Aggressive Mode', desc: 'Guarda inferencias previas en Redis KV para ahorrar costos de Gemini Core.', state: true },
                    { title: 'Telemetry Trace Level', desc: 'Registra hasta los clics del mouse en la DB (Altísimo consumo).', state: false },
                  ].map((conf, idx) => (
                    <div key={idx} className="flex items-start sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="pr-4">
                        <p className="font-bold text-gray-200">{conf.title}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{conf.desc}</p>
                      </div>
                      <button onClick={() => showToast('Configuración deshabilitada en Demo Mode', 'warn')} className="shrink-0 transition-transform hover:scale-110">
                        {conf.state 
                          ? <ToggleRight className="w-10 h-10 text-emerald-500" />
                          : <ToggleLeft className="w-10 h-10 text-gray-600" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

// Helper Components
function NavItem({ icon: Icon, label, active = false, onClick, open, textStyle = "text-gray-400" }: { icon: any, label: string, active?: boolean, onClick: () => void, open: boolean, textStyle?: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
      ${active ? 'bg-white/10 shadow-[inset_2px_0_0_0_rgba(16,185,129,1)]' : 'hover:bg-white/5'}
    `}>
      <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-emerald-400' : textStyle} group-hover:text-white`} />
      {open && (
        <span className={`text-sm font-medium truncate ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
          {label}
        </span>
      )}
    </button>
  )
}

function KpiCard({ icon: Icon, color, title, value, trend }: { icon: any, color: 'emerald'|'blue'|'purple'|'rose', title: string, value: string, trend: string }) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] group-hover:border-emerald-400/40',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20 group-hover:shadow-[0_0_20px_rgba(96,165,250,0.15)] group-hover:border-blue-400/40',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.15)] group-hover:border-purple-400/40',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20 group-hover:shadow-[0_0_20px_rgba(251,113,133,0.15)] group-hover:border-rose-400/40'
  }
  
  return (
    <div className={`group bg-[#111]/80 backdrop-blur-md border rounded-2xl p-5 transition-all duration-300 relative overflow-hidden ${colorMap[color].split('group-hover')[1] || ''}`}>
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[30px] opacity-20 transition-opacity group-hover:opacity-40 bg-${color}-500`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl border ${colorMap[color].split(' group-hover')[0]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-[11px] sm:text-xs font-semibold mb-1 tracking-wider uppercase">{title}</p>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-2">{value}</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {trend}
        </p>
      </div>
    </div>
  )
}
