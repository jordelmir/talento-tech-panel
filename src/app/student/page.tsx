'use client'

import { useEffect, useState, useCallback } from 'react'
import { Activity, GitBranch as Github, ShieldAlert, CheckCircle2, AlertTriangle, Send, Loader2, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [repoUrl, setRepoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'approved' | 'rejected' | 'auto_failed_security'>('idle')
  const [helpRequested, setHelpRequested] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const fetchSessionStatus = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('live_sessions')
      .select('status, needs_help')
      .eq('user_id', userId)
      .eq('active', true)
      .single()

    if (!error && data) {
      setHelpRequested(data.needs_help)
    } else if (error && error.code === 'PGRST116') {
      // Si no hay sesión activa, crear una nueva al entrar
      await supabase.from('live_sessions').insert({
        user_id: userId,
        active: true,
        status: 'coding'
      })
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchSessionStatus(user.id)
      }
    }
    init()
  }, [supabase, fetchSessionStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSubmitting(true)
    setStatus('scanning')
    
    const { error } = await supabase
      .from('repository_submissions')
      .insert({
        student_id: user.id,
        repo_url: repoUrl,
        module_name: '0', // Asociado por ID al primer módulo del curriculum
        status: 'pending'
      })

    if (error) {
      console.error(error)
      setStatus('rejected')
      setSubmitting(false)
      return
    }

    // Real-time update check
    const checkStatus = async () => {
      const { data, error } = await supabase
        .from('repository_submissions')
        .select('status, ai_feedback')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        if (data.status !== 'pending') {
          setStatus(data.status as any);
          setSubmitting(false);
        } else {
          // Si sigue pendiente, volver a chequear en 5s
          setTimeout(checkStatus, 5000);
        }
      }
    };
    
    checkStatus();
  }

  const toggleHelp = async () => {
    if (!user) return
    const newState = !helpRequested
    setHelpRequested(newState)
    
    await supabase
      .from('live_sessions')
      .update({ 
        needs_help: newState,
        status: newState ? 'needs_help' : 'coding'
      })
      .eq('user_id', user.id)
      .eq('active', true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070707] text-slate-300 font-sans p-4 sm:p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <Activity className="text-emerald-500 w-8 h-8" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Portal Arquitecto</h1>
          </div>
          <p className="text-sm text-slate-500 mt-2">Módulo 1: Fundamentos de Orquestación</p>
        </div>

        <div className="mt-6 md:mt-0 flex gap-4">
          <button 
            onClick={toggleHelp}
            className={`px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider border transition-all flex items-center gap-2 ${
              helpRequested 
                ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
          >
            {helpRequested ? <AlertTriangle className="w-4 h-4"/> : <Activity className="w-4 h-4"/>}
            {helpRequested ? 'SOS Emitido' : 'Soporte IA'}
          </button>
          
          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider border bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="max-w-4xl grid gap-8 relative z-10">
        
        {/* Mission / Goal Card */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 rounded-2xl p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4">Directiva Actual</h2>
          <p className="text-slate-400 leading-relaxed max-w-2xl">
            Despliega la infraestructura base con Supabase y conecta tu repositorio público de GitHub.
            El agente "Ghost" auditará tus llaves de seguridad automáticamente antes de permitirte pasar al siguiente nivel.
          </p>
        </div>

        {/* Action Panel - Submit Repo */}
        <div className="bg-black border border-white/5 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Github className="text-slate-400 w-5 h-5"/>
            Someter Repositorio (Despliegue)
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="repoUrl" className="block text-sm font-medium text-slate-400 mb-2">
                URL Pública del Repositorio de Producción
              </label>
              <div className="flex bg-slate-950 border border-slate-800 focus-within:border-emerald-500/50 rounded-xl overflow-hidden transition-colors">
                <span className="flex items-center pl-4 pr-2 text-slate-600">
                  <Github className="w-4 h-4" />
                </span>
                <input
                  type="url"
                  id="repoUrl"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/tu-usuario/mi-proyecto-orquestado"
                  className="w-full bg-transparent text-white p-4 pl-2 focus:outline-none placeholder-slate-700 font-mono text-sm"
                  required
                  disabled={submitting || status === 'approved'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || status === 'approved'}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] flex justify-center items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Iniciando Auto-Auditoría...' : 'Lanzar Cohete (Subir)'}
            </button>
          </form>

          {/* AI Auditor Feedback Area */}
          {status !== 'idle' && (
            <div className={`mt-6 p-6 rounded-xl border ${
              status === 'scanning' ? 'bg-cyan-950/20 border-cyan-800/50 text-cyan-400 animate-pulse' :
              status === 'approved' ? 'bg-emerald-950/20 border-emerald-800/50 text-emerald-400' :
              'bg-rose-950/20 border-rose-800/50 text-rose-400'
            }`}>
              <div className="flex items-start gap-4">
                {status === 'scanning' && <Activity className="w-6 h-6 mt-1" />}
                {status === 'approved' && <CheckCircle2 className="w-6 h-6 mt-1" />}
                {status === 'rejected' && <ShieldAlert className="w-6 h-6 mt-1" />}
                
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    {status === 'scanning' ? 'Agente IA Escaneando...' :
                     status === 'approved' ? 'Auditoría Pasada con Éxito' :
                     'Vulnerabilidad / Error Detectado'}
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed font-mono">
                    {status === 'scanning' ? 'Clonando repositorio de manera efímera. Evaluando variables de entorno y RLS en tu esquema supabase...' :
                     status === 'approved' ? '[SYSTEM_OK] Códigos limpios. Políticas RLS estrictas. El profesor ha sido notificado.' :
                     status === 'auto_failed_security' ? 'Falla crítica detectada por IA. Revisa tus secretos en GitHub.' :
                     '[CRITICAL ALERT] Se detectaron credenciales en el código fuente o carencia de ROW LEVEL SECURITY.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
