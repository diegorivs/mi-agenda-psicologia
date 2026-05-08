"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { Search, UserPlus, ChevronRight, User, Phone, Mail } from 'lucide-react'

export default function DirectorioPacientes() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // 1. EXTRAER TODOS LOS PACIENTES DE LA BASE DE DATOS
  const cargarPacientes = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .order('nombre', { ascending: true }) // Los ordenamos alfabéticamente por defecto

    if (error) {
      console.error("Error al cargar pacientes:", error)
    } else {
      setPacientes(data || [])
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarPacientes()
  }, [])

  // 2. MOTOR DE BÚSQUEDA (Filtro en tiempo real)
  const pacientesFiltrados = pacientes.filter(paciente => {
    const terminoBusqueda = busqueda.toLowerCase()
    const coincideNombre = paciente.nombre?.toLowerCase().includes(terminoBusqueda)
    const coincideRut = paciente.rut?.includes(terminoBusqueda)
    return coincideNombre || coincideRut
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera y Botón de Nuevo Paciente */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Directorio de Pacientes</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Gestiona todas las fichas clínicas de tu consulta.
            </p>
          </div>
          <Link 
            href="/nuevo-paciente" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={20} />
            Nuevo Paciente
          </Link>
        </div>

        {/* Barra de Búsqueda */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <Search className="text-slate-400 ml-2" size={24} />
          <input 
            type="text" 
            placeholder="Buscar paciente por nombre o RUT..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-lg"
          />
        </div>

        {/* Lista de Pacientes */}
        {cargando ? (
          <div className="text-center py-12 text-slate-500 font-medium">Cargando directorio...</div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full">
                <Search className="text-slate-400 dark:text-slate-500" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No hay resultados</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {busqueda ? "No encontramos ningún paciente que coincida con tu búsqueda." : "Aún no tienes pacientes registrados en el sistema."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {pacientesFiltrados.map((paciente) => (
                <Link 
                  href={`/pacientes/${paciente.id}`} 
                  key={paciente.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition group"
                >
                  
                  {/* Datos del Paciente en la lista */}
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {paciente.nombre}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">RUT: {paciente.rut}</p>
                    </div>
                  </div>

                  {/* Contacto rápido y Flecha */}
                  <div className="flex items-center justify-between sm:justify-end sm:gap-8 w-full sm:w-auto pl-14 sm:pl-0">
                    <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
                      {paciente.celular && (
                        <div className="flex items-center gap-2"><Phone size={14}/> {paciente.celular}</div>
                      )}
                      {paciente.email && (
                        <div className="flex items-center gap-2"><Mail size={14}/> {paciente.email}</div>
                      )}
                    </div>
                    <div className="text-slate-300 group-hover:text-blue-500 transition translate-x-0 group-hover:translate-x-1">
                      <ChevronRight size={24} />
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}