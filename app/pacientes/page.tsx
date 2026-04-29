"use client"

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function ListaPacientes() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  // Esta función "trae" los datos de Supabase
  const obtenerPacientes = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('nombre', { ascending: true })

      if (error) throw error
      setPacientes(data || [])
    } catch (error) {
      console.error("Error cargando pacientes:", error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    obtenerPacientes()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Mis Pacientes</h1>
          <Link 
            href="/nuevo-paciente"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Nuevo Paciente
          </Link>
        </div>

        {cargando ? (
          <p className="text-center text-slate-500">Cargando base de datos...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Nombre</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">RUT</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Celular</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{paciente.nombre}</td>
                    <td className="px-6 py-4 text-slate-500">{paciente.rut}</td>
                    <td className="px-6 py-4 text-slate-500">{paciente.celular}</td>
                    <td className="px-6 py-4">
                      <Link href={`/pacientes/${paciente.id}`} className="text-blue-600 hover:underline text-sm font-medium mr-4">Ver Ficha</Link>
                      <button className="text-green-600 hover:underline text-sm font-medium">Nueva Cita</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {pacientes.length === 0 && (
              <div className="p-10 text-center text-slate-400">
                No hay pacientes registrados aún.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
