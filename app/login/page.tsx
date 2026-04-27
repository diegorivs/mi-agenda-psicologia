"use client"

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const iniciarSesion = async (e: React.FormEvent) => {
  e.preventDefault()
  setCargando(true)
  setErrorMsg(null)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setErrorMsg("Correo o contraseña incorrectos.")
      setCargando(false)
    } else {
      // Forzamos un refresco de la ruta para que el middleware lea la cookie
      router.refresh() 
      router.push('/agenda')
    }
  } catch (err) {
    setErrorMsg("Ocurrió un error de conexión.")
    setCargando(false)
  }
}

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Acceso Clínico
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Ingresa tus credenciales para acceder a la agenda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-700">
          <form className="space-y-6" onSubmit={iniciarSesion}>
            
            {/* Mostrar mensaje de error si las credenciales fallan */}
            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMsg}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:text-white transition-colors"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={cargando}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all ${
                  cargando 
                    ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
                }`}
              >
                {cargando ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
