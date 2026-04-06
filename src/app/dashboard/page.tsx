'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useProfileStore } from '@/store/useProfileStore'
import { Loader2, ShieldCheck } from 'lucide-react'

// Hardcoded bypass emails
const SUPER_ADMINS = ['jordelmir@gmail.com', 'jzabalaa@mineducacion.gov.co']

function DashboardRouter() {
  const router = useRouter()
  const setProfile = useProfileStore((state) => state.setProfile)
  const [status, setStatus] = useState('Verificando credenciales...')
  const searchParams = useSearchParams()
  const forcedView = searchParams.get('view')

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    const handleRouting = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession()

      if (!isMounted) return

      if (authError || !session) {
        router.replace('/login')
        return
      }

      const email = session.user.email?.toLowerCase() || ''

      // 1. Regla de Super Administradores
      if (SUPER_ADMINS.includes(email)) {
        setStatus('Permisos de Super Administrador detectados.')
        
        // Impersonación Dinámica (God Mode)
        if (forcedView && ['escuela', 'colegio', 'universidad', 'profesores', 'familia'].includes(forcedView)) {
          setStatus(`Modo Simulación: Vista ${forcedView}...`)
          const labels: Record<string, string> = {
            'escuela': 'Escuela (Simulado)',
            'colegio': 'Colegio (Simulado)',
            'universidad': 'Universidad (Simulado)',
            'profesores': 'Profesores (Simulado)',
            'familia': 'Familia (Simulado)'
          }
          setProfile(labels[forcedView])
          router.replace(`/dashboard/${forcedView}`)
          return
        }

        // Default Admin behavior
        setProfile('Administrador')
        await supabase.auth.updateUser({
          data: { active_profile: 'admin', is_superadmin: true }
        })

        router.replace('/admin-panel')
        return
      }

      // 2. Regla para Usuarios Regulares
      const metadataProfile = session.user.user_metadata?.active_profile

      if (metadataProfile) {
        setStatus(`Perfil existente detectado. Rutando...`)
        
        const labels: Record<string, string> = {
          'escuela': 'Escuela',
          'colegio': 'Colegio',
          'universidad': 'Universidad',
          'profesores': 'Profesores',
          'familia': 'Familia'
        }
        
        setProfile(labels[metadataProfile] || metadataProfile)
        router.replace(`/dashboard/${metadataProfile}`)
        return
      }

      router.replace('/gateway')
    }

    handleRouting()

    return () => { isMounted = false }
  }, [router, setProfile, forcedView])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
      <p className="text-gray-400 font-medium animate-pulse tracking-wide">{status}</p>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-white">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
        <p className="font-mono text-xs opacity-50 animate-pulse tracking-widest uppercase">Initializing_Auth_Gateway...</p>
      </div>
    }>
      <DashboardRouter />
    </Suspense>
  )
}
