// EstadoSistema — fondo gray-50, modo claro

import { lusitana } from '@/app/ui/fonts';
import { Estado } from '@/app/tipos/raceway';

type EstadoSistemaProps = {
  estado: Estado | null;
  error: string | null;
};

export default function EstadoSistema({ estado, error }: EstadoSistemaProps) {
  return (
    <aside className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">

        {/* ── Cabecera ── */}
        <div className="mb-4 border-b border-gray-200 pb-3">
          <p className={`${lusitana.className} text-sm font-bold text-blue-700`}>
            Estado del Sistema
          </p>
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
            </div>

          </div>
        )}
      </div>
    </aside>
  );
}