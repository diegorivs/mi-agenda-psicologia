"use client"

import { useState } from 'react'
import { ChevronDown, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // Importación crucial para redireccionar

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Función obligatoria de Logout con redirección
  const handleLogout = async () => {
    // 1. Aquí ejecutaremos el cierre real en la base de datos (Supabase)
    // await supabase.auth.signOut()
    
    // 2. Cerramos visualmente el menú
    setIsOpen(false)
    
    // 3. Redirección forzosa e inmediata a la Landing Page
    router.push('/') 
  }

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      >
        <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold w-9 h-9 rounded-full flex items-center justify-center text-sm">
          DR
        </div>
        <ChevronDown size={16} className="text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 overflow-hidden">
          
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Dr. Diego Rivera</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">contacto@mediblock.cl</p>
          </div>
          
          <div className="py-1">
            <Link 
              href="/agenda" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <User size={16} className="text-slate-400" /> Mi perfil de agendamiento
            </Link>
          </div>
          
          <div className="border-t border-slate-100 dark:border-slate-700 py-1 mt-1">
            <button 
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}