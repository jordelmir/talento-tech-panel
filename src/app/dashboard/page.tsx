'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useProfileStore } from '@/store/useProfileStore'
import { Loader2 } from 'lucide-react'

// Hardcoded bypass emails
const SUPER_ADMINS = ['jordelmir@gmail.com', 'jzabalaa@mineducacion.gov.co']

export default function DashboardRouter() {
  const router = useRouter()
  const setProfile = useProfileStore((state) => state.setProfile)
  const [status, setStatus] = useState('Verificando credenciales...')

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
        
        // Asignar en store
        setProfile('Administrador')

        // Asignar en base de datos de manera agnóstica a RLS usando metadata
        await supabase.auth.updateUser({
          data: { active_profile: 'admin', is_superadmin: true }
        })

        router.replace('/admin-panel')
        return
      }

      // 2. Regla para Usuarios Regulares
      // Comprobar si ya tienen un perfil activo en la base de datos
      const metadataProfile = session.user.user_metadata?.active_profile

      if (metadataProfile) {
        setStatus(`Perfil existente detectado. Rutando...`)
        
        // Mapea el valor de BD a la etiqueta visual del Header
        const labels: Record<string, string> = {
          'escuela': 'Escuela',
          'colegio': 'Colegio',
          'universidad': 'Universidad',
          'profesores': 'Profesores'
        }
        
        setProfile(labels[metadataProfile] || metadataProfile)
        router.replace(`/dashboard/${metadataProfile}`)
        return
      }

      // Si no tiene perfil, debe pasar por el Gateway
      setStatus('Redirigiendo a selección de perfil...')
      router.replace('/gateway')
    }

    handleRouting()

    return () => { isMounted = false }
  }, [router, setProfile])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
      <p className="text-gray-400 font-medium animate-pulse tracking-wide">{status}</p>
    </div>
  )
}
