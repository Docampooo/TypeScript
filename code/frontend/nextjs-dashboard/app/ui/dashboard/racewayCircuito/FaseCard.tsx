// FaseCard — tarjeta de control por fase con estado en tiempo real

import { lusitana } from '@/app/ui/fonts';

type ValvulaItem = {
  id: string;         // 'v1', 'v2', etc.
  label: string;      // descripcion corta
  abierta: boolean;   // estado actual via WebSocket
  bloqueada?: boolean;
};

type FaseCardProps = {
  fase: number;               // 1, 2, 3
  deposito: string;           // nombre del deposito
  color: string;              // clases de gradiente tailwind
  valvulas: ValvulaItem[];
  vaciadoManual?: boolean;    // si tiene indicador de vaciado manual
  onValvula: (id: string, estadoActual: boolean) => void;
  cargando: string | null;    // id de la valvula en proceso
};

export default function FaseCard({
  fase, deposito, color, valvulas, vaciadoManual, onValvula, cargando
}: FaseCardProps) {
  return (
    <div className={`relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-4 shadow-sm border border-gray-200`}>

      {/* Número decorativo de fondo */}
      <div className="pointer-events-none absolute right-3 top-2 text-6xl font-bold text-white/5 select-none">
        {fase}
      </div>

      {/* Cabecera */}
      <p className="text-xs font-bold uppercase tracking-widest text-white/60">
        Fase {fase}
      </p>
      <p className={`${lusitana.className} mb-4 mt-0.5 text-sm font-bold text-white`}>
        {deposito}
      </p>

      {/* Válvulas */}
      <div className="space-y-2">
        {valvulas.map((v) => {
          const enCarga = cargando === v.id;
          return (
            <div key={v.id} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/10">
              <div className="flex items-center gap-2">
                {/* Indicador de estado */}
                <span className={`h-2 w-2 rounded-full shrink-0 ${
                  v.bloqueada ? 'bg-gray-300' : v.abierta ? 'bg-algae-400 animate-pulse' : 'bg-red-400'
                }`} />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wide">{v.id.toUpperCase()}</p>
                  <p className="text-xs text-white/60 leading-tight">{v.label}</p>
                </div>
              </div>
              <button
                onClick={() => !v.bloqueada && !enCarga && onValvula(v.id, v.abierta)}
                disabled={v.bloqueada || enCarga}
                className={`ml-3 shrink-0 rounded-lg px-3 py-1 text-xs font-semibold text-white shadow transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                  v.abierta
                    ? 'bg-red-500/70 hover:bg-red-500'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {enCarga ? '...' : v.abierta ? 'Cerrar' : 'Abrir'}
              </button>
            </div>
          );
        })}

        {/* Vaciado manual */}
        {vaciadoManual && (
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
            <span className="text-sm">🔧</span>
            <div>
              <p className="text-xs font-bold text-white/80">Vaciado</p>
              <p className="text-xs text-white/50 leading-tight">Operacion manual</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}