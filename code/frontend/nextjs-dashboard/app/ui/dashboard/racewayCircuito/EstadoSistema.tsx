//El <aside> completo con motor + válvulas en funcionesMotor/page.tsx

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
      <div className="rounded-2xl border border-blue-800/30 bg-gray-900 p-4 shadow-xl shadow-blue-950/40">

        <div className="mb-4 border-b border-blue-800/30 pb-3">
          <p className={`${lusitana.className} text-sm font-bold text-white`}>
            Estado del Sistema
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-blue-400/70">
            Tiempo real · cada 1s
          </p>
          {ultimaActualizacion && (
            <p className="mt-0.5 text-xs text-blue-700">
              {ultimaActualizacion}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-3 rounded-xl border border-red-800 bg-red-950/50 px-3 py-2 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        {!estado && !error && (
          <div className="space-y-3">
            <div className="h-20 animate-pulse rounded-2xl bg-blue-950/40" />
            <div className="h-16 animate-pulse rounded-2xl bg-blue-950/40" />
          </div>
        )}

        {estado && (
          <div className="space-y-3">

            {/* Motor */}
            <div className={`relative overflow-hidden rounded-xl border-l-4 ${estado.motor.encendido ? 'border-emerald-500 bg-gradient-to-r from-emerald-950/60 to-blue-950/60' : 'border-red-600 bg-gradient-to-r from-red-950/60 to-blue-950/60'} p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${estado.motor.encendido ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40' : 'bg-red-500/20 ring-1 ring-red-500/40'}`}>
                    &#9881;
                  </div>
                  <p className={`${lusitana.className} text-sm font-bold text-white`}>Motor</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${estado.motor.encendido ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${estado.motor.encendido ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                  {estado.motor.encendido ? 'ON' : 'OFF'}
                </span>
              </div>
              {estado.motor.encendido && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1.5">
                  <span className="text-sm">
                    {estado.motor.forward === true ? '➡' : '⬅'}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-blue-400/60">Direccion</p>
                    <p className="text-xs font-semibold text-white">
                      {estado.motor.forward === true ? 'Avance' : 'Retroceso'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Valvula llenado raceway */}
            <div className={`relative overflow-hidden rounded-xl border-l-4 ${estado.raceway.valvula_llenado ? 'border-sky-500 bg-gradient-to-r from-sky-950/60 to-blue-950/60' : 'border-amber-500 bg-gradient-to-r from-amber-950/60 to-blue-950/60'} p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${estado.raceway.valvula_llenado ? 'bg-sky-500/20 ring-1 ring-sky-500/40' : 'bg-amber-500/20 ring-1 ring-amber-500/40'}`}>
                    &#9685;
                  </div>
                  <p className={`${lusitana.className} text-xs font-bold text-white`}>V. Llenado</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${estado.raceway.valvula_llenado ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${estado.raceway.valvula_llenado ? 'bg-sky-400 animate-pulse' : 'bg-amber-500'}`} />
                  {estado.raceway.valvula_llenado ? 'ABIERTA' : 'CERRADA'}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </aside>
  );
}