export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Barra de navegación simple */}
      <nav className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">MediBlock <span className="text-slate-400 font-light">| Gestión Médica</span></h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Iniciar Sesión
        </button>
      </nav>

      <main className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-5xl font-extrabold mb-6 tracking-tight">
          La forma más simple de gestionar <br /> 
          <span className="text-blue-600">tus pacientes y cobros.</span>
        </h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Diseñado para psicólogos que buscan simplificar su agenda manual y automatizar sus pagos en un solo lugar.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Tarjeta 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto">
              📅
            </div>
            <h3 className="text-2xl font-bold mb-4">Para el Profesional</h3>
            <p className="text-slate-500 mb-6">Gestiona tus horarios, bloquea horas y ve tus ingresos mensuales.</p>
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50">
              Ver Demo de Agenda
            </button>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto">
              💳
            </div>
            <h3 className="text-2xl font-bold mb-4">Para el Paciente</h3>
            <p className="text-slate-500 mb-6">Reserva de horas inmediata con pago integrado vía Stripe o Mercado Pago.</p>
            <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
              Reservar y Pagar
            </button>
          </div>
        </div>
      </main>

      <footer className="py-12 text-slate-400 text-sm text-center">
        Plataforma para profesionales de la salud mental • v0.1.0
      </footer>
    </div>
  );
}