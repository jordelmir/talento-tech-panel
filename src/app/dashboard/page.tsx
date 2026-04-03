'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Activity } from 'lucide-react'

export default function DashboardRouter() {
  const router = useRouter()
  const [status, setStatus] = useState('Verificando acceso...')
  const supabase = createClient()

  useEffect(() => {
    const handleRouting = async () => {
      // 1. Verificar Sesión
      const { data: { session }, error: authError } = await supabase.auth.getSession()

      if (authError || !session) {
        setStatus('Sesión no encontrada. Redirigiendo...')
        router.replace('/login')
        return
      }

      // 2. Obtener Rol del Usuario
      // El Trigger ya debió haber creado el perfil y el rol.
      setStatus('Obteniendo privilegios...')
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (roleError || !roles) {
        // Si no hay rol (caso extraño), reintentar o enviar a student por defecto
        console.error('Role not found, defaulting to student.')
        router.replace('/student')
        return
      }

      // 3. Redirección Inteligente
      setStatus(`Acceso concedido como ${roles.role}. Redirigiendo...`)
      
      switch (roles.role) {
        case 'superadmin':
        case 'admin':
          // router.replace('/admin') // Pendiente por implementar
          router.replace('/teacher') 
          break
        case 'teacher':
          router.replace('/teacher')
          break
        case 'student':
        default:
          router.replace('/student')
          break
      }
    }

    handleRouting()
  }, [router, supabase])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center font-sans">
      <div className="text-center space-y-4">
        <Activity className="w-12 h-12 text-emerald-500 animate-pulse mx-auto" />
        <p className="text-gray-400 text-sm font-medium tracking-wider uppercase">{status}</p>
      </div>
    </div>
  )
}
