'use client';

//TODOS
//1 --> Boton tomar muestras y boton muestras automaticas por tiempo
//2 --> Mostrar los estados en el sistema
//3 --> get y post time settings

import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { FuncionMotor } from '@/app/tipos/raceway';
import { motorFunctions, funciones } from '@/app/data/raceway';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { toggleValvula } from '@/app/lib/actions';
import FuncionCard from '@/app/ui/dashboard/racewayCircuito/FuncionCard';
import FuncionInfoCard from '@/app/ui/dashboard/racewayCircuito/FuncionInfoCard';
import EstadoSistema from '@/app/ui/dashboard/racewayCircuito/EstadoSistema';
import RacewaySVG from '@/app/ui/dashboard/racewayCircuito/RacewaySVG';
import PageSkeleton from '@/app/ui/dashboard/racewayCircuito/pageskeleton';
import TimeSettingsPanel from '@/app/ui/dashboard/racewayCircuito/Timesettingspanel';


export default function Page() {

  const { estado, error: errorEstado, ultimaActualizacion } = useWebSocket('ws://localhost:8000/ws');

  const [cargando, setCargando] = useState<number | null>(null);
  const [exito, setExito] = useState<number | null>(null);
  const [errorId, setErrorId] = useState<number | null>(null);
  const [mensajeBloqueo, setMensajeBloqueo] = useState<string | null>(null);

  const ejecutar = async (fn: FuncionMotor) => {
    setCargando(fn.id);
    setErrorId(null);
    try {
      await fn.onClick();
      setExito(fn.id);
      setTimeout(() => setExito(null), 2000);
    } catch (e) {
      setErrorId(fn.id);
      setTimeout(() => setErrorId(null), 3000);
    } finally {
      setCargando(null);
    }
  };

  const handleValvula = async (valvula: string, estadoActual: boolean) => {
    try {
      await toggleValvula(valvula, !estadoActual);
      setMensajeBloqueo(null);
    } catch (e: any) {
      setMensajeBloqueo(e.message);
      setTimeout(() => setMensajeBloqueo(null), 3000);
    }
  };

  if (!estado && !errorEstado) return <PageSkeleton />;

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* ── Encabezado ── */}
        <div className="mb-6 text-center">
          <p className={`${lusitana.className} text-4xl font-bold text-blue-700 md:text-5xl`}>
            Gestion del Raceway
          </p>
          <p className="mt-3 text-sm uppercase tracking-widest text-gray-400">
            Visualizacion en tiempo real · haz clic en las valvulas para accionarlas
          </p>
          {ultimaActualizacion && (
            <p className="mt-1 text-sm text-gray-400">Actualizado: {ultimaActualizacion}</p>
          )}
        </div>

        {/* ── Mensajes ── */}
        {errorEstado && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-500">
            {errorEstado}
          </div>
        )}
        {mensajeBloqueo && (
          <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-600">
            Accion bloqueada: {mensajeBloqueo}
          </div>
        )}

        {/* ── Leyenda ── */}
        <div className="mb-4 flex flex-wrap justify-center gap-5 text-sm text-gray-500">
          <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-algae-500" /> Valvula abierta</span>
          <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-red-400" /> Valvula cerrada</span>
          <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-gray-300" /> Valvula bloqueada</span>
          <span className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-algae-400" /> Sensor activo</span>
        </div>

        {/* ── SVG + Estado ── */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <RacewaySVG estado={estado} onValvula={handleValvula} />
          </div>
          <div className="w-56 shrink-0 space-y-3">
            <EstadoSistema
              estado={estado}
              error={null}
              ultimaActualizacion={ultimaActualizacion}
            />
            <TimeSettingsPanel/>
          </div>
        </div>

        {/* ── Niveles ── */}
        {estado && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: 'Salida',          nivel: estado.dep_cosecha?.nivel   ?? 0, color: 'bg-sky-500' },
              { label: 'Deposito CO2/O2', nivel: estado.dep_cultivo?.nivel ?? 0, color: 'bg-purple-400' },
              { label: 'Raceway',         nivel: estado.dep_raceway?.nivel  ?? 0, color: 'bg-algae-500' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <p className="mb-1.5 text-xs uppercase tracking-widest text-gray-400">{item.label}</p>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div className={`h-1.5 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.nivel}%` }} />
                </div>
                <p className="mt-1 text-right text-xs font-bold text-gray-700">{item.nivel}%</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Tarjetas acción motor ── */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {motorFunctions.map((fn) => (
            <FuncionCard
              key={fn.id}
              fn={fn}
              cargando={cargando === fn.id}
              exito={exito === fn.id}
              error={errorId === fn.id}
              onClick={() => ejecutar(fn)}
              disabled={cargando !== null}
            />
          ))}
        </div>

        {/* ── Divisor ── */}
        <div className="my-8 h-px w-full bg-gray-200" />

        {/* ── Tarjetas info fases ── */}
        <div className="mb-6 text-center">
          <p className={`${lusitana.className} text-3xl font-bold text-blue-700`}>
            Descripcion de las Fases
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest text-gray-400">
            Utilidades y aplicaciones practicas
          </p>
          <div className="mx-auto mt-3 h-px w-16 bg-blue-200" />
        </div>

        <div className="space-y-4">
          {funciones.map((fn, i) => (
            <FuncionInfoCard key={fn.id} fn={fn} index={i} />
          ))}
        </div>

      </div>
    </main>
  );
}