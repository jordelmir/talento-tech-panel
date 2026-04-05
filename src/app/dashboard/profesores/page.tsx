'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Users, Search, AlertTriangle, CheckCircle, 
  BookOpen, Beaker, UserX, BarChart3, Fingerprint 
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { useProfileStore } from '@/store/useProfileStore'
import { ShieldCheck } from 'lucide-react'

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
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const isAdmin = activeProfile?.includes('Simulado') || activeProfile === 'Administrador'
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans selection:bg-purple-300">
      
      {/* Navbar Docente */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-fuchsia-600 p-2 rounded-xl text-white shadow-lg shadow-fuchsia-500/20">
            <Users className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">
            Talento<span className="text-fuchsia-600">Tech</span> <span className="text-sm font-bold text-slate-500 ml-1">Docentes</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar estudiante..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 border-none outline-none pl-9 pr-4 py-2 rounded-full text-sm font-medium w-64 focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Comando Central (NOC)</span>
            </button>
          )}

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-slate-900/20">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Desconectar</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-fuchsia-300 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Mis Alumnos</p>
              <h2 className="text-3xl font-black text-slate-900">142</h2>
            </div>
            <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600 transition-colors">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Promedio General</p>
              <h2 className="text-3xl font-black text-slate-900">85<span className="text-lg text-slate-400">/100</span></h2>
            </div>
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Riesgo Académico</p>
              <h2 className="text-3xl font-black text-rose-600">8<span className="text-lg text-rose-400 font-medium"> alertas</span></h2>
            </div>
            <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
              <UserX className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-amber-300 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Detección de IA (Plagio)</p>
              <h2 className="text-3xl font-black text-amber-500">2<span className="text-lg text-amber-400 font-medium"> casos</span></h2>
            </div>
            <div className="bg-amber-50 text-amber-600 p-3 rounded-xl animate-pulse">
              <Fingerprint className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Evolución del Curso */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                Evolución Bi-Semanal del Cohorte
              </h2>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center">
              {!isMounted ? (
                <div className="text-slate-400 font-mono text-xs animate-pulse">SYNCING_COHORTE_DATA...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="week" fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="avg" name="Nota Promedio" stroke="#c026d3" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="participation" name="% Participación" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Panel Lateral: Alertas Directas */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 flex flex-col shadow-xl">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Action Items
            </h2>
            
            <div className="space-y-4 flex-1">
              {/* Plagio */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 blur-xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <Fingerprint className="w-4 h-4" /> 
                    <span className="font-bold text-xs">ALERTA GHOST-AI</span>
                  </div>
                  <p className="font-bold mb-1">Detección de IA &gt; 95%</p>
                  <p className="text-xs text-slate-400 font-mono">Estudiante: M. Salazar</p>
                  <p className="text-xs text-slate-400 font-mono">Repo: algoritmia-reto-4</p>
                  <button className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs py-2 rounded-lg transition-colors">
                    Revisar Hash
                  </button>
                </div>
              </div>

               {/* Risk */}
               <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/20 blur-xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-rose-400 mb-2">
                    <UserX className="w-4 h-4" /> 
                    <span className="font-bold text-xs">RIESGO ACADÉMICO</span>
                  </div>
                  <p className="font-bold mb-1">Ausencia Prolongada</p>
                  <p className="text-xs text-slate-400 font-mono">Estudiante: J. Perez</p>
                  <p className="text-xs text-slate-400 font-mono">Sin commits hace 14 días.</p>
                  <button className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2 rounded-lg transition-colors">
                    Agendar Mentoría
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tabla Rápida del Salón */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-500"/> Calificaciones Recientes</h3>
            <button className="text-sm font-bold text-fuchsia-600 hover:text-fuchsia-700 transition-colors">Ver Todo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Estudiante</th>
                  <th className="px-6 py-4">Módulo Actual</th>
                  <th className="px-6 py-4">Nota Promedio</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Andrea Lin', mod: 'Frontend Vue/React', nota: 96, status: 'excelencia' },
                  { name: 'Camilo Diaz', mod: 'Bases de Datos', nota: 81, status: 'normal' },
                  { name: 'Miguel Salazar', mod: 'Lógica Python', nota: 42, status: 'riesgo' },
                  { name: 'Sandra Lopez', mod: 'Arquitectura Cloud', nota: 89, status: 'normal' },
                ].map((est, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{est.name}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{est.mod}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-700">{est.nota}</span>
                    </td>
                    <td className="px-6 py-4">
                      {est.status === 'excelencia' && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md"><CheckCircle className="w-3 h-3"/> Top 10%</span>}
                      {est.status === 'normal' && <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">Al Día</span>}
                      {est.status === 'riesgo' && <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-md"><AlertTriangle className="w-3 h-3"/> Evaluando</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}
