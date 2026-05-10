"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../app/lib/supabase' // Ruta corregida
import { Search, UserCheck, AlertCircle, Loader2 } from 'lucide-react'

interface Profesional {
  id: string;
  nombre_completo: string;
  especialidad: string;
}

interface BuscadorProps {
  onSelectProfesional: (id: string | null) => void;
}

export default function BuscadorProfesional({ onSelectProfesional }: BuscadorProps) {
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState<Profesional[]>([])
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<Profesional | null>(null)
  
  // Nuevos estados para UX y Debugging
  const [cargando, setCargando] = useState(true)
  const [errorBd, setErrorBd] = useState<string | null>(null)

  // Fetching inicial: Traer a TODOS los profesionales activos al cargar el componente
  useEffect(() => {
    const cargarDirectorio = async () => {
      setCargando(true)
      setErrorBd(null)
      
      const { data, error } = await supabase
        .from('perfiles_profesionales')
        .select('id, nombre_completo, especialidad')
        .eq('activo', true)

      if (error) {
        console.error("Error al cargar profesionales:", error)
        setErrorBd(error.message)
      } else {
        console.log("Profesionales encontrados:", data) // <--- DEBUG: Ver en consola
        setResultados(data || [])
      }
      setCargando(false)
    }

    cargarDirectorio()
  }, []) // El array vacío asegura que se ejecute solo una vez al abrir la página

  // Filtrado puramente en el frontend (más rápido y sin gastar cuota de base de datos)
  const profesionalesFiltrados = resultados.filter(prof => 
    prof.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  )

  const manejarSeleccion = (prof: Profesional) => {
    setProfesionalSeleccionado(prof)
    setBusqueda('')
    onSelectProfesional(prof.id) 
  }

  const limpiarSeleccion = () => {
    setProfesionalSeleccionado(null)
    onSelectProfesional(null)
  }

  return (
    <div className="relative w-full mb-6">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        ¿Con quién deseas agendar?
      </label>

      {/* Mostrar error si la base de datos rechaza la conexión */}
      {errorBd && (
        <div className="mb-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} /> Error de conexión: {errorBd}
        </div>
      )}

      {profesionalSeleccionado ? (
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-full">
              <UserCheck size={18} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{profesionalSeleccionado.nombre_completo}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profesionalSeleccionado.especialidad}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={limpiarSeleccion}
            className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
          >
            Cambiar
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {cargando ? <Loader2 size={18} className="text-blue-500 animate-spin" /> : <Search size={18} className="text-slate-400" />}
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
            placeholder={cargando ? "Cargando profesionales..." : "Buscar por nombre..."}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            disabled={cargando}
          />
          
          {/* Lista desplegable automática */}
          {!cargando && profesionalesFiltrados.length > 0 && (
            <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
              {profesionalesFiltrados.map((prof) => (
                <li 
                  key={prof.id}
                  onClick={() => manejarSeleccion(prof)}
                  className="px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors"
                >
                  <p className="font-bold text-slate-900 dark:text-white">{prof.nombre_completo}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{prof.especialidad}</p>
                </li>
              ))}
            </ul>
          )}
          
          {!cargando && profesionalesFiltrados.length === 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white p-4 text-center text-sm text-slate-500 border border-slate-200 rounded-xl shadow-xl">
              No se encontraron profesionales con ese nombre.
            </div>
          )}
        </div>
      )}
    </div>
  )
}