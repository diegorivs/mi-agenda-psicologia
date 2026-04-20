"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function NuevoPaciente() {
  // Estos son los "estados", funcionan como la memoria a corto plazo del formulario
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [estado, setEstado] = useState("");

  // Esta es la función que se ejecuta al hacer clic en "Guardar"
  const guardarPaciente = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar
    setEstado("Guardando paciente en la base de datos...");

    // Aquí enviamos los datos a la tabla 'pacientes' en Supabase
    const { error } = await supabase
      .from("pacientes")
      .insert([
        {
          nombre: nombre,
          rut: rut,
          email: email,
          celular: celular,
        },
      ]);

    // Verificamos si hubo un error (como el bloqueo de seguridad RLS)
    if (error) {
      setEstado(`Error clínico: ${error.message}`);
    } else {
      setEstado("¡Paciente ingresado con éxito al sistema!");
      // Limpiamos el formulario para el siguiente paciente
      setNombre("");
      setRut("");
      setEmail("");
      setCelular("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Ingreso de Nuevo Paciente
        </h2>

        <form onSubmit={guardarPaciente} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Nombre Completo</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">RUT</label>
            <input
              type="text"
              required
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="mt-1 block w-full bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 12.345.678-9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="paciente@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Celular</label>
            <input
              type="tel"
              required
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="mt-1 block w-full bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+56 9 1234 5678"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Guardar Ficha
          </button>
        </form>

        {/* Aquí mostramos los mensajes de éxito o error */}
        {estado && (
          <div className={`mt-4 p-3 rounded text-sm text-center font-medium ${estado.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {estado}
          </div>
        )}
      </div>
    </div>
  );
}
