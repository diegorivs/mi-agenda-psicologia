"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Users, UserPlus, Inbox, Settings, LogOut, Activity } from 'lucide-react'

// 1. IMPORTAMOS EL NUEVO COMPONENTE AUTÓNOMO
import UserProfileDropdown from '../../components/UserProfileDropdown'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    { name: 'Mi Agenda', href: '/agenda', icon: Calendar },
    { name: 'Solicitudes', href: '/solicitudes', icon: Inbox },
    { name: 'Directorio Pacientes', href: '/pacientes', icon: Users },
    { name: 'Nuevo Paciente', href: '/nuevo-paciente', icon: UserPlus },
  ]

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      
      {/* BARRA LATERAL (SIDEBAR) SE MANTIENE INTACTA */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex z-20">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-2xl tracking-tight">
            <Activity size={28} />
            <span>MediBlock</span>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
            Profesional
          </span>
        </div>

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

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
           <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50 rounded-xl font-bold transition-colors">
              <Settings size={20} className="text-slate-400" />
              Configuración
           </button>
           {/* Puedes mantener o quitar este botón redundante del sidebar si lo deseas */}
        </div>
      </aside>

      {/* ÁREA DERECHA: HEADER INVISIBLE + CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* 2. HEADER INTERNO: Solo para el Dropdown en la esquina superior derecha */}
        <header className="h-16 flex items-center justify-end px-6 z-10 mt-2">
           <UserProfileDropdown />
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>

    </div>
  )
}