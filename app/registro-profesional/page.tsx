"use client"

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegistroProfesional() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre_completo: nombre } // Guardamos el nombre en el metadata
      }
    })

    if (authError) {
      alert(authError.message)
    } else {
      // 2. Vincular el correo al rol de profesional en nuestra tabla
      await supabase
        .from('roles_usuarios')
        .insert([{ email: email, rol: 'profesional' }])

      alert("Cuenta profesional creada con éxito. Ahora puedes iniciar sesión.")
      router.push('/login')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Registro de Profesional</h1>
        <form onSubmit={handleRegistro} className="space-y-4">
          <input 
            required 
            placeholder="Nombre Médico / Profesional" 
            className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input 
            required 
            type="email" 
            placeholder="Correo institucional o personal" 
            className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            required 
            type="password" 
            placeholder="Contraseña" 
            className="w-full px-4 py-3 rounded-xl border dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            {cargando ? 'Creando cuenta...' : 'Crear Cuenta Profesional'}
          </button>
        </form>
      </div>
    </div>
  )
}