"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { addWeeks } from 'date-fns'

export default function NuevaCitaPage() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [pacienteId, setPacienteId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [esRecurrente, setEsRecurrente] = useState(false)
  const [numeroSemanas, setNumeroSemanas] = useState(4)
  const [cargando, setCargando] = useState(false)

  // Generamos los bloques de 15 minutos (Ej: de 08:00 a 20:00)
  const generarBloquesHorarios = () => {
    const bloques = []
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 15) {
        const horaFormateada = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        bloques.push(horaFormateada)
      }
    }
    return bloques
  }
  const opcionesHora = generarBloquesHorarios()

  useEffect(() => {
    const obtenerPacientes = async () => {
      const { data } = await supabase.from('pacientes').select('id, nombre').order('nombre')
      if (data) setPacientes(data)
    }
    obtenerPacientes()
  }, [])

  const guardarCita = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    const fechaBase = new Date(`${fecha}T${hora}`)
    const citasAInsertar = []

    if (esRecurrente) {
      for (let i = 0; i < numeroSemanas; i++) {
        const fechaIteracion = addWeeks(fechaBase, i)
        citasAInsertar.push({
          paciente_id: pacienteId,
          fecha_hora: fechaIteracion.toISOString(),
          estado_pago: false
        })
      }
    } else {
      citasAInsertar.push({
        paciente_id: pacienteId,
        fecha_hora: fechaBase.toISOString(),
        estado_pago: false
      })
    }

    const { error } = await supabase
      .from('citas')
      .insert(citasAInsertar)

    if (error) {
      alert("Error al agendar: " + error.message)
    } else {
      alert(esRecurrente ? `¡${numeroSemanas} citas agendadas con éxito!` : "¡Cita agendada con éxito!")
      router.push('/agenda')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Agendar Nueva Sesión</h2>

        <form onSubmit={guardarCita} className="space-y-5">
          {/* Selector de Paciente */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Seleccionar Paciente</label>
            <select 
              required
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="">-- Elige un paciente --</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fecha Inicio</label>
              <input 
                type="date" 
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white color-scheme-light dark:color-scheme-dark"
              />
            </div>
            {/* Nuevo Selector de Hora con diseño limpio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Hora</label>
              <select 
                required
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">-- Selecciona --</option>
                {opcionesHora.map((opcion) => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Opciones de Recurrencia */}
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={esRecurrente}
                onChange={(e) => setEsRecurrente(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-slate-700 dark:text-slate-300">Sesión Recurrente (Semanal)</span>
            </label>
            
            {esRecurrente && (
              <div className="pl-8 pt-2">
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">¿Cuántas semanas seguidas?</label>
                <input 
                  type="number" 
                  min="2" 
                  max="12"
                  value={numeroSemanas || ''}
                  onChange={(e) => setNumeroSemanas(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Se agendarán {numeroSemanas} sesiones en total a partir de la fecha seleccionada.
                </p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className={`w-full py-4 rounded-xl font-bold text-white transition shadow-lg ${cargando ? 'bg-slate-400 dark:bg-slate-600' : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'}`}
          >
            {cargando ? 'Guardando...' : 'Confirmar Cita(s)'}
          </button>
          
          <button 
            type="button"
            onClick={() => router.back()}
            className="w-full text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-slate-700 dark:hover:text-slate-200"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  )
}