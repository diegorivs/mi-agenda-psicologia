"use client"

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegistroProfesional() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // Nuevo estado para confirmar
  const [nombre, setNombre] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación de seguridad clínica
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, verifica.")
      return // Detenemos la ejecución aquí mismo
    }

    setCargando(true)

    // 1. Crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre_completo: nombre }
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Registro de Profesional</h1>
        <form onSubmit={handleRegistro} className="space-y-4">
          <input 
            required 
            placeholder="Nombre Médico / Profesional" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input 
            required 
            type="email" 
            placeholder="Correo institucional o personal" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          {/* Campo de Contraseña Original */}
          <input 
            required 
            type="password" 
            placeholder="Contraseña" 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {/* NUEVO Campo de Confirmar Contraseña */}
          <input 
            required 
            type="password" 
            placeholder="Confirmar Contraseña" 
            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none dark:bg-slate-900 dark:text-white transition-all ${
              confirmPassword && password !== confirmPassword 
                ? 'border-red-400 focus:ring-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* Mensaje visual sutil si no coinciden */}
          {confirmPassword && password !== confirmPassword && (
             <p className="text-red-500 text-xs font-medium ml-1">Las contraseñas no coinciden</p>
          )}

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all mt-4"
          >
            {cargando ? 'Creando cuenta...' : 'Crear Cuenta Profesional'}
          </button>
        </form>
      </div>
    </div>
  )
}