'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useProfileStore } from '@/store/useProfileStore'
import { Building2, GraduationCap, School, Users, ShieldAlert, Loader2 } from 'lucide-react'

const PROFILES = [
  { id: 'escuela', label: 'Escuela', icon: School, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: 'colegio', label: 'Colegio', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 'universidad', label: 'Universidad', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: 'profesores', label: 'Profesores', icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' }
]

export default function GatewayPage() {
  const router = useRouter()
  const setProfile = useProfileStore((state) => state.setProfile)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleProfileSelection = async (profileId: string, profileLabel: string) => {
    setLoadingId(profileId)
    const supabase = createClient()
    
    // Updates global store immediately for snappy UX
    setProfile(profileLabel)

    // Persist into user raw_user_meta_data for the Auth Session
    const { error } = await supabase.auth.updateUser({
      data: { active_profile: profileId }
    })

    if (error) {
      console.error('[Gateway] Failed to sync profile to DB:', error)
    }

    // Route to definitive panel
    router.push(`/dashboard/${profileId}`)
  }

  const handleAdminClick = () => {
    setToastMessage("Acceso restringido. Su credencial no tiene permisos de Super Administrador.")
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-[url('/grid.svg')] bg-center selection:bg-emerald-500/30 flex items-center justify-center p-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.2)] backdrop-blur-md">
            <ShieldAlert size={18} />
            <span className="font-medium text-sm">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Selecciona tu Perfil
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Configura tu entorno de trabajo. El acceso a las herramientas y módulos se adaptará a tu perfil operativo.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelection(profile.id, profile.label)}
              disabled={!!loadingId}
              className="group relative flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden text-center disabled:opacity-50"
            >
              <div className={`p-4 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${profile.bg}`}>
                {loadingId === profile.id ? (
                  <Loader2 className={`w-8 h-8 animate-spin ${profile.color}`} />
                ) : (
                  <profile.icon className={`w-8 h-8 ${profile.color}`} />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors">
                {profile.label}
              </h3>
            </button>
          ))}
        </div>

        {/* Separator */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">Sistema Restringido</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* SuperAdmin Lock */}
        <div className="flex justify-center">
          <button
            onClick={handleAdminClick}
            className="group relative px-10 py-5 bg-[#050505] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-cyan-400 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-cyan-300 font-bold tracking-wide">ADMINISTRADORES</span>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-500 -z-10"></div>
          </button>
        </div>

      </div>
    </div>
  )
}
