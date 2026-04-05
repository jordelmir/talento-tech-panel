'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Activity, ArrowRight, ArrowLeft, GitBranch as Github } from 'lucide-react'
import { useState } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGithubLogin = async () => {
    setLoading(true)
    
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    // El loading no se reseta inmediatamente porque hay un redirect
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col pt-8 pb-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Top Nav */}
      <div className="w-full max-w-7xl mx-auto mb-12 flex justify-start relative z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-all group px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex-1 flex flex-col justify-center relative z-10">
        <div className="flex justify-center flex-col items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-colors" />
            <Activity className="text-emerald-500 w-16 h-16 relative" />
          </div>
          <h2 className="mt-8 text-center text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic">
            Talento <span className="text-emerald-400">Tech</span>
          </h2>
          <p className="mt-4 text-center text-xs font-mono uppercase tracking-[0.3em] text-gray-500">
            Orquestador de Identidad Digital
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0A0A0A]/60 border border-white/10 py-10 px-6 shadow-2xl sm:rounded-3xl backdrop-blur-xl flex flex-col gap-6">
          
          <div className="space-y-6">
            <div>
              <button
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-emerald-500/30 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.1)] text-sm font-black text-white bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 gap-4 items-center transition-all uppercase tracking-widest italic"
              >
                <Github className="w-5 h-5"/>
                {loading ? 'Sincronizando...' : 'Ingresar con GitHub'}
                {!loading && <ArrowRight className="w-4 h-4 ml-1 opacity-50"/>}
              </button>
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] text-center text-gray-600 font-mono leading-relaxed uppercase tracking-wider">
                Protocolo de auditoría activa. Se requiere acceso a commits y perfiles públicos para la evaluación del núcleo Talento Tech.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
