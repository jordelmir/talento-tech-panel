import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Módulo Core del Arquitecto: Enrutamiento Semántico y Seguridad Fronteriza
export async function middleware(request: NextRequest) {
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

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')

  // Si no hay usuario y no está en el login -> Bloqueado
  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Si es Lider/SuperAdmin y acabamos de atraparlo, se le enviará al Dashboard Total.
  // Aquí es donde consultaremos 'user_roles' más adelante para ruteo específico.
  // if (user) { ... verify role ... redirect to /dashboard/student OR /dashboard/teacher }

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
