// EstadoSistema — fondo gray-50, modo claro

import { lusitana } from '@/app/ui/fonts';
import { Estado } from '@/app/tipos/raceway';

type EstadoSistemaProps = {
  estado: Estado | null;
  error: string | null;
  ultimaActualizacion: string;
};

export default function EstadoSistema({ estado, error, ultimaActualizacion }: EstadoSistemaProps) {
  return (
    <aside className="w-full lg:w-56 xl:w-64 lg:shrink-0 lg:sticky lg:top-6">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">

        {/* ── Cabecera ── */}
        <div className="mb-4 border-b border-gray-200 pb-3">
          <p className={`${lusitana.className} text-sm font-bold text-blue-700`}>
            Estado del Sistema
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-gray-400">
            Tiempo real · cada 1s
          </p>
          {ultimaActualizacion && (
            <p className="mt-0.5 text-xs text-gray-400">
              {ultimaActualizacion}
            </p>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-500">
            {error}
          </div>
        )}

        {/* ── Skeleton interno ── */}
        {!estado && !error && (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-16 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        )}

        {estado && (
          <div className="space-y-3">

            {/* ── Motor ── */}
            <div className={`relative overflow-hidden rounded-xl border-l-4 p-3 ${
              estado.motor.encendido
                ? 'border-algae-500 bg-algae-50'
                : 'border-red-400 bg-red-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${
                    estado.motor.encendido
                      ? 'bg-algae-100 ring-1 ring-algae-300'
                      : 'bg-red-100 ring-1 ring-red-300'
                  }`}>
                    &#9881;
                  </div>
                  <p className={`${lusitana.className} text-sm font-bold text-gray-800`}>Motor</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  estado.motor.encendido
                    ? 'bg-algae-100 text-algae-700'
                    : 'bg-red-100 text-red-600'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    estado.motor.encendido ? 'bg-algae-500 animate-pulse' : 'bg-red-400'
                  }`} />
                  {estado.motor.encendido ? 'ON' : 'OFF'}
                </span>
              </div>
              {estado.motor.encendido && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/80 px-2 py-1.5 border border-gray-100">
                  <span className="text-sm">
                    {estado.motor.forward === true ? '➡' : '⬅'}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">Direccion</p>
                    <p className="text-xs font-semibold text-gray-700">
                      {estado.motor.forward === true ? 'Avance' : 'Retroceso'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Válvula llenado raceway ── */}
            <div className={`relative overflow-hidden rounded-xl border-l-4 p-3 ${
              estado.dep_raceway.valvula_llenado
                ? 'border-sky-400 bg-sky-50'
                : 'border-amber-400 bg-amber-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${
                    estado.dep_raceway.valvula_llenado
                      ? 'bg-sky-100 ring-1 ring-sky-300'
                      : 'bg-amber-100 ring-1 ring-amber-300'
                  }`}>
                    &#9685;
                  </div>
                  <p className={`${lusitana.className} text-xs font-bold text-gray-800`}>V. Llenado</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  estado.dep_raceway.valvula_llenado
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    estado.dep_raceway.valvula_llenado ? 'bg-sky-400 animate-pulse' : 'bg-amber-400'
                  }`} />
                  {estado.dep_raceway.valvula_llenado ? 'ABIERTA' : 'CERRADA'}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
}