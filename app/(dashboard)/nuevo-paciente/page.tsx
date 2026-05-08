"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, Fingerprint, Calendar as CalendarIcon, MapPin, Activity, Save, Loader2 } from 'lucide-react'

export default function NuevoPaciente() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  // Datos básicos originales
  const [nombre, setNombre] = useState('')
  const [rut, setRut] = useState('')
  const [email, setEmail] = useState('')
  const [celular, setCelular] = useState('')

  // Nuevos campos de anamnesis
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [sexo, setSexo] = useState('')
  const [prevision, setPrevision] = useState('')
  const [direccion, setDireccion] = useState('')
  const [notasClinicas, setNotasClinicas] = useState('')

  const handleCrearPaciente = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      // Usamos el mismo objeto limpio que creamos en Supabase
      const { data, error } = await supabase
        .from('pacientes')
        .insert([{ 
          nombre, 
          rut, 
          email, 
          celular,
          fecha_nacimiento: fechaNacimiento || null, // Si está vacío, mandamos null, no string vacío
          sexo,
          prevision,
          direccion,
          notas_clinicas: notasClinicas
        }])
        .select()
        .single()

      if (error) throw error

      // Si todo sale bien, lo redirigimos a la nueva ficha del paciente
      router.push(`/pacientes/${data.id}`)
      
    } catch (error) {
      console.error(error)
      alert('Error al crear el paciente. Revisa la consola.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <Link href="/pacientes" className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ingresar Paciente</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Abre una nueva ficha clínica en el sistema.</p>
          </div>
        </div>

        <form onSubmit={handleCrearPaciente} className="space-y-8">
          
          {/* BLOQUE 1: Identidad y Contacto */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <User className="text-blue-500" size={20} /> Identificación
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Nombre Completo *</label>
                <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ej: Juan Pérez" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">RUT *</label>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input required value={rut} onChange={(e) => setRut(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="12.345.678-9" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input value={celular} onChange={(e) => setCelular(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="+56 9..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="correo@ejemplo.com" />
                </div>
              </div>
            </div>
          </div>

          {/* BLOQUE 2: Datos Clínicos y Demográficos */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Activity className="text-emerald-500" size={20} /> Datos Demográficos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Fecha de Nacimiento</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white [color-scheme:light_dark]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Sexo Biológico</label>
                <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none">
                  <option value="">Seleccionar...</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Previsión de Salud</label>
                <select value={prevision} onChange={(e) => setPrevision(e.target.value)} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none">
                  <option value="">Seleccionar...</option>
                  <option value="Fonasa">Fonasa</option>
                  <option value="Isapre Banmédica">Isapre Banmédica</option>
                  <option value="Isapre Colmena">Isapre Colmena</option>
                  <option value="Isapre Consalud">Isapre Consalud</option>
                  <option value="Isapre CruzBlanca">Isapre CruzBlanca</option>
                  <option value="Isapre Nueva Masvida">Isapre Nueva Masvida</option>
                  <option value="Particular">Particular</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Calle, Número, Comuna" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400">Notas de Ingreso (Antecedentes Relevantes)</label>
                <textarea 
                  value={notasClinicas} 
                  onChange={(e) => setNotasClinicas(e.target.value)} 
                  rows={4}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none" 
                  placeholder="Información adicional que deba tenerse en cuenta antes de la primera sesión..." 
                />
              </div>

            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={cargando}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {cargando ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              Guardar Ficha Clínica
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}