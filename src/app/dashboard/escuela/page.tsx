'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { 
  LogOut, Star, Trophy, Target, Gamepad2, 
  Map, Sparkles, BookOpen, GraduationCap 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts'

const mockMissions = [
  { name: 'Algoritmos Básicos', pts: 120 },
  { name: 'Lógica Visual', pts: 80 },
  { name: 'Ciber-Seguridad Kids', pts: 200 },
  { name: 'Pensamiento Crítico', pts: 150 },
]

export default function EscuelaDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-300">
      
      {/* Navbar Escolar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-500/30 rotate-3">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">
            Talento<span className="text-orange-500">Tech</span> <span className="text-sm bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Kids</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full font-bold text-slate-600">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Nivel 5</span>
          </div>
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold transition-all disabled:opacity-50">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-10 space-y-8">
        
        {/* Hero Section Gamified */}
        <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" /> Bienvenido de vuelta
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">¡Hola, Futuro Creador! 🚀</h1>
              <p className="text-blue-100 text-lg max-w-xl">Tienes 3 misiones nuevas hoy. Completa los desafíos de lógica para ganar estrellas y desbloquear tu avatar dorado.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center w-full md:w-auto">
              <span className="text-5xl font-black mb-1 drop-shadow-md">550</span>
              <span className="text-blue-100 font-bold uppercase tracking-widest text-xs">Puntos de Esfuerzo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Misiones / Ruta de Aprendizaje */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Map className="w-6 h-6 text-emerald-500" /> Mapa de Misiones
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Bucle Infinito', type: 'Lógica', status: 'completed', icon: Target, color: 'emerald' },
                { title: 'Variables Mágicas', type: 'Código', status: 'active', icon: BookOpen, color: 'orange' },
                { title: 'Misterio del Bug', type: 'Detectives', status: 'locked', icon: Search, color: 'slate' },
                { title: 'Robótica Base', type: 'Maker', status: 'locked', icon: Cpu, color: 'slate' },
              ].map((mission, i) => {
                const Icon = mission.icon as any
                return (
                  <div key={i} className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg
                    ${mission.status === 'completed' ? 'bg-emerald-50 border-emerald-200' : ''}
                    ${mission.status === 'active' ? 'bg-white border-orange-400 shadow-xl shadow-orange-500/10 scale-[1.02]' : ''}
                    ${mission.status === 'locked' ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed' : ''}
                  `}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl 
                        ${mission.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : ''}
                        ${mission.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                        ${mission.color === 'slate' ? 'bg-slate-200 text-slate-400' : ''}
                      `}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {mission.status === 'completed' && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                      {mission.status === 'active' && <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Nuevo</span>}
                    </div>
                    <h3 className={`font-bold text-lg mb-1 ${mission.status === 'locked' ? 'text-slate-500' : 'text-slate-800'}`}>{mission.title}</h3>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{mission.type}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Gráfico de Progreso */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Estrellas Ganadas
            </h2>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockMissions} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" fontSize={11} stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="pts" radius={[6, 6, 0, 0]} barSize={30}>
                    {mockMissions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#38bdf8', '#fb923c', '#34d399', '#a78bfa'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm font-bold text-slate-500 mt-4">¡Sigue así, casi logras la medalla Diamante!</p>
          </div>

        </div>
      </main>
    </div>
  )
}
