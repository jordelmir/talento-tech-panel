'use client'

import { createClient } from '@/lib/supabase'
import { Activity, ArrowRight, GitBranch as Github } from 'lucide-react'
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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <Activity className="text-emerald-500 w-16 h-16" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Orquestador Talento Tech
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Conecta tu entorno de desarrollo para continuar
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 border border-gray-800 py-8 px-4 shadow sm:rounded-lg flex flex-col gap-4 p-8">
          
          <div className="space-y-6">
            <div>
              <button
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 gap-3 items-center border-slate-700 transition-all"
              >
                <Github className="w-5 h-5"/>
                {loading ? 'Autenticando...' : 'Autenticar con GitHub'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2 opacity-50"/>}
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-500">
              Esta plataforma utiliza la API de GitHub para la lectura automática de commits y telemetría de esfuerzo para el programa de acompañamiento Talento Tech.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
