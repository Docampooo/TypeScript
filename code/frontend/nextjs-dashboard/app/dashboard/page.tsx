'use client';

//TODOS
//5 --> time settings

import { useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { fase1Info, fase2Info, fase3Info, leyendaValvulas } from '@/app/data/raceway';
import { useWebSocket } from '@/app/hooks/useWebSocket';
import { toggleValvula } from '@/app/lib/actions';
import FaseCard from '@/app/ui/dashboard/racewayCircuito/FaseCard';
import FuncionInfoCard from '@/app/ui/dashboard/racewayCircuito/FuncionInfoCard';
import EstadoSistema from '@/app/ui/dashboard/racewayCircuito/EstadoSistema';
import RacewaySVG from '@/app/ui/dashboard/racewayCircuito/RacewaySVG';
import PageSkeleton from '@/app/ui/dashboard/racewayCircuito/pageskeleton';
import TimeSettingsPanel from '@/app/ui/dashboard/racewayCircuito/Timesettingspanel';

export default function Page() {

  const { estado, error: errorEstado, ultimaActualizacion } = useWebSocket('ws://localhost:8001/ws');

  const [cargandoValvula, setCargandoValvula] = useState<string | null>(null);
  const [mensajeBloqueo, setMensajeBloqueo]   = useState<string | null>(null);

  const handleValvula = async (valvula: string, estadoActual: boolean) => {
    setCargandoValvula(valvula);
    try {
      await toggleValvula(valvula, !estadoActual);
      setMensajeBloqueo(null);
    } catch (e: any) {
      setMensajeBloqueo(e.message);
      setTimeout(() => setMensajeBloqueo(null), 3000);
    } finally {
      setCargandoValvula(null);
    }
  };

  if (!estado && !errorEstado) return <PageSkeleton />;

  const r = estado?.dep_raceway;
  const d = estado?.dep_cultivo;
  const s = estado?.dep_cosecha;

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
          {leyendaValvulas.map((l) => (
            <span key={l.texto} className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full ${l.color}`} />
              {l.texto}
            </span>
          ))}
        </div>

        {/* ── SVG + Estado ── */}
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <RacewaySVG estado={estado} onValvula={handleValvula} />
          </div>
          <div className="w-56 shrink-0 space-y-3">
            <EstadoSistema estado={estado} error={null} />
            <TimeSettingsPanel />
          </div>
        </div>

        {/* ── Niveles ── */}
        {estado && (
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: 'Dep. Cosecha',  nivel: s?.nivel ?? 0, color: 'bg-sky-500' },
              { label: 'Dep. Cultivo',  nivel: d?.nivel ?? 0, color: 'bg-purple-400' },
              { label: 'Raceway',       nivel: r?.nivel ?? 0, color: 'bg-algae-500' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                <p className="mb-1.5 text-xs uppercase tracking-widest text-gray-400">{item.label}</p>
                <div className="h-1.5 w-full rounded-full bg-gray-100">
                  <div className={`h-1.5 rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.nivel}%` }} />
                </div>
                <p className="mt-1 text-right text-xs font-bold text-gray-700">{item.nivel}%</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Fase Cards ── */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Fase 1 — Dep. Raceway */}
          <FaseCard
            fase={1}
            deposito="Dep. Raceway"
            color="from-blue-800 to-blue-700"
            valvulas={[
              {
                id: 'v1',
                label: 'Llenado',
                abierta: r?.valvula_llenado ?? false,
                bloqueada: r?.sensor_maximo ?? false,
              },
            ]}
            vaciadoManual
            onValvula={handleValvula}
            cargando={cargandoValvula}
          />

          {/* Fase 2 — Dep. Cultivo */}
          <FaseCard
            fase={2}
            deposito="Dep. Cultivo"
            color="from-blue-600 to-blue-500"
            valvulas={[
              {
                id: 'v2',
                label: 'Llenado',
                abierta: d?.valvula_llenado ?? false,
              },
              {
                id: 'v3',
                label: 'Gases O₂+CO₂',
                abierta: d?.valvula_gas ?? false,
              },
              {
                id: 'v4',
                label: 'Vuelca al Raceway',
                abierta: d?.valvula_llenado_raceway ?? false,
              },
              {
                id: 'v5',
                label: 'Vaciado exterior',
                abierta: d?.valvula_vaciado ?? false,
              },
            ]}
            onValvula={handleValvula}
            cargando={cargandoValvula}
          />

          {/* Fase 3 — Dep. Cosecha */}
          <FaseCard
            fase={3}
            deposito="Dep. Cosecha"
            color="from-blue-400 to-blue-300"
            valvulas={[
              {
                id: 'v6',
                label: 'Llenado',
                abierta: s?.valvula_llenado ?? false,
                bloqueada: s?.sensor_maximo ?? false,
              },
            ]}
            vaciadoManual
            onValvula={handleValvula}
            cargando={cargandoValvula}
          />

        </div>

        {/* ── Divisor ── */}
        <div className="my-8 h-px w-full bg-gray-200" />

        {/* ── Fase 1 info ── */}
        <div className="mb-4 text-center">
          <p className={`${lusitana.className} text-2xl font-bold text-blue-700`}>Fase 1 — Dep. Raceway</p>
          <div className="mx-auto mt-2 h-px w-16 bg-blue-200" />
        </div>
        <div className="space-y-4">
          {fase1Info.map((fn, i) => <FuncionInfoCard key={fn.id} fn={fn} index={i} />)}
        </div>

        {/* ── Divisor ── */}
        <div className="my-8 h-px w-full bg-gray-200" />

        {/* ── Fase 2 info ── */}
        <div className="mb-4 text-center">
          <p className={`${lusitana.className} text-2xl font-bold text-blue-700`}>Fase 2 — Dep. Cultivo</p>
          <div className="mx-auto mt-2 h-px w-16 bg-blue-200" />
        </div>
        <div className="space-y-4">
          {fase2Info.map((fn, i) => <FuncionInfoCard key={fn.id} fn={fn} index={i} />)}
        </div>

        {/* ── Divisor ── */}
        <div className="my-8 h-px w-full bg-gray-200" />

        {/* ── Fase 3 info ── */}
        <div className="mb-4 text-center">
          <p className={`${lusitana.className} text-2xl font-bold text-blue-700`}>Fase 3 — Dep. Cosecha</p>
          <div className="mx-auto mt-2 h-px w-16 bg-blue-200" />
        </div>
        <div className="space-y-4">
          {fase3Info.map((fn, i) => <FuncionInfoCard key={fn.id} fn={fn} index={i} />)}
        </div>

      </div>
    </main>
  );
}