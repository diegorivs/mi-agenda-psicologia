"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'
import { format, differenceInYears, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, User, Mail, Phone, MapPin, Activity, Edit2, Save, X, FileText, History, Plus, Loader2 } from 'lucide-react'

export default function FichaPaciente() {
  const { id } = useParams()
  
  // Estados del Paciente
  const [paciente, setPaciente] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState<any>({})

  // Estados de las Evoluciones
  const [evoluciones, setEvoluciones] = useState<any[]>([])
  const [nuevaEvolucion, setNuevaEvolucion] = useState('')
  const [guardandoEvolucion, setGuardandoEvolucion] = useState(false)

  // Función para obtener la hora local y evitar el "Jetlag"
  const obtenerFechaLocal = (fechaString: string) => {
    const fechaSinZona = fechaString.split('+')[0].split('Z')[0]
    return new Date(fechaSinZona)
  }

  const cargarDatos = async () => {
    setCargando(true)
    
    // 1. Cargar datos del paciente
    const { data: dataPaciente, error: errorPaciente } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single()

    if (errorPaciente) console.error("Error al cargar paciente:", errorPaciente)
    else {
      setPaciente(dataPaciente)
      setFormData(dataPaciente)
    }

    // 2. Cargar historial de evoluciones (Ordenadas de más nueva a más vieja)
    const { data: dataEvoluciones, error: errorEvoluciones } = await supabase
      .from('evoluciones')
      .select('*')
      .eq('paciente_id', id)
      .order('fecha_registro', { ascending: false })

    if (errorEvoluciones) console.error("Error al cargar evoluciones:", errorEvoluciones)
    else setEvoluciones(dataEvoluciones || [])

    setCargando(false)
  }

  useEffect(() => {
    cargarDatos()
  }, [id])

  // Guardar cambios demográficos del paciente
  const guardarCambios = async () => {
    const { error } = await supabase
      .from('pacientes')
      .update({
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.email,
        celular: formData.celular,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        sexo: formData.sexo,
        prevision: formData.prevision,
        direccion: formData.direccion,
        notas_clinicas: formData.notas_clinicas
      })
      .eq('id', id)

    if (error) alert("Error al actualizar la ficha")
    else {
      setPaciente(formData)
      setEditando(false)
    }
  }

  // Guardar una nueva evolución de sesión
  const agregarEvolucion = async () => {
    if (!nuevaEvolucion.trim()) return

    setGuardandoEvolucion(true)
    const { error } = await supabase
      .from('evoluciones')
      .insert([{
        paciente_id: id,
        contenido: nuevaEvolucion
      }])

    if (error) {
      alert("Error al guardar la evolución.")
    } else {
      setNuevaEvolucion('') // Limpiamos la caja de texto
      cargarDatos() // Recargamos para ver la nueva nota en la lista
    }
    setGuardandoEvolucion(false)
  }

  const calcularEdad = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return 'No registrada'
    return `${differenceInYears(new Date(), parseISO(fechaNacimiento))} años`
  }

  if (cargando) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Cargando expediente clínico...</div>
  if (!paciente) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Paciente no encontrado.</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* === CABECERA === */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/pacientes" className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">{editando ? 'Editando Ficha' : paciente.nombre}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">RUT: {paciente.rut}</p>
            </div>
          </div>

          <div>
            {editando ? (
              <div className="flex gap-3">
                <button onClick={() => {setFormData(paciente); setEditando(false)}} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-2">
                  <X size={18} /> Cancelar
                </button>
                <button onClick={guardarCambios} className="px-4 py-2 bg-green-600 text-white font-bold hover:bg-green-700 rounded-xl transition flex items-center gap-2 shadow-sm">
                  <Save size={18} /> Guardar
                </button>
              </div>
            ) : (
              <button onClick={() => setEditando(true)} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-xl transition flex items-center gap-2">
                <Edit2 size={18} /> Editar Ficha
              </button>
            )}
          </div>
        </div>

        {/* === CUERPO SUPERIOR: DATOS DEMOGRÁFICOS === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Contacto (Oculto el código repetido de contacto para brevedad, sigue igual que antes) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <User className="text-blue-500" size={18} /> Contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teléfono</label>
                  {editando ? <input value={formData.celular || ''} onChange={e => setFormData({...formData, celular: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" /> : <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><Phone size={16} className="text-slate-400"/> {paciente.celular || '-'}</div>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo</label>
                  {editando ? <input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" /> : <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><Mail size={16} className="text-slate-400"/> {paciente.email || '-'}</div>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dirección</label>
                  {editando ? <input value={formData.direccion || ''} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" /> : <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><MapPin size={16} className="text-slate-400"/> {paciente.direccion || '-'}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Central y Derecha: Biometría y Antecedentes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 mb-6">
                <Activity className="text-emerald-500" size={18} /> Biometría y Cobertura
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edad</label>
                  {editando ? <input type="date" value={formData.fecha_nacimiento || ''} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" /> : <div className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1">{calcularEdad(paciente.fecha_nacimiento)}</div>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sexo</label>
                  {editando ? <select value={formData.sexo || ''} onChange={e => setFormData({...formData, sexo: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"><option value="">-</option><option value="Femenino">Femenino</option><option value="Masculino">Masculino</option></select> : <div className="font-medium text-slate-700 dark:text-slate-300 mt-2">{paciente.sexo || '-'}</div>}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previsión</label>
                  {editando ? <select value={formData.prevision || ''} onChange={e => setFormData({...formData, prevision: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"><option value="">-</option><option value="Fonasa">Fonasa</option><option value="Isapre Banmédica">Isapre Banmédica</option><option value="Isapre Colmena">Isapre Colmena</option><option value="Isapre Consalud">Isapre Consalud</option><option value="Isapre CruzBlanca">Isapre CruzBlanca</option><option value="Particular">Particular</option></select> : <div className="font-medium text-slate-700 dark:text-slate-300 mt-2"><span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg text-sm font-bold">{paciente.prevision || '-'}</span></div>}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <FileText className="text-amber-500" size={18} /> Antecedentes Iniciales
              </h2>
              {editando ? (
                <textarea value={formData.notas_clinicas || ''} onChange={e => setFormData({...formData, notas_clinicas: e.target.value})} rows={3} className="w-full p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white resize-none" placeholder="Antecedentes relevantes..." />
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm">
                  {paciente.notas_clinicas ? paciente.notas_clinicas : <span className="text-amber-600/50 italic">Sin antecedentes registrados.</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === NUEVA SECCIÓN: HISTORIAL DE EVOLUCIONES === */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <History className="text-blue-600 dark:text-blue-400" size={24} /> Evoluciones Clínicas
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
              {evoluciones.length} Registros
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Formulario para agregar NUEVA evolución */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 md:p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <label className="block text-sm font-bold text-blue-800 dark:text-blue-400 mb-3">Nueva nota de sesión</label>
              <textarea 
                value={nuevaEvolucion} 
                onChange={e => setNuevaEvolucion(e.target.value)}
                rows={4} 
                className="w-full p-4 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none shadow-sm"
                placeholder="Escribe aquí los detalles, avances o tareas de la sesión de hoy..."
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={agregarEvolucion}
                  disabled={guardandoEvolucion || !nuevaEvolucion.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {guardandoEvolucion ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Guardar Evolución
                </button>
              </div>
            </div>

            {/* Listado Cronológico de Evoluciones */}
            <div className="space-y-6 pt-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              
              {evoluciones.length === 0 ? (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 italic">
                  No hay evoluciones registradas para este paciente.
                </div>
              ) : (
                evoluciones.map((evolucion, index) => (
                  <div key={evolucion.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* El punto de la línea de tiempo */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <FileText size={16} />
                    </div>
                    
                    {/* La tarjeta con la nota */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Sesión
                        </span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                          {format(obtenerFechaLocal(evolucion.fecha_registro), "dd MMM yyyy - HH:mm", { locale: es })}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {evolucion.contenido}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}