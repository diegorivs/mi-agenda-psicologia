import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Preparamos la respuesta base
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Creamos el punto de control usando el nuevo estándar SSR
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

  // 3. Verificamos rigurosamente si el usuario existe y está autorizado
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Si el visitante NO está logueado e intenta entrar a zonas privadas, se le rechaza
  if (!user && (request.nextUrl.pathname.startsWith('/agenda') || request.nextUrl.pathname.startsWith('/pacientes'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// Le decimos al guardia qué pasillos debe vigilar
export const config = {
  matcher: [
    '/agenda/:path*',
    '/pacientes/:path*'
  ],
}