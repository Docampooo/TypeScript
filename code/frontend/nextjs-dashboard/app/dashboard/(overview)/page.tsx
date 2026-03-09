import { Box } from '@mui/material';



'use client';

import { lusitana } from '@/app/ui/fonts';

const funciones = [
  {
    id: 1,
    titulo: 'Iniciar Motor',
    utilidad: 'Pone en marcha el sistema de bombeo principal, iniciando la circulacion activa del agua a traves del canal del raceway.',
    aplicaciones: ['Inicio de jornada de cultivo', 'Reinicio tras mantenimiento', 'Activacion del ciclo de oxigenacion'],
    icono: '▶',
    gradiente: 'from-blue-900 via-blue-800 to-cyan-900',
    acento: 'border-cyan-500',
    tag: 'bg-cyan-900 text-cyan-300',
  },
  {
    id: 2,
    titulo: 'Motor parado, Valvula abierta',
    utilidad: 'Permite el flujo pasivo del agua sin accion mecanica del motor, util para drenajes controlados o equilibrado de presiones.',
    aplicaciones: ['Drenaje parcial del canal', 'Equilibrado de niveles', 'Limpieza sin agitacion'],
    icono: '■',
    gradiente: 'from-blue-950 via-indigo-900 to-blue-900',
    acento: 'border-blue-400',
    tag: 'bg-blue-900 text-blue-300',
  },
  {
    id: 3,
    titulo: 'Motor encendido, Valvula abierta',
    utilidad: 'Estado optimo de operacion: flujo maximo con motor activo y valvulas abiertas. Maxima oxigenacion y circulacion del agua.',
    aplicaciones: ['Operacion normal de cultivo', 'Maxima oxigenacion de algas', 'Ciclos de alta produccion'],
    icono: '◈',
    gradiente: 'from-sky-900 via-blue-800 to-indigo-900',
    acento: 'border-sky-400',
    tag: 'bg-sky-900 text-sky-300',
  },
  {
    id: 4,
    titulo: 'Cerrar todo',
    utilidad: 'Cierre completo del sistema hidraulico. Aisla el circuito para prevenir perdidas y proteger los componentes mecanicos.',
    aplicaciones: ['Parada de emergencia', 'Mantenimiento programado', 'Inspeccion del sistema'],
    icono: '◉',
    gradiente: 'from-slate-900 via-blue-950 to-slate-900',
    acento: 'border-amber-500',
    tag: 'bg-amber-900 text-amber-300',
  },
  {
    id: 5,
    titulo: 'Direccion Opuesta',
    utilidad: 'Invierte el sentido del flujo en el canal. Util para limpiezas profundas y uniformidad del cultivo a lo largo del raceway.',
    aplicaciones: ['Limpieza profunda del canal', 'Distribucion uniforme de nutrientes', 'Prevencion de sedimentos'],
    icono: '◎',
    gradiente: 'from-blue-900 via-cyan-900 to-teal-900',
    acento: 'border-teal-400',
    tag: 'bg-teal-900 text-teal-300',
  },
];

const stats = [
  { valor: '5', label: 'Modos de operacion' },
  { valor: '24/7', label: 'Monitoreo continuo' },
  { valor: '100%', label: 'Control remoto' },
  { valor: 'IoT', label: 'Conectividad en tiempo real' },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-950/60 via-gray-950 to-gray-950" />
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #3b82f6 0%, transparent 60%)' }}
        />
        <div className="relative z-10 max-w-3xl">
          <span className="mb-4 inline-block rounded-full border border-blue-700 bg-blue-950/60 px-4 py-1 text-xs uppercase tracking-widest text-blue-400">
            Sistema de control hidraulico
          </span>
          <p className={`${lusitana.className} mt-4 text-4xl font-bold leading-tight text-white md:text-6xl`}>
            Raceway
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Panel de Informacion
            </span>
          </p>
          <p className="mt-6 text-lg leading-relaxed text-blue-200/70">
            Sistema automatizado de gestion hidraulica para cultivo de microalgas.
            Controla el flujo, oxigenacion y circulacion del canal en tiempo real.
          </p>
        </div>
        <div className="relative z-10 mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-blue-800/40 bg-blue-950/40 px-6 py-4 text-center backdrop-blur">
              <p className={`${lusitana.className} text-3xl font-bold text-cyan-400`}>{s.valor}</p>
              <p className="mt-1 text-xs text-blue-300/70 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-blue-700 to-transparent opacity-40" />

      {/* Funciones */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className={`${lusitana.className} text-3xl font-bold text-white`}>
              Funciones del Sistema
            </p>
            <p className="mt-2 text-blue-400/70 text-sm uppercase tracking-widest">
              Utilidades y aplicaciones practicas
            </p>
          </div>
          <div className="space-y-6">
            {funciones.map((fn, i) => (
              <div
                key={fn.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border-l-4 ${fn.acento} bg-gradient-to-r ${fn.gradiente} p-6 shadow-lg md:flex-row md:items-start md:gap-8`}
              >
                <div className="pointer-events-none absolute right-6 top-4 text-8xl font-bold text-white/5 select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl text-white ring-1 ring-white/10 md:mb-0">
                  {fn.icono}
                </div>
                <div className="flex-1">
                  <p className={`${lusitana.className} text-xl font-bold text-white`}>
                    {fn.titulo}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-blue-200/80">
                    {fn.utilidad}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {fn.aplicaciones.map((ap) => (
                      <span
                        key={ap}
                        className={`rounded-full border border-white/10 ${fn.tag} px-3 py-1 text-xs font-medium`}
                      >
                        {ap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-blue-900/40 px-6 py-12 text-center">
        <p className="text-sm text-blue-400/50 uppercase tracking-widest">
          Universidad de Vigo &middot; Sistema IoT de control de raceway &middot; 2025
        </p>
      </section>

    </main>
  );
}