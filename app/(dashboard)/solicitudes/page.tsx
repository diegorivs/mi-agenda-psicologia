"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, X, Clock, User, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react'

export default function PanelSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  // 1. CARGAR LAS SOLICITUDES PENDIENTES AISLADAS POR PROFESIONAL
  const cargarSolicitudes = async () => {
    setCargando(true)

    // A. OBTENER IDENTIDAD: Verificamos quién es el profesional conectado
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setCargando(false)
      return // Detenemos la operación si por algún motivo no hay sesión
    }

    // B. CONSULTA AISLADA: Traemos las citas pendientes Y los datos del paciente
    const { data, error } = await supabase
      .from('citas')
      .select('*, pacientes(*)')
      .eq('profesional_id', user.id) // <--- EL FILTRO DE AISLAMIENTO ESTRICTO
      .eq('estado_cita', 'pendiente')
      .order('fecha_hora', { ascending: true })

    if (error) {
      console.error("Error al cargar solicitudes:", error)
    } else {
      setSolicitudes(data || [])
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  // 2. FUNCIÓN PARA APROBAR (Pasa a estado 'confirmada')
  const aprobarSolicitud = async (citaId: string) => {
    // Actualizamos visualmente de inmediato
    setSolicitudes(prev => prev.filter(req => req.id !== citaId))
    
    // Impactamos la base de datos
    const { error } = await supabase
      .from('citas')
      .update({ estado_cita: 'confirmada' })
      .eq('id', citaId)

    if (error) {
      alert("Error al aprobar la cita en el servidor.")
      cargarSolicitudes() // Revertir en caso de error
    }
  }

  // 3. FUNCIÓN PARA RECHAZAR (Pasa a estado 'rechazada' para mantener registro histórico)
  const rechazarSolicitud = async (citaId: string) => {
    setSolicitudes(prev => prev.filter(req => req.id !== citaId))
    
    const { error } = await supabase
      .from('citas')
      .update({ estado_cita: 'rechazada' })
      .eq('id', citaId)

    if (error) {
      alert("Error al rechazar la cita en el servidor.")
      cargarSolicitudes()
    }
  }
// Función para curar el "jetlag" de la base de datos
  const obtenerFechaLocal = (fechaString: string) => {
    // Cortamos la cola de la zona horaria (+00:00 o Z) para que JS no reste las 4 horas de Chile
    const fechaSinZona = fechaString.split('+')[0].split('Z')[0]
    return new Date(fechaSinZona)
  }
  if (cargando) return <div className="min-h-screen flex items-center justify-center p-8 text-slate-500 font-medium">Buscando solicitudes en el buzón...</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera del Panel */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Solicitudes Pendientes</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Triage de pacientes. Revisa y confirma las horas solicitadas a través del portal web.
          </p>
        </div>

        {/* Zona de Tarjetas */}
        {solicitudes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <Check className="text-green-600 dark:text-green-400" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">¡Todo al día!</h3>
            <p className="text-slate-500 dark:text-slate-400">No hay nuevas solicitudes de horas esperando tu revisión.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solicitudes.map((solicitud) => (
              <div key={solicitud.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                
                {/* Banner superior con fecha */}
                <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold">
                    <Clock size={18} />
                    <span className="capitalize">{format(obtenerFechaLocal(solicitud.fecha_hora), "EEEE dd 'de' MMMM", { locale: es })}</span>
                  </div>
                  <span className="bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-black px-3 py-1 rounded-lg text-sm">
                    {format(obtenerFechaLocal(solicitud.fecha_hora), "HH:mm")} hrs
                  </span>
                </div>

                {/* Cuerpo de la tarjeta: Datos del Paciente */}
                <div className="p-6 flex-grow space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full shrink-0">
                      <User size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{solicitud.pacientes?.nombre}</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">RUT: {solicitud.pacientes?.rut}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Phone size={16} className="text-slate-400" />
                      <span className="font-medium">{solicitud.pacientes?.celular}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <Mail size={16} className="text-slate-400" />
                      <span className="font-medium truncate">{solicitud.pacientes?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700 border-t border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={() => rechazarSolicitud(solicitud.id)}
                    className="flex items-center justify-center gap-2 py-4 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    <X size={18} />
                    Rechazar
                  </button>
                  <button 
                    onClick={() => aprobarSolicitud(solicitud.id)}
                    className="flex items-center justify-center gap-2 py-4 text-green-600 dark:text-green-400 font-bold hover:bg-green-50 dark:hover:bg-green-900/20 transition"
                  >
                    <Check size={18} />
                    Aprobar Cita
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}