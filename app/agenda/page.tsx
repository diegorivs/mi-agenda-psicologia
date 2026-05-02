"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // <-- Añadido para poder redireccionar

export default function AgendaPage() {
  const router = useRouter() // <-- Añadido
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [citas, setCitas] = useState<any[]>([])

  // Función para cerrar sesión (Añadida)
  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Función corregida: Extrae la semana EXACTA que estás viendo
  const cargarCitas = async () => {
    const inicio = startOfWeek(fechaSeleccionada, { weekStartsOn: 1 }).toISOString()
    const fin = endOfWeek(fechaSeleccionada, { weekStartsOn: 1 }).toISOString()

    const { data, error } = await supabase
      .from('citas')
      .select('*, pacientes(nombre)')
      .gte('fecha_hora', inicio)
      .lte('fecha_hora', fin)

    if (!error) setCitas(data || [])
  }

  useEffect(() => {
    cargarCitas()
  }, [fechaSeleccionada])

  const inicioSemana = startOfWeek(fechaSeleccionada, { weekStartsOn: 1 })
  const diasSemana = [...Array(7)].map((_, i) => addDays(inicioSemana, i))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabecera del Calendario */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">
              {format(fechaSeleccionada, 'MMMM yyyy', { locale: es })}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Gestiona tus sesiones y bloques horarios</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <button 
                onClick={() => setFechaSeleccionada(addDays(fechaSeleccionada, -7))}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setFechaSeleccionada(addDays(fechaSeleccionada, 7))}
                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* BOTÓN DE CERRAR SESIÓN AÑADIDO AQUÍ */}
            <button 
              onClick={cerrarSesion}
              className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 text-sm font-medium transition-colors mx-2"
            >
              Cerrar Sesión
            </button>

            <Link href="/agenda/nueva">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
                <Plus size={18} /> Nueva Cita
              </button>
            </Link>
            <Link href="/solicitudes" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-4 py-2 rounded-xl font-bold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition">
  Ver Solicitudes Pendientes
</Link>
          </div>
        </div>

        {/* Cuadrícula de la Semana */}
        <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          {diasSemana.map((dia, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 min-h-[500px]">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
                <span className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {format(dia, 'eee', { locale: es })}
                </span>
                <span className={`text-xl font-bold ${format(dia, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {format(dia, 'd')}
                </span>
              </div>
              
              <div className="p-2 space-y-2">
                {citas
                  .filter(cita => format(new Date(cita.fecha_hora), 'yyyy-MM-dd') === format(dia, 'yyyy-MM-dd'))
                  .map(cita => (
                    <div key={cita.id} className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-2 rounded text-xs shadow-sm">
                      <p className="font-bold text-blue-800 dark:text-blue-300">
                        {format(new Date(cita.fecha_hora), 'HH:mm')}
                      </p>
                      <p className="text-blue-700 dark:text-blue-400 truncate">
                        {cita.pacientes?.nombre}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}