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
import { ShieldCheck, Loader2 } from 'lucide-react'
import Footer from '@/components/Footer'
import { getTeacherDashboardData } from '../actions'

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
  const [dataLoading, setDataLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const activeProfile = useProfileStore((state) => state.activeProfile)
  
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'audit' | 'config'>('overview')
  
  // Real Data states
  const [students, setStudents] = useState<any[]>([])
  const [activeSessions, setActiveSessions] = useState<any[]>([])

  React.useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const data = await getTeacherDashboardData(session.user.id)
        if (data) {
          setStudents(data.students)
          setActiveSessions(data.sessions)
        }
      }
      setDataLoading(false)
    }
    fetchData()
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
      
      {/* Navbar Docente Master */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-fuchsia-600 p-2 rounded-xl text-white shadow-lg shadow-fuchsia-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-800 hidden md:inline">
              Talento<span className="text-fuchsia-600">Tech</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[
              { id: 'overview', label: 'Monitor Global', icon: BarChart3 },
              { id: 'students', label: 'Gestión Salón', icon: Users },
              { id: 'audit', label: 'Ghost AI Audit', icon: Fingerprint },
              { id: 'config', label: 'Ajustes', icon: BookOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-fuchsia-600 shadow-md border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden xl:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por ID o Nombre..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 border-none outline-none pl-9 pr-4 py-2 rounded-xl text-xs font-medium w-48 focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => router.push('/admin-panel')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">NOC Command</span>
            </button>
          )}

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-12 h-12" /></div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Población Estudiantil</p>
                 <h2 className="text-4xl font-black">{dataLoading ? '...' : students.length}</h2>
                 <p className="text-[10px] text-fuchsia-400 font-mono mt-4 flex items-center gap-1">● SYNCED_WITH_CLOUD</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Fingerprint className="w-12 h-12" /></div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Casos de Plagio (IA)</p>
                 <h2 className="text-4xl font-black text-rose-500">2<span className="text-sm text-rose-400/50 ml-2 font-medium">Critical</span></h2>
                 <p className="text-[10px] text-rose-400 font-mono mt-4 flex items-center gap-1">▲ ACTION_REQUIRED</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group col-span-1 lg:col-span-2">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Monitorización de Salud de Cohorte</p>
                       <h2 className="text-2xl font-black">Performance: 82%</h2>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400 uppercase">Saludable</div>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '82%' }} />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="font-black text-xl text-slate-800 tracking-tight">Curva de Aprendizaje (Histórico)</h3>
                     <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-fuchsia-600 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-fuchsia-600" /> Promedio</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Participación</div>
                     </div>
                  </div>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={performanceData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="week" hide />
                           <YAxis hide />
                           <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                           <Line type="monotone" dataKey="avg" stroke="#c026d3" strokeWidth={5} dot={{ r: 6, fill: '#fff', strokeWidth: 3 }} activeDot={{ r: 8 }} />
                           <Line type="monotone" dataKey="participation" stroke="#10b981" strokeWidth={3} strokeDasharray="5 10" dot={false} />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col">
                  <h3 className="font-black text-xl text-slate-800 tracking-tight mb-6 flex items-center gap-2">
                     <AlertTriangle className="text-amber-500" /> Notificaciones Críticas
                  </h3>
                  <div className="space-y-4 flex-1">
                     {[
                       { title: 'Detección de IA Alta', user: 'M. Salazar', color: 'border-amber-400 bg-amber-50' },
                       { title: 'Inactividad > 7 días', user: 'J. Perez', color: 'border-rose-400 bg-rose-50' },
                       { title: 'Promedio < 3.0', user: 'L. Mendez', color: 'border-slate-400 bg-slate-50' },
                     ].map((alert, i) => (
                       <div key={i} className={`p-4 rounded-2xl border-l-8 ${alert.color} group hover:translate-x-1 transition-transform cursor-pointer`}>
                          <p className="font-black text-slate-900 text-sm leading-tight mb-1">{alert.title}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{alert.user}</p>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-6 bg-slate-900 text-white rounded-2xl py-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-fuchsia-600 transition-colors shadow-lg shadow-fuchsia-500/10">
                     Lanzar Auditoría General
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div>
                      <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3"><Users className="text-fuchsia-600"/> Libro de Registro</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Cohorte Activo 2024-Q1</p>
                   </div>
                   <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:border-fuchsia-500 transition-colors">Exportar Notas (.CSV)</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-4">Firma Digital Estudiante</th>
                            <th className="px-8 py-4">Misiones</th>
                            <th className="px-8 py-4">XP Acumulada</th>
                            <th className="px-8 py-4">Estado Operativo</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {students.map((est, i) => (
                            <tr key={i} className="hover:bg-fuchsia-50/30 transition-colors group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border-2 border-transparent group-hover:border-fuchsia-200 transition-all">
                                        {est.profiles?.avatar_url ? <img src={est.profiles.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : 'ID'}
                                     </div>
                                     <div>
                                        <p className="font-black text-slate-900 leading-tight">{est.profiles?.full_name || 'Anonymous Node'}</p>
                                        <p className="text-[10px] font-mono text-slate-400 uppercase">{est.profile_id.substring(0,18)}...</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex -space-x-2">
                                     {[1,2,3].map(s => <div key={s} className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white" />)}
                                     <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">+5</div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <span className="font-mono font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">12,450 XP</span>
                               </td>
                               <td className="px-8 py-6">
                                  <span className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase border border-emerald-100">
                                     <CheckCircle className="w-3 h-3" /> Conectado
                                  </span>
                               </td>
                            </tr>
                         ))}
                         {students.length === 0 && (
                            <tr>
                               <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-black italic tracking-widest uppercase">ERROR_FETCHING_STUDENT_DATA_RETRY_MAPPING</td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {(activeTab === 'audit' || activeTab === 'config') && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-20 text-center">
              <div className="bg-slate-900 border border-slate-800 inline-block p-12 rounded-3xl shadow-2xl">
                 <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin mx-auto mb-6" />
                 <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Acceso de Alta Densidad Requerido</h2>
                 <p className="text-slate-500 text-sm max-w-xs mx-auto">Esta sección está siendo autenticada mediante tu Ghost Protocol. Estará disponible en milisegundos.</p>
              </div>
           </div>
        )}

      </main>
      <Footer variant="dashboard" />
    </div>
  )
}
