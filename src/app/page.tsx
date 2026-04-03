'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { AlertCircle, Hand, CheckCircle, Activity, Users, ServerOff } from 'lucide-react'

// Tipado estricto
type LiveSession = {
  id: string
  student_id: string
  needs_help: boolean
  active: boolean
  updated_at: string
  profiles?: { full_name: string; github_username: string }
}

export default function TeacherDashboard() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [onlineCount, setOnlineCount] = useState(0)
  const [lastSync, setLastSync] = useState<string>('')

  // Función de fetching memoizada para evitar re-renders innecesarios
  const fetchSessions = useCallback(async () => {
    const { data, error } = await supabase
      .from('live_sessions')
      .select(`
        *,
        profiles (full_name, github_username)
      `)
      .eq('active', true)
      
    if (!error && data) {
      setSessions(data as any)
      setOnlineCount(data.length)
      setLastSync(new Date().toLocaleTimeString())
    }
  }, [supabase])

  useEffect(() => {
    // 1. Carga inicial
    fetchSessions()

    // 2. Polling Inteligente (El salvavidas del Free Tier)
    // Consulta la BD cada 5 segundos en lugar de mantener una conexión Websocket abierta.
    // Esto ahorra el límite de 200 conexiones concurrentes del Free Tier de Supabase.
    const pollInterval = setInterval(() => {
      fetchSessions()
    }, 5000)

    // Cleanup al desmontar
    return () => clearInterval(pollInterval)
  }, [fetchSessions])

  const studentsNeedingHelp = sessions.filter(s => s.needs_help)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8 font-sans">
      
      {/* Header Corporativo con Indicador de Polling */}
      <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-emerald-500" />
            Talento Tech | Centro de Comando
          </h1>
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            {lastSync ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            )}
            Sincronización Polling. Última actualización: {lastSync || 'Cargando...'}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-lg flex items-center gap-3">
            <Users className="text-blue-400 w-5 h-5" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Activos</p>
              <p className="font-mono text-xl font-bold">{onlineCount}</p>
            </div>
          </div>
          <div className="bg-red-950/30 border border-red-900/50 px-6 py-3 rounded-lg flex items-center gap-3">
            <Hand className="text-red-500 w-5 h-5" />
            <div>
              <p className="text-xs text-red-500/70 uppercase tracking-wider">Bloqueados</p>
              <p className="font-mono text-xl font-bold text-red-400">{studentsNeedingHelp.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de Monitoreo (Mismo diseño, consumo de red optimizado) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cola de Ayuda */}
        <div className="lg:col-span-1 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            Requieren Intervención
          </h2>
          
          <div className="space-y-4">
            {studentsNeedingHelp.length === 0 ? (
              <div className="text-center py-10 text-gray-600 border border-dashed border-gray-800 rounded-lg flex flex-col items-center gap-2">
                <ServerOff className="w-6 h-6 text-gray-700" />
                Ningún alumno bloqueado.
              </div>
            ) : (
              studentsNeedingHelp.map((session) => (
                <div key={session.id} className="bg-red-950/20 border border-red-900/40 p-4 rounded-lg flex justify-between items-center border-l-4 border-l-red-500">
                  <div>
                    <p className="font-semibold text-red-200">{session.profiles?.full_name || 'Alumno Anónimo'}</p>
                    <p className="text-xs text-red-400/70 font-mono">@{session.profiles?.github_username || 'github_user'}</p>
                  </div>
                  <button className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 hover:border-red-600 text-xs px-4 py-2 rounded transition-all">
                    Resolver
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alumnos Activos */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            Terminales Activas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.filter(s => !s.needs_help).map((session) => (
              <div key={session.id} className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-lg flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-75"></div>
                  <p className="font-medium text-gray-300 text-sm truncate">{session.profiles?.full_name || 'Estudiante'}</p>
                </div>
                <p className="text-xs text-gray-500 font-mono bg-black/50 p-1 rounded">Status: Orchestrating...</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
