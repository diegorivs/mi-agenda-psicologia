"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { format, differenceInYears, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowLeft, User, Mail, Phone, Fingerprint, Calendar as CalendarIcon, MapPin, Activity, Edit2, Save, X, FileText } from 'lucide-react'

export default function FichaPaciente() {
  const { id } = useParams()
  const [paciente, setPaciente] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  
  // Estado para el Modo Edición
  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const cargarPaciente = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(error)
    } else {
      setPaciente(data)
      setFormData(data) // Pre-llenamos el formulario de edición con los datos actuales
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarPaciente()
  }, [id])

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

    if (error) {
      alert("Error al actualizar la ficha")
    } else {
      setPaciente(formData) // Actualizamos la vista local
      setEditando(false) // Cerramos el modo edición
    }
  }

  // Calculadora de Edad Clínica
  const calcularEdad = (fechaNacimiento: string | null) => {
    if (!fechaNacimiento) return 'No registrada'
    const edad = differenceInYears(new Date(), parseISO(fechaNacimiento))
    return `${edad} años`
  }

  if (cargando) return <div className="min-h-screen flex items-center justify-center text-slate-500">Cargando ficha clínica...</div>
  if (!paciente) return <div className="min-h-screen flex items-center justify-center text-red-500">Paciente no encontrado.</div>

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Cabecera y Controles */}
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

        {/* Cuerpo de la Ficha Clínica */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Datos Duros */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                <User className="text-blue-500" size={18} /> Contacto
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teléfono</label>
                  {editando ? (
                    <input value={formData.celular || ''} onChange={e => setFormData({...formData, celular: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                  ) : (
                    <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><Phone size={16} className="text-slate-400"/> {paciente.celular || '-'}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo</label>
                  {editando ? (
                    <input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                  ) : (
                    <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><Mail size={16} className="text-slate-400"/> {paciente.email || '-'}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dirección</label>
                  {editando ? (
                    <input value={formData.direccion || ''} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                  ) : (
                    <div className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mt-1"><MapPin size={16} className="text-slate-400"/> {paciente.direccion || '-'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Central y Derecha: Anamnesis y Notas */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tarjeta de Biometría */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 mb-6">
                <Activity className="text-emerald-500" size={18} /> Biometría y Cobertura
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edad</label>
                  {editando ? (
                    <input type="date" value={formData.fecha_nacimiento || ''} onChange={e => setFormData({...formData, fecha_nacimiento: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                  ) : (
                    <div className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1">{calcularEdad(paciente.fecha_nacimiento)}</div>
                  )}
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nacimiento</label>
                  <div className="font-medium text-slate-700 dark:text-slate-300 mt-2">
                    {paciente.fecha_nacimiento ? format(parseISO(paciente.fecha_nacimiento), 'dd/MM/yyyy') : '-'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sexo</label>
                  {editando ? (
                    <select value={formData.sexo || ''} onChange={e => setFormData({...formData, sexo: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                      <option value="">-</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Masculino">Masculino</option>
                    </select>
                  ) : (
                    <div className="font-medium text-slate-700 dark:text-slate-300 mt-2">{paciente.sexo || '-'}</div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Previsión</label>
                  {editando ? (
                     <select value={formData.prevision || ''} onChange={e => setFormData({...formData, prevision: e.target.value})} className="w-full mt-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                        <option value="">-</option>
                        <option value="Fonasa">Fonasa</option>
                        <option value="Isapre Banmédica">Isapre Banmédica</option>
                        <option value="Isapre Colmena">Isapre Colmena</option>
                        <option value="Isapre Consalud">Isapre Consalud</option>
                        <option value="Isapre CruzBlanca">Isapre CruzBlanca</option>
                        <option value="Isapre Nueva Masvida">Isapre Nueva Masvida</option>
                        <option value="Particular">Particular</option>
                     </select>
                  ) : (
                    <div className="font-medium text-slate-700 dark:text-slate-300 mt-2">
                      <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-lg text-sm font-bold">
                        {paciente.prevision || '-'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tarjeta de Notas Clínicas */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                <FileText className="text-amber-500" size={18} /> Notas Clínicas / Antecedentes
              </h2>
              {editando ? (
                <textarea 
                  value={formData.notas_clinicas || ''} 
                  onChange={e => setFormData({...formData, notas_clinicas: e.target.value})}
                  rows={5} 
                  className="w-full p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 dark:text-white resize-none"
                  placeholder="Escribe aquí los antecedentes relevantes..."
                />
              ) : (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-slate-700 dark:text-slate-300 min-h-[100px] whitespace-pre-wrap">
                  {paciente.notas_clinicas ? paciente.notas_clinicas : <span className="text-amber-600/50 italic">Sin notas clínicas registradas. Haz clic en Editar Ficha para añadir antecedentes.</span>}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}