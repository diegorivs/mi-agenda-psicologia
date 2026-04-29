"use client"

import { useState, useEffect, use } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, User, CheckCircle, Clock, FileText, Save } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function FichaPaciente({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)

  const [paciente, setPaciente] = useState<any>(null)
  const [citas, setCitas] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [guardandoNotaId, setGuardandoNotaId] = useState<string | null>(null)

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: pacienteData } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', id)
        .single()
      
      if (pacienteData) setPaciente(pacienteData)

      const { data: citasData } = await supabase
        .from('citas')
        .select('*')
        .eq('paciente_id', id)
        .order('fecha_hora', { ascending: false })

      if (citasData) setCitas(citasData || [])
      
      setCargando(false)
    }

    cargarDatos()
  }, [id])

  const togglePago = async (citaId: string, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual
    setCitas(prev => prev.map(c => c.id === citaId ? { ...c, estado_pago: nuevoEstado } : c))

    await supabase.from('citas').update({ estado_pago: nuevoEstado }).eq('id', citaId)
  }

  // FUNCIÓN PARA GUARDAR NOTAS CLÍNICAS
  const guardarNota = async (citaId: string, texto: string) => {
    setGuardandoNotaId(citaId)
    const { error } = await supabase
      .from('citas')
      .update({ notas: texto })
      .eq('id', citaId)

    if (error) {
      alert("Error al guardar la nota clínica.")
    }
    setGuardandoNotaId(null)
  }

  if (cargando) return <div className="min-h-screen flex items-center justify-center p-8 text-slate-500 dark:text-slate-400 font-medium">Cargando expediente clínico...</div>
  if (!paciente) return <div className="min-h-screen flex items-center justify-center p-8 text-red-500 font-bold">Registro no encontrado.</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{paciente.nombre}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Historial Clínico y Evolución</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Datos del Paciente */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <User size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Ficha Base</h2>
            </div>
            
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">RUT</p>
                <p className="text-slate-900 dark:text-white font-bold text-base">{paciente.rut}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold mb-1">Contacto</p>
                <p className="text-slate-900 dark:text-white font-medium text-base">{paciente.email}</p>
                <p className="text-slate-900 dark:text-white font-medium text-base">{paciente.celular}</p>
              </div>
            </div>
          </div>

          {/* Registro de Sesiones y Notas */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <Calendar size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Sesiones Realizadas</h2>
              </div>

              <div className="space-y-6">
                {citas.map(cita => (
                  <div key={cita.id} className="p-5 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm min-w-[60px] border border-slate-100 dark:border-slate-600">
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">{format(new Date(cita.fecha_hora), 'MMM', { locale: es })}</p>
                          <p className="text-lg font-black text-slate-800 dark:text-white">{format(new Date(cita.fecha_hora), 'dd')}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white capitalize">{format(new Date(cita.fecha_hora), 'EEEE, HH:mm', { locale: es })}</p>
                          <button 
                            onClick={() => togglePago(cita.id, cita.estado_pago)}
                            className={`flex items-center gap-1.5 text-[10px] font-black mt-1.5 px-2 py-1 rounded-md border transition-all ${
                              cita.estado_pago 
                                ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" 
                                : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                            }`}
                          >
                            {cita.estado_pago ? <CheckCircle size={12} /> : <Clock size={12} />}
                            {cita.estado_pago ? 'PAGADO' : 'PENDIENTE'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* SECCIÓN DE NOTAS CLÍNICAS */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <FileText size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Evolución de la Sesión</span>
                      </div>
                      <textarea 
                        defaultValue={cita.notas || ''}
                        placeholder="Escribe aquí los apuntes clínicos, anamnesis o tareas para el paciente..."
                        onBlur={(e) => guardarNota(cita.id, e.target.value)}
                        className="w-full min-h-[100px] p-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <div className="flex justify-end">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
                          {guardandoNotaId === cita.id ? 'Guardando cambios...' : 'Los cambios se guardan automáticamente al salir del cuadro.'}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}