"use client"

import { useState } from 'react'
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { ArrowLeft, User, CheckCircle2, Loader2, Mail, Phone, Fingerprint } from 'lucide-react'

export default function PortalReserva() {
  // Estados de selección
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null)
  
  // Estados del flujo
  const [paso, setPaso] = useState(1) // 1: Fecha/Hora, 2: Formulario, 3: Éxito
  const [cargando, setCargando] = useState(false)

  // Estados del Formulario
  const [nombre, setNombre] = useState('')
  const [rut, setRut] = useState('')
  const [email, setEmail] = useState('')
  const [celular, setCelular] = useState('')

  const generarBloques = (horaInicio: number, horaFin: number) => {
    const bloques = []
    for (let h = horaInicio; h <= horaFin; h++) {
      bloques.push(`${h.toString().padStart(2, '0')}:00`)
      if (h !== horaFin) bloques.push(`${h.toString().padStart(2, '0')}:30`)
    }
    return bloques
  }

  const horasManana = generarBloques(8, 13)
  const horasTarde = generarBloques(14, 21)
  const diasDisponibles = Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i))

  const handleFinalizarReserva = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    try {
      // 1. Buscar si el paciente ya existe por RUT
      let { data: pacienteExistente } = await supabase
        .from('pacientes')
        .select('id')
        .eq('rut', rut)
        .single()

      let pacienteId = pacienteExistente?.id

      // 2. Si no existe, lo creamos
      if (!pacienteId) {
        const { data: nuevoPaciente, error: errorP } = await supabase
          .from('pacientes')
          .insert([{ nombre, rut, email, celular }])
          .select()
          .single()
        
        if (errorP) throw errorP
        pacienteId = nuevoPaciente.id
      }

      // 3. Creamos la cita con estado 'pendiente'
      const fechaHoraString = `${format(fechaSeleccionada!, 'yyyy-MM-dd')}T${horaSeleccionada}:00`
      
      const { error: errorC } = await supabase
        .from('citas')
        .insert([{
          paciente_id: pacienteId,
          fecha_hora: fechaHoraString,
          estado_pago: false,
          estado_cita: 'pendiente' // Aquí queda esperando aprobación del profesional
        }])

      if (errorC) throw errorC

      setPaso(3) // Pasamos a la pantalla de éxito
    } catch (error) {
      console.error(error)
      alert("Hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente.")
    } finally {
      setCargando(false)
    }
  }

  // PANTALLA DE ÉXITO
  if (paso === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 border border-slate-100">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 size={60} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900">¡Solicitud Enviada!</h1>
          <p className="text-slate-600 leading-relaxed">
            Tu reserva para el día <span className="font-bold">{format(fechaSeleccionada!, "dd 'de' MMMM", { locale: es })}</span> a las <span className="font-bold">{horaSeleccionada}</span> ha sido recibida.
          </p>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-amber-800 text-sm font-medium">
            El profesional revisará tu solicitud y recibirás una confirmación a tu correo a la brevedad.
          </div>
          <Link href="/" className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition">
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => paso === 2 ? setPaso(1) : window.location.href = '/'} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-medium"
          >
            <ArrowLeft size={20} />
            {paso === 2 ? 'Volver a seleccionar hora' : 'Inicio'}
          </button>
          <div className="text-xl font-black text-blue-600">MediBlock</div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
          
          {paso === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-slate-800 mb-8">Selecciona tu horario</h1>
              
              {/* Carrusel de Días */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">¿Qué día?</h2>
                  <span className="text-sm font-semibold text-slate-500 capitalize">{format(new Date(), 'MMMM yyyy', { locale: es })}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {diasDisponibles.map((dia, i) => {
                    const esSeleccionado = fechaSeleccionada?.toDateString() === dia.toDateString()
                    return (
                      <button key={i} onClick={() => {setFechaSeleccionada(dia); setHoraSeleccionada(null)}} className={`min-w-[80px] p-4 rounded-2xl flex flex-col items-center transition-all ${esSeleccionado ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                        <span className="text-xs font-bold uppercase mb-1">{format(dia, 'EEE', { locale: es })}</span>
                        <span className="text-2xl font-black">{format(dia, 'dd')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Matriz de Horas */}
              <div className={fechaSeleccionada ? 'opacity-100' : 'opacity-30 pointer-events-none'}>
                <h2 className="text-lg font-bold text-slate-800 mb-6">Bloques disponibles</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {[...horasManana, ...horasTarde].map(hora => (
                    <button key={hora} onClick={() => setHoraSeleccionada(hora)} className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${horaSeleccionada === hora ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'}`}>
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end">
                <button disabled={!horaSeleccionada} onClick={() => setPaso(2)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold disabled:bg-slate-100 disabled:text-slate-400 transition-all">
                  Continuar
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleFinalizarReserva} className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
                <p className="text-blue-800 font-bold mb-1">Resumen de tu cita:</p>
                <p className="text-blue-600 text-sm">
                  {format(fechaSeleccionada!, "EEEE dd 'de' MMMM", { locale: es })} a las {horaSeleccionada} hrs.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-800">Tus datos personales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Diego Rivas" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">RUT</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input required value={rut} onChange={(e) => setRut(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="12.345.678-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="diego@ejemplo.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">Teléfono Celular</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input required value={celular} onChange={(e) => setCelular(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="+56 9 1234 5678" />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={cargando}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                {cargando ? <Loader2 className="animate-spin" /> : 'Confirmar Solicitud de Hora'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}