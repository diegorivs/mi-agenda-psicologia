"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Menu, ChevronDown, User, LogOut } from 'lucide-react'

export default function Navbar() {
  // Estados simulados para maquetación
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const [userRole, setUserRole] = useState('guest') 

  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const simularLoginProfesional = () => { 
    setIsLoggedIn(true)
    setUserRole('profesional')
    setShowLoginDropdown(false) 
  }
  
  const simularLogout = () => { 
    setIsLoggedIn(false)
    setUserRole('guest')
    setShowProfileDropdown(false) 
  }

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      
      {/* PANEL DE DESARROLLADOR */}
      <div className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs py-1.5 flex justify-center gap-6 font-mono border-b border-amber-200 dark:border-amber-800/50">
        <span className="font-bold">DevMode Toggle:</span>
        <button onClick={simularLogout} className="underline hover:text-amber-600">Vista Visitante</button>
        <button onClick={simularLoginProfesional} className="underline hover:text-amber-600">Vista Profesional</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-xl tracking-tight hover:opacity-80 transition-opacity">
            <Activity size={24} />
            <span>MediBlock</span>
          </Link>

          {/* ENLACES CENTRALES CONDICIONALES */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Solo mostramos enlaces si NO está logeado (Visitante) */}
            {!isLoggedIn && (
              <Link href="/reservar" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors">
                Portal Pacientes
              </Link>
            )}
            {/* Si está logeado, esta zona central queda vacía y minimalista */}
          </div>

          {/* LADO DERECHO CONDICIONAL (Botones / Perfil) */}
          <div className="hidden md:flex items-center relative">
            {!isLoggedIn ? (
              // 1. VISTA VISITANTE: Dropdown de "Iniciar Sesión"
              <div className="relative">
                <button 
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                  className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 rounded-xl font-bold transition-all"
                >
                  Ingresar <ChevronDown size={16} />
                </button>

                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 overflow-hidden">
                    <Link href="/login" onClick={() => setShowLoginDropdown(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors">
                      Como profesional
                    </Link>
                    <Link href="/reservar" onClick={() => setShowLoginDropdown(false)} className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors">
                      Como paciente
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // 2. VISTA PROFESIONAL: Dropdown de Perfil
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold w-9 h-9 rounded-full flex items-center justify-center text-sm">
                    DR
                  </div>
                  <ChevronDown size={16} className="text-slate-500" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Dr. Diego Rivera</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">contacto@mediblock.cl</p>
                    </div>
                    <div className="py-1">
                      <Link href="/agenda" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <User size={16} className="text-slate-400" /> Mi perfil de agendamiento
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 py-1 mt-1">
                      <button onClick={simularLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={16} /> Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}