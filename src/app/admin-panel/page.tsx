'use client'

import React, { useState, useEffect } from 'react'
import { 
  Menu, Search, Bell, ShieldAlert, Cpu, Activity,
  Server, GitPullRequest, SearchCheck, Users, 
  Building2, School, BrainCircuit, Settings,
  LogOut, PlayCircle, StopCircle, RefreshCw, AlertOctagon, CheckCircle2, XCircle,
  ChevronRight, ShieldCheck
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts'

// --- Mock Data ---
const areaData = [
  { time: '00:00', profesores: 400, estudiantes: 2400 },
  { time: '04:00', profesores: 300, estudiantes: 1398 },
  { time: '08:00', profesores: 2000, estudiantes: 9800 },
  { time: '12:00', profesores: 2780, estudiantes: 13908 },
  { time: '16:00', profesores: 1890, estudiantes: 11800 },
  { time: '20:00', profesores: 2390, estudiantes: 8800 },
  { time: '23:59', profesores: 1490, estudiantes: 4300 },
]

const finOpsData = [
  { name: 'Gemini 1.5 Pro', limit: 100, cost: 89 },
  { name: 'Claude 3 Opus', limit: 100, cost: 45 },
  { name: 'Supabase DB', limit: 100, cost: 92 },
  { name: 'Vercel Edge', limit: 100, cost: 12 },
]

const auditLogs = [
  { id: 1, time: '10:42:01', actor: 'jzabalaa@mineduc...', action: 'Consulta Dashboard Nacional', role: 'Administrador', status: 'success' },
  { id: 2, time: '10:41:15', actor: '190.24.5.122', action: 'Intento login no autorizado', role: 'Desconocido', status: 'blocked' },
  { id: 3, time: '10:38:55', actor: 'prof.rodriguez@col...', action: 'Auditoría Ghost', role: 'Profesor', status: 'success' },
  { id: 4, time: '10:35:10', actor: 'admin_ghost_agent', action: 'Modificación RLS (Auto-Fix)', role: 'IA Ghost', status: 'success' },
  { id: 5, time: '10:30:00', actor: '181.55.9.10', action: 'Ataque DDoS Mitigado (Edge)', role: 'Desconocido', status: 'blocked' },
]

// --- Component ---
export default function SuperAdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchFocused, setSearchFocused] = useState(false)

  // Hydration fix for Recharts in Next.js
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* 1. Sidebar Táctica */}
      <aside className={`transition-all duration-300 ease-in-out border-r border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl flex flex-col z-20 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
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
          <NavItem icon={SearchCheck} label="Radar General" active open={sidebarOpen} />
          <NavItem icon={Building2} label="Instituciones (B2B)" open={sidebarOpen} />
          <NavItem icon={Users} label="Cuerpo Docente" open={sidebarOpen} />
          <NavItem icon={ShieldAlert} label="Auditoría / RLS" open={sidebarOpen} textStyle="text-rose-400" />
          <NavItem icon={Cpu} label="FinOps (Costos IA)" open={sidebarOpen} textStyle="text-cyan-400" />
          <NavItem icon={Settings} label="Core Config" open={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/10">
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
            {/* Status Badge */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400 uppercase tracking-widest">SYS.Ope</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <button className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-3 py-1.5 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">EMERGENCY HALT</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 relative z-10 w-full">
          
          {/* Header Title */}
          <div>
            <h1 className="text-3xl font-black tracking-tighter">Panel de Comando Global</h1>
            <p className="text-gray-400 text-sm mt-1">Supervisión táctica de nodos nacionales "Talento Tech"</p>
          </div>

          {/* 3. Zona 1: Telemetría Global */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={Activity} color="emerald" title="Tráfico Activo (5m)" value="14,230" trend="+12% VS AYER" />
            <KpiCard icon={Server} color="blue" title="Salud Instancias OCI" value="99.99%" trend="ESTADO ÓPTIMO" />
            <KpiCard icon={GitPullRequest} color="purple" title="Repos Evaluados" value="3,492" trend="840 PENDIENTES" />
            <KpiCard icon={AlertOctagon} color="rose" title="Ataques Bloqueados" value="128" trend="1 ALERTA CRÍTICA" />
          </div>

          {/* 4. Zona 2: Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna A: Actividad x Rol */}
            <div className="lg:col-span-2 bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h3 className="font-bold">Actividad L-24h</h3>
                  <p className="text-xs text-gray-500">Conexiones simultáneas</p>
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

            {/* Columna B: FinOps IA */}
            <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col w-full">
              <div className="mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400 shrink-0" />
                  Radares FinOps
                </h3>
                <p className="text-xs text-gray-500">Porcentaje de Billing Consumido</p>
              </div>
              <div className="flex-1 min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={finOpsData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }} formatter={(value) => `${value}%`} />
                    <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={12}>
                      {finOpsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cost > 85 ? '#ef4444' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Alert Mock */}
              <div className="mt-4 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs text-rose-400 font-bold">ALERTA FINANZAS VERCEL/DB</p>
                  <p className="text-[10px] text-rose-500/70 leading-tight mt-0.5">El consumo del motor base de datos alcanzó el 92% de la cuota.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Container Inferior: Auditoría y Acciones */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-12 w-full">
            
            {/* 5. Zona 3: Log de Auditoría */}
            <div className="xl:col-span-3 bg-[#0A0A0A]/60 border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden w-full">
              <div className="p-4 sm:p-5 border-b border-white/5 flex justify-between items-center bg-[#111]/30">
                <h3 className="font-bold text-xs sm:text-sm tracking-widest uppercase">Audit Trail en Vivo</h3>
                <div className="flex gap-2 items-center">
                  <span className="w-2 h-2 gap-1 rounded-full bg-cyan-500 animate-ping" />
                  <span className="text-[10px] font-mono text-cyan-500 hidden sm:inline">LISTENING...</span>
                </div>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                      <th className="p-3 font-medium whitespace-nowrap">Timestamp</th>
                      <th className="p-3 font-medium whitespace-nowrap">Identidad</th>
                      <th className="p-3 font-medium whitespace-nowrap">Patrón / Acción</th>
                      <th className="p-3 font-medium">Clasificación</th>
                      <th className="p-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[11px] sm:text-xs divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-gray-500 whitespace-nowrap">{log.time}</td>
                        <td className="p-3 text-cyan-400 whitespace-nowrap truncate max-w-[150px]">{log.actor}</td>
                        <td className="p-3 text-gray-300">{log.action}</td>
                        <td className="p-3">
                          <span className="bg-white/10 border border-white/10 px-2 py-0.5 rounded text-gray-400 whitespace-nowrap">{log.role}</span>
                        </td>
                        <td className="p-3">
                          {log.status === 'success' 
                            ? <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"><CheckCircle2 className="w-3 h-3"/> PASS</span>
                            : <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded"><XCircle className="w-3 h-3"/> REJECT</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. Zona 4: Gestión Rápida */}
            <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl flex flex-col gap-4 w-full">
              <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Maniobras Tácticas</h3>
              
              <button className="w-full group flex items-center justify-between bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 p-3 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium text-gray-200 group-hover:text-emerald-400">Aprobar Accesos</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </button>
              
              <button className="w-full group flex items-center justify-between bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 p-3 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <StopCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-200 group-hover:text-rose-500">Aislar Instancia</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-rose-400 transition-colors" />
              </button>

              <button className="w-full group flex items-center justify-between bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 p-3 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
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
      </main>
    </div>
  )
}

// Helper Components
function NavItem({ icon: Icon, label, active = false, open, textStyle = "text-gray-400" }: { icon: any, label: string, active?: boolean, open: boolean, textStyle?: string }) {
  return (
    <button className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
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
