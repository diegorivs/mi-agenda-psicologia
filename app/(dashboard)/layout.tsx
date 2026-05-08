"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, UserPlus, Inbox, Settings, LogOut, Activity } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Aquí definimos los botones de nuestra barra lateral
  const menuItems = [
    { name: 'Mi Agenda', href: '/agenda', icon: Calendar },
    { name: 'Solicitudes', href: '/solicitudes', icon: Inbox },
    { name: 'Directorio Pacientes', href: '/pacientes', icon: Users },
    { name: 'Nuevo Paciente', href: '/nuevo-paciente', icon: UserPlus },
  ]

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        
        {/* Logo de MediBlock */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-2xl tracking-tight">
            <Activity size={28} />
            <span>MediBlock</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
            Profesional
          </span>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Zona Inferior (Configuración y Salida) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
           <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50 rounded-xl font-bold transition-colors">
              <Settings size={20} className="text-slate-400" />
              Configuración
           </button>
           <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-xl font-bold transition-colors">
              <LogOut size={20} className="text-red-400" />
              Cerrar Sesión
           </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Aquí adentro es donde Next.js inyectará automáticamente las pantallas de agenda, pacientes, etc. */}
        {children}
      </main>

    </div>
  )
}