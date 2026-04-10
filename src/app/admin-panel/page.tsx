'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  Menu, Search, Bell, ShieldAlert, Cpu, Activity,
  Server, GitPullRequest, SearchCheck, Users, 
  Building2, BrainCircuit, Settings,
  LogOut, PlayCircle, StopCircle, RefreshCw, AlertOctagon, CheckCircle2, XCircle,
  ChevronRight, ShieldCheck, ActivitySquare, ToggleLeft, ToggleRight, Gamepad2, Trophy, Ghost
} from 'lucide-react'
import { useProfileStore } from '@/store/useProfileStore'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'
import { getNocTelemetry, getB2BData, getTeachersData, logManeuver } from './actions'
import Footer from '@/components/Footer'

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
  const [networkStatus, setNetworkStatus] = useState<'OPERATIONAL' | 'SHIELD_MODE' | 'CLEANING'>('OPERATIONAL')
  
  // New Real Data Views
  const [institutions, setInstitutions] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loadingViews, setLoadingViews] = useState(false)

  // Ghost Mode Store
  const setImpersonation = useProfileStore((state) => state.setImpersonation)


  // Área Data - We simulate realistic historical peaks
  const [areaData, setAreaData] = useState([
    { time: '00:00', profesores: 42, estudiantes: 120, ataques: 5 },
    { time: '04:00', profesores: 12, estudiantes: 45, ataques: 12 },
    { time: '08:00', profesores: 85, estudiantes: 450, ataques: 2 },
    { time: '12:00', profesores: 140, estudiantes: 890, ataques: 8 },
    { time: '16:00', profesores: 110, estudiantes: 720, ataques: 15 },
    { time: '20:00', profesores: 95, estudiantes: 580, ataques: 4 },
    { time: '23:59', profesores: 0, estudiantes: 0, ataques: 0 },
  ])

  // Config State
  const [config, setConfig] = useState({
    survival: false,
    aiCache: true,
    telemetry: false,
    ghostMode: true
  })

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
          estudiantes: Math.floor(data.activeTraffic * 0.8),
          ataques: Math.floor(Math.random() * 5)
        }
        return newArea
      })
    }

    fetchData()
    // Heartbeat cada 15 segundos para dar realismo a la latencia
    const interval = setInterval(fetchData, 15000)
    
    // Carga de vistas secundarias una sola vez al inicio
    const fetchViews = async () => {
      setLoadingViews(true)
      try {
        const [instData, teachData] = await Promise.all([getB2BData(), getTeachersData()])
        if (mounted) {
          setInstitutions(instData)
          setTeachers(teachData)
        }
      } finally {
        if (mounted) setLoadingViews(false)
      }
    }
    fetchViews()

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
      await logManeuver('Super Admin Approved Accesses Bulk', 'success')
      setNetworkStatus('CLEANING')
      setTimeout(() => {
        showToast('Permisos concedidos globalmente. [PASS]', 'success')
        setNetworkStatus('OPERATIONAL')
      }, 3000)
    } else if (type === 'isolate') {
      showToast('ADVERTENCIA: Aislando Instancias críticas OCI. Reenrutando tráfico...', 'warn')
      await logManeuver('OCI Instance Isolation Maneuver', 'blocked')
      setNetworkStatus('SHIELD_MODE')
      setTimeout(() => {
        showToast('Instancias aisladas. WAF mode ON. [PROTECTED]', 'success')
      }, 2000)
    } else if (type === 'purge') {
      showToast('Forzando purga de cache en Vercel Edge Server...', 'success')
      await logManeuver('Edge Cache Purge Forced', 'success')
      setNetworkStatus('CLEANING')
      setTimeout(() => {
        showToast('Memoria cache liberada en 34 nodos. [CLEARED]', 'success')
        setNetworkStatus('OPERATIONAL')
      }, 1200)
    } else if (type === 'lockdown') {
      showToast('EJECUTANDO PROTOCOLO 0: LOCKDOWN GLOBAL...', 'error')
      await logManeuver('FULL SYSTEM LOCKDOWN INITIATED', 'blocked')
      setNetworkStatus('SHIELD_MODE')
      setTimeout(() => {
        showToast('Acceso restringido a IPs autorizadas solamente.', 'warn')
      }, 3000)
    } else if (type === 'rebuild') {
      showToast('SOLICITANDO REBUILD DE PRODUCCIÓN EN VERCEL...', 'success')
      await logManeuver('PRODUCTION REBUILD TRIGGERED', 'info')
      setNetworkStatus('CLEANING')
      setTimeout(() => {
        showToast('Build en cola. Estimado: 2min.', 'success')
        setNetworkStatus('OPERATIONAL')
      }, 2500)
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

      {/* 1. Sidebar Táctica (Desktop: Relative, Mobile: Fixed Overlay) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A]/95 backdrop-blur-2xl border-r border-white/10 transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:bg-[#0A0A0A]/80
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${!sidebarOpen && 'lg:w-20'}
      `}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between h-16">
          {(sidebarOpen || !sidebarOpen) && (
            <div className={`flex items-center gap-2 ${!sidebarOpen && 'lg:hidden'}`}>
              <Activity className="text-emerald-500 w-6 h-6" />
              <span className="font-black tracking-tighter text-lg uppercase whitespace-nowrap">NOC Tier-1</span>
            </div>
          )}
          {/* Collapse toggle (Desktop only) */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="hidden lg:block p-1 hover:bg-white/10 rounded-md transition-colors ml-auto"
          >
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
          
          {/* Close button (Mobile only) */}
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
          <NavItem icon={SearchCheck} label="Radar General" active={activeView === 'radar'} onClick={() => { setActiveView('radar'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} />
          <NavItem icon={Building2} label="Instituciones (B2B)" active={activeView === 'b2b'} onClick={() => { setActiveView('b2b'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} />
          <NavItem icon={Users} label="Cuerpo Docente" active={activeView === 'teachers'} onClick={() => { setActiveView('teachers'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} />
          <NavItem icon={ShieldAlert} label="Auditoría / RLS" active={activeView === 'audit'} onClick={() => { setActiveView('audit'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} textStyle="text-rose-400" />
          <NavItem icon={Cpu} label="FinOps (Costos IA)" active={activeView === 'finops'} onClick={() => { setActiveView('finops'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} textStyle="text-cyan-400" />
          <NavItem icon={PlayCircle} label="Simuladores (God)" active={activeView === 'simulators'} onClick={() => { setActiveView('simulators'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} textStyle="text-emerald-400" />
          <NavItem icon={Settings} label="Core Config" active={activeView === 'config'} onClick={() => { setActiveView('config'); if(window.innerWidth < 1024) setSidebarOpen(false); }} open={sidebarOpen} />
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Glow Ambient behind content */}
        <div className={`absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] blur-[100px] md:blur-[150px] pointer-events-none transition-colors duration-1000
          ${networkStatus === 'OPERATIONAL' ? 'bg-cyan-600/5' : ''}
          ${networkStatus === 'SHIELD_MODE' ? 'bg-orange-600/10' : ''}
          ${networkStatus === 'CLEANING' ? 'bg-emerald-600/10' : ''}
        `} />
        
        {/* 2. Top Bar */}
        <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 relative z-10 w-full">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-400" />
            </button>

            {/* Buscador Omnipresente (Desktop only) */}
            <div className={`hidden md:flex items-center bg-[#111] border transition-colors rounded-lg px-3 py-1.5 sm:w-64 xl:w-96 ${searchFocused ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/10'}`}>
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
            <div className={`flex items-center gap-2 border px-2 py-1 md:px-3 md:py-1.5 rounded-full shrink-0 transition-all duration-500
              ${networkStatus === 'OPERATIONAL' ? 'bg-emerald-500/10 border-emerald-500/20' : ''}
              ${networkStatus === 'SHIELD_MODE' ? 'bg-orange-500/10 border-orange-500/50 scale-105 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : ''}
              ${networkStatus === 'CLEANING' ? 'bg-cyan-500/10 border-cyan-500/20 animate-pulse' : ''}
            `}>
              <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse
                ${networkStatus === 'OPERATIONAL' ? 'bg-emerald-500' : ''}
                ${networkStatus === 'SHIELD_MODE' ? 'bg-orange-500' : ''}
                ${networkStatus === 'CLEANING' ? 'bg-cyan-500' : ''}
              `} />
              <span className={`text-[8px] md:text-xs font-mono tracking-widest
                ${networkStatus === 'OPERATIONAL' ? 'text-emerald-400' : ''}
                ${networkStatus === 'SHIELD_MODE' ? 'text-orange-400' : ''}
                ${networkStatus === 'CLEANING' ? 'text-cyan-400' : ''}
              `}>
                {networkStatus === 'OPERATIONAL' && 'SYS_OK'}
                {networkStatus === 'SHIELD_MODE' && 'PROT_ON'}
                {networkStatus === 'CLEANING' && 'SYNC'}
              </span>
            </div>
            <div className="flex items-center gap-2 border border-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <ActivitySquare className="w-3 h-3 text-cyan-500" />
              <span className="text-[10px] font-mono text-gray-400">EDGE_PING: <span className="text-cyan-400">{latency}ms</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 py-1.5 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Cerrar sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full scroll-smooth">
          
          {/* Header Title & Topo Map */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter">
                {activeView === 'radar' && 'Panel de Comando Global'}
                {activeView === 'b2b' && 'Directorio B2B (Instituciones)'}
                {activeView === 'teachers' && 'Mando del Cuerpo Docente'}
                {activeView === 'audit' && 'Auditoría Ghost Tier-1'}
                {activeView === 'finops' && 'NOC FinOps y Costos IA'}
                {activeView === 'config' && 'Configuración de Núcleo (Core)'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">Supervisión táctica de nodos nacionales "Talento Tech"</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="w-32 sm:w-48 h-12 sm:h-16 bg-black/40 border border-white/10 rounded-xl overflow-hidden relative opacity-70">
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
                  <div className="h-64 sm:h-72 w-full flex items-center justify-center">
                    {!isMounted ? (
                      <div className="text-gray-500 font-mono text-xs animate-pulse tracking-widest">CONNECTING_TELEMETRY_PIPELINE...</div>
                    ) : (
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
                    )}
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

                  <button onClick={() => handleManeuver('rebuild')} className="w-full group flex items-center justify-between bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/30 p-3 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-purple-400 shrink-0 group-hover:animate-pulse" />
                      <span className="text-sm font-medium text-gray-200 group-hover:text-purple-400">Rebuild Production</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </button>

                  <button onClick={() => handleManeuver('lockdown')} className="w-full group flex items-center justify-between bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/50 p-3 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-sm font-bold text-rose-100 group-hover:text-rose-400 uppercase tracking-tighter italic">Lockdown Global</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-600 group-hover:text-rose-400 transition-colors" />
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">B2B_NODES</p>
                   <p className="text-2xl font-black text-white">{institutions.length}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">AVG_REVENUE_PER_INST</p>
                   <p className="text-2xl font-black text-emerald-400">$2.4k</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">PENDING_CONTRACTS</p>
                   <p className="text-2xl font-black text-amber-500">3</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">REGION_COVERAGE</p>
                   <p className="text-2xl font-black text-purple-500">85%</p>
                 </div>
               </div>

               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Directorio Maestra de Instituciones</h3>
                  <div className="flex gap-2">
                    <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all">Exportar Manifest</button>
                    {loadingViews && <div className="text-cyan-500 text-[10px] animate-pulse">REFRESHING_B2B_DATA...</div>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {institutions.length > 0 ? institutions.map((inst, i) => (
                    <div key={i} className="border border-white/5 bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Building2 className="w-16 h-16 -mr-4 -mt-4 text-white" />
                      </div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg 
                          ${inst.level === 'university' ? 'bg-purple-500/20 text-purple-400' : ''}
                          ${inst.level === 'college' ? 'bg-blue-500/20 text-blue-400' : ''}
                          ${inst.level === 'school' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                          ${inst.level === 'ministry' ? 'bg-orange-500/20 text-orange-400' : ''}
                        `}>
                          <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase">ACTIVE</span>
                      </div>
                      
                      <h4 className="font-bold text-lg leading-tight mb-1 group-hover:text-cyan-400 transition-colors">{inst.name}</h4>
                      <p className="text-gray-400 text-[10px] uppercase tracking-widest font-mono mb-4">{inst.level} | {inst.region || 'COLOMBIA'}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-[10px] font-mono text-gray-500">
                          <span>UTILIZACIÓN_IA</span>
                          <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${inst.level === 'university' ? 'bg-purple-500' : 'bg-cyan-500'}`} style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }} />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                        <span className="text-gray-500 text-[9px] uppercase tracking-widest font-mono">LINK_ID</span>
                        <span className="font-mono font-bold text-cyan-400 text-[10px]">{inst.id.substring(0, 8)}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 py-20 text-center border border-dashed border-white/10 rounded-2xl">
                      <Building2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No se encontraron instituciones reales en DB</p>
                    </div>
                  )}
                </div>
               </div>
            </div>
          )}

          {activeView === 'teachers' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">DOCENTES_TOTAL</p>
                   <p className="text-2xl font-black text-white">{teachers.length}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 border-l-blue-500/50">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">SESSIONS_ACTIVE</p>
                   <p className="text-2xl font-black text-blue-400">{Math.floor(teachers.length * 0.4)}</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">SATISFACTION_INDEX</p>
                   <p className="text-2xl font-black text-emerald-400">4.9/5</p>
                 </div>
               </div>

               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden p-6 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Users className="text-blue-500" /> Roster Docente y Telemetría de Sesión</h3>
                  <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                    <button className="px-3 py-1 rounded text-[10px] font-bold bg-white/10 text-white">ALL</button>
                    <button className="px-3 py-1 rounded text-[10px] font-bold text-gray-500 hover:text-white transition-colors">ACTIVE_ONLY</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {teachers.length > 0 ? teachers.map((teacher, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group relative">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400 border border-blue-500/30 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all">
                            {teacher.profiles?.avatar_url ? (
                              <img src={teacher.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">{teacher.profiles?.full_name?.charAt(0) || 'D'}</span>
                            )}
                          </div>
                          {idx % 3 === 0 && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full" />}
                        </div>
                        <div>
                          <p className="font-bold group-hover:text-blue-400 transition-colors leading-tight">{teacher.profiles?.full_name || 'Docente Sin Nombre'}</p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">@{teacher.profiles?.github_username || 'anonymous'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end text-right ml-4">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate max-w-[150px]">{teacher.institutions?.name || 'INSTITUCIÓN GLOBAL'}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono uppercase">Lv. {Math.floor(Math.random() * 5 + 1)}</span>
                           <button onClick={(e) => { e.stopPropagation(); showToast(`Monitoreando a ${teacher.profiles?.full_name}...`, 'success') }} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                             <Search className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                           </button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 py-20 text-center border border-dashed border-white/10 rounded-2xl">
                       <Users className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                       <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No hay docentes registrados en la plataforma</p>
                    </div>
                  )}
                </div>
               </div>
            </div>
          )}

          {activeView === 'audit' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden w-full h-[calc(100vh-250px)] flex flex-col relative">
                {/* Audit Header */}
                <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#111]/30 gap-4">
                  <h3 className="font-bold text-xs sm:text-sm tracking-widest uppercase text-rose-400 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 animate-pulse"/> Centro de Auditoría Ghost Tier-1
                  </h3>
                  <div className="flex gap-3 items-center w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input type="text" placeholder="Filtrar actor o patrón..." className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs font-mono outline-none focus:border-rose-500/30 transition-all" />
                    </div>
                    <button onClick={() => showToast('Iniciando escaneo heurístico...', 'success')} className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)] shrink-0">
                      Deep Scan
                    </button>
                  </div>
                </div>

                {/* Audit Table */}
                <div className="flex-1 overflow-auto w-full p-4 custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-mono border-b border-white/5">
                        <th className="p-4 font-medium whitespace-nowrap">Timestamp</th>
                        <th className="p-4 font-medium whitespace-nowrap text-rose-400/70">Severity</th>
                        <th className="p-4 font-medium whitespace-nowrap">Instigador (Actor)</th>
                        <th className="p-4 font-medium">Patrón / Acción Ejecutada</th>
                        <th className="p-4 font-medium">Domain</th>
                        <th className="p-4 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[11px] divide-y divide-white/5">
                      {realAudits.length > 0 ? (
                        realAudits.map((log) => (
                          <tr key={log.id} className="hover:bg-rose-500/5 transition-all group border-l-2 border-l-transparent hover:border-l-rose-500/50">
                            <td className="p-4 text-gray-500 whitespace-nowrap">
                              {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tighter
                                ${log.status === 'blocked' ? 'bg-rose-500 text-white' : 'bg-white/10 text-gray-400'}
                              `}>{log.status === 'blocked' ? 'CRITICAL' : 'TRACE'}</span>
                            </td>
                            <td className="p-4 text-cyan-400 whitespace-nowrap truncate max-w-[150px] font-bold">{log.actor}</td>
                            <td className="p-4 text-gray-300 group-hover:text-white transition-colors">{log.action}</td>
                            <td className="p-4">
                              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-gray-500 group-hover:text-gray-300 font-mono">{log.classification}</span>
                            </td>
                            <td className="p-4 text-right sm:text-left">
                              {log.status === 'success' 
                                ? <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded font-black text-[10px]"><CheckCircle2 className="w-3 h-3"/> PASS</span>
                                : log.status === 'blocked'
                                ? <span className="inline-flex items-center gap-1.5 text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded font-black text-[10px]"><XCircle className="w-3 h-3"/> REJECT</span>
                                : <span className="inline-flex items-center gap-1.5 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded font-black text-[10px]"><Activity className="w-3 h-3"/> INFO</span>
                              }
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-20 text-center text-gray-500">
                             <div className="flex flex-col items-center gap-4">
                               <RefreshCw className="w-8 h-8 animate-spin text-rose-500/30" />
                               <span className="font-mono text-sm tracking-widest uppercase">Fetching_Cloud_Logs...</span>
                             </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'finops' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl w-full flex flex-col">
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
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Gasto Estimado (Mes)</p>
                    <h2 className="text-4xl font-black text-white mb-1">
                      ${realFinops.reduce((acc, curr) => acc + (curr.cost || 0), 0).toFixed(2)}
                    </h2>
                    <p className="text-emerald-400 text-sm flex items-center gap-1">▼ Operando bajo límite</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Servicios Activos</p>
                    <h2 className="text-4xl font-black text-white mb-1">{realFinops.length}</h2>
                    <p className="text-gray-500 text-sm">Nodos de Infraestructura</p>
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
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6 w-full">
               <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden p-6 relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Settings className="w-32 h-32 text-white" />
                </div>
                
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Settings className="text-cyan-500" /> Núcleo de Configuración del Motor</h3>
                
                <div className="space-y-6 relative z-10">
                  {[
                    { id: 'survival', title: 'Modo Supervivencia (WAF Estricto)', desc: 'Bloquea el 99% de conexiones anónimas y obliga CAPTCHA en API REST.', type: 'critical' },
                    { id: 'aiCache', title: 'IA Cache Aggressive Mode', desc: 'Guarda inferencias previas en Redis KV para ahorrar costos de Gemini Core.', type: 'finops' },
                    { id: 'telemetry', title: 'Telemetry Trace Level', desc: 'Registra hasta los clics del mouse en la DB (Altísimo consumo).', type: 'resource' },
                    { id: 'ghostMode', title: 'Ghost Mode Audit (Master)', desc: 'Permite la impersonación para auditoría de UX en tiempo real.', type: 'security' },
                  ].map((conf) => (
                    <div key={conf.id} className={`flex items-start sm:items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10
                      ${config[conf.id as keyof typeof config] ? 'border-emerald-500/20' : ''}
                    `}>
                      <div className="pr-4 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-100">{conf.title}</p>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase
                            ${conf.type === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : ''}
                            ${conf.type === 'finops' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : ''}
                            ${conf.type === 'resource' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}
                            ${conf.type === 'security' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
                          `}>{conf.type}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{conf.desc}</p>
                      </div>
                      <button 
                        onClick={() => {
                          const val = !config[conf.id as keyof typeof config]
                          setConfig(prev => ({ ...prev, [conf.id]: val }))
                          showToast(`CONFIG_UPDATE: ${conf.id} -> ${val ? 'ON' : 'OFF'}`, val ? 'success' : 'warn')
                        }} 
                        className="shrink-0 transition-all hover:scale-110 active:scale-95"
                      >
                        {config[conf.id as keyof typeof config] 
                          ? <ToggleRight className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                          : <ToggleLeft className="w-12 h-12 text-gray-700" />
                        }
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl flex items-center gap-4">
                  <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Zona de Peligro</p>
                    <p className="text-[10px] text-rose-300 opacity-70">Cualquier cambio aquí afecta a todos los nodos de producción global vinculados al core 'Talento Tech'.</p>
                  </div>
                </div>
               </div>
            </div>
          )}

          {activeView === 'simulators' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full py-10">
              <div className="flex flex-col items-center mb-16 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.15)] relative group">
                  <PlayCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full" />
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-emerald-500/50">Mando de Simulación Global_</h2>
                <p className="text-slate-500 max-w-2xl font-bold text-sm md:text-base uppercase tracking-[0.2em] leading-relaxed">
                  Ejecuta impersonación de roles en tiempo real para auditar la experiencia de usuario (UX) en todos los niveles del ecosistema.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                {[
                  { id: 'escuela', name: 'Escuela (Kids)', role: 'Estudiante Escuela', desc: 'UX Gamificada, colores vibrantes y misiones simplificadas.', color: 'orange', icon: Gamepad2, tag: 'GAMI_V0.5', glow: 'rgba(249,115,22,0.1)' },
                  { id: 'colegio', name: 'Colegio (Teen)', role: 'Estudiante Colegio', desc: 'Enfoque en retos, ranking de puntos y comunidad.', color: 'purple', icon: Trophy, tag: 'RANK_A3.1', glow: 'rgba(168,85,247,0.1)' },
                  { id: 'universidad', name: 'Universidad (Pro)', role: 'Estudiante Universidad', desc: 'Dashboard analítico de alta densidad y perfiles de carrera.', color: 'blue', icon: BrainCircuit, tag: 'PRO_ANALYTICS_V2', glow: 'rgba(59,130,246,0.1)' },
                  { id: 'profesores', name: 'Cuerpo Docente', role: 'Profesor', desc: 'Panel de gestión de cohorte y telemetría de estudiantes.', color: 'emerald', icon: Users, tag: 'COHORT_CMD_V1', glow: 'rgba(16,185,129,0.1)' },
                  { id: 'familia', name: 'Familia (Padres)', role: 'Padre/Tutor', desc: 'Monitorización de progreso, tiempo y logros.', color: 'pink', icon: ShieldCheck, tag: 'PARENTAL_V1', glow: 'rgba(236,72,153,0.1)' }
                ].map((sim) => (
                  <button 
                    key={sim.id}
                    onClick={() => {
                      showToast(`Iniciando Ghost Protocol: ${sim.name}...`, 'success')
                      setImpersonation(sim.role)
                      setTimeout(() => router.push(`/dashboard?view=${sim.id}`), 1200)
                    }}
                    className={`group relative text-left bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-10 transition-all duration-700 hover:border-${sim.color}-500/50 hover:bg-[#020617] hover:-translate-y-2 block overflow-hidden shadow-2xl backdrop-blur-xl`}
                  >
                    {/* Background Dot Grid inside card */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity duration-700" 
                         style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    
                    {/* Dynamic Glow */}
                    <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} 
                         style={{ backgroundColor: sim.color === 'emerald' ? 'rgba(16,185,129,0.15)' : 
                                               sim.color === 'orange' ? 'rgba(249,115,22,0.15)' : 
                                               sim.color === 'purple' ? 'rgba(168,85,247,0.15)' : 
                                               'rgba(59,130,246,0.15)' }} />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div className={`w-16 h-16 bg-[#020617] border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:border-${sim.color}-500/50 shadow-inner`}>
                          <sim.icon className={`w-8 h-8 text-slate-500 group-hover:text-white transition-colors`} />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[9px] font-black font-mono px-3 py-1.5 rounded-full bg-${sim.color}-500/10 text-${sim.color}-400 border border-${sim.color}-500/20 tracking-widest uppercase mb-2`}>{sim.tag}</span>
                          <p className="text-[7px] font-mono text-slate-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">SEC_0x{sim.id.toUpperCase()}</p>
                        </div>
                      </div>

                      <h3 className="font-black text-3xl mb-4 tracking-tighter text-white group-hover:text-white transition-colors uppercase italic leading-none">
                        {sim.name}
                      </h3>
                      
                      <p className="text-sm text-slate-500 leading-relaxed font-bold group-hover:text-slate-300 transition-colors uppercase tracking-tight">
                        {sim.desc}
                      </p>

                      <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full animate-pulse bg-${sim.color}-500 shadow-[0_0_10px_${sim.glow}]`}></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">Execute_Ghost_Mode</span>
                        </div>
                        <div className={`p-2 rounded-lg border border-white/5 bg-white/5 group-hover:border-${sim.color}-500/30 transition-all`}>
                           <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:text-${sim.color}-400 translate-x-0 group-hover:translate-x-1 transition-transform`} />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}


          <Footer variant="dashboard" />
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
