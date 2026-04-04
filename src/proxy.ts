import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Módulo Core del Arquitecto: Enrutamiento Semántico y Seguridad Fronteriza
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Verificación de Seguridad Básica (¿Está autenticado?)
  const { data: { user } } = await supabase.auth.getUser()

  const isPublicPage = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/login') ||
                       request.nextUrl.pathname.startsWith('/genesis') ||
                       request.nextUrl.pathname.startsWith('/curriculum') ||
                       request.nextUrl.pathname.startsWith('/docs') ||
                       request.nextUrl.pathname.startsWith('/auth/callback') ||
                       request.nextUrl.pathname.startsWith('/api/webhooks')

  // Si no hay usuario y no es una página pública -> Redirigir a Login
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Rutero Automático: Si ya tiene sesión y entra a la Landing o Login (no al callback!), mandarlo al Dashboard
  if (user && (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/login'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Intercepta TODAS las rutas excepto archivos estáticos (imágenes, favicons)
     * para garantizar que NADIE acceda al Orquestador sin autenticarse.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
