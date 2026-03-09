//Esquema del raceway 
import { Estado } from '@/app/tipos/raceway';
import ValvulaSVG from '@/app/ui/dashboard/racewayCircuito/ValvulaSVG';
import SensorSVG from '@/app/ui/dashboard/racewayCircuito/SensorSVG';
import AguaSVG from '@/app/ui/dashboard/racewayCircuito/AguaSVG';

type RacewaySVGProps = {
  estado: Estado | null;
  onValvula: (valvula: string, estadoActual: boolean) => void;
};

export default function RacewaySVG({ estado, onValvula }: RacewaySVGProps) {

  const r = estado?.raceway;
  const d = estado?.deposito;
  const s = estado?.salida;
  const m = estado?.motor;

  const bloqueos = {
    v1: r?.sensor_minimo ?? false,
    v2: r?.sensor_maximo ?? false,
    v3: d?.sensor_minimo ?? false,
    v4: d?.sensor_maximo ?? false,
    v5: s?.sensor_minimo ?? false,
    v6: s?.sensor_maximo ?? false,
  };

  return (
    <div className='w-full rounded-2xl border border-blue-800/30 bg-gray-900 p-3 shadow-xl'>
      <svg viewBox='0 0 780 420' className='w-full' style={{ fontFamily: 'monospace' }}>
        <rect width='780' height='420' fill='#0f172a' rx='12' />

        {/* TANQUE RACEWAY */}
        <rect x='480' y='80' width='120' height='160' fill='none' stroke='#334155' strokeWidth='2' rx='4' />
        {r && <AguaSVG x={481} y={81} width={118} height={158} nivel={r.nivel} encendido={m?.encendido} />}
        <text x='540' y='72' fill='#64748b' fontSize='11' textAnchor='middle'>RACEWAY</text>
        <line x1='540' y1='30' x2='540' y2='80' stroke='#334155' strokeWidth='6' />
        <line x1='480' y1='30' x2='700' y2='30' stroke='#334155' strokeWidth='6' />
        <line x1='700' y1='30' x2='700' y2='80' stroke='#334155' strokeWidth='6' />

        {r && <ValvulaSVG x={700} y={110} abierta={r.valvula_llenado} bloqueada={bloqueos.v2} label='V2' onClick={() => onValvula('v2', r.valvula_llenado)} />}
        <line x1='540' y1='240' x2='540' y2='300' stroke='#334155' strokeWidth='6' />
        {r && <ValvulaSVG x={540} y={310} abierta={r.valvula_vaciado} bloqueada={bloqueos.v1} label='V1' onClick={() => onValvula('v1', r.valvula_vaciado)} />}
        <line x1='475' y1='170' x2='480' y2='170' stroke='#475569' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='475' y1='120' x2='480' y2='120' stroke='#475569' strokeWidth='1.5' strokeDasharray='3,2' />
        {r && <SensorSVG x={468} y={170} activo={r.sensor_minimo} label='N1' />}
        {r && <SensorSVG x={468} y={120} activo={r.sensor_maximo} label='N2' />}

        {/* DEPOSITO CO2/O2 */}
        <polygon points='270,100 350,100 330,210 290,210' fill='none' stroke='#334155' strokeWidth='2' />
        {d && d.nivel > 0 && (
          <g>
            <defs><clipPath id='clip-deposito'><polygon points='270,100 350,100 330,210 290,210' /></clipPath></defs>
            <rect x='270' y={210-(110*d.nivel/100)} width='80' height={110*d.nivel/100} fill='#7c3aed' opacity='0.5' clipPath='url(#clip-deposito)' />
          </g>
        )}
        <text x='310' y='92' fill='#64748b' fontSize='10' textAnchor='middle'>DEPOSITO CO2/O2</text>
        <line x1='310' y1='50' x2='310' y2='100' stroke='#334155' strokeWidth='5' />
        {d && <ValvulaSVG x={310} y={65} abierta={d.valvula_llenado} bloqueada={bloqueos.v4} label='V4' onClick={() => onValvula('v4', d.valvula_llenado)} />}
        <line x1='310' y1='210' x2='310' y2='270' stroke='#334155' strokeWidth='5' />
        {d && <ValvulaSVG x={310} y={255} abierta={d.valvula_vaciado} bloqueada={bloqueos.v3} label='V3' onClick={() => onValvula('v3', d.valvula_vaciado)} />}
        {d && <SensorSVG x={355} y={185} activo={d.sensor_minimo} label='N3' />}
        {d && <SensorSVG x={355} y={135} activo={d.sensor_maximo} label='N4' />}

        {/* ZONA SALIDA */}
        <rect x='60' y='120' width='100' height='100' fill='none' stroke='#334155' strokeWidth='2' rx='4' />
        {s && <AguaSVG x={61} y={121} width={98} height={98} nivel={s.nivel} />}
        <text x='110' y='112' fill='#64748b' fontSize='10' textAnchor='middle'>SALIDA</text>
        <line x1='110' y1='220' x2='110' y2='290' stroke='#334155' strokeWidth='5' />
        {s && <ValvulaSVG x={110} y={278} abierta={s.valvula_vaciado} bloqueada={bloqueos.v5} label='V5' onClick={() => onValvula('v5', s.valvula_vaciado)} />}
        <line x1='110' y1='120' x2='110' y2='60' stroke='#334155' strokeWidth='5' />
        {s && <ValvulaSVG x={110} y={72} abierta={s.valvula_llenado} bloqueada={bloqueos.v6} label='V6' onClick={() => onValvula('v6', s.valvula_llenado)} />}
        {s && <SensorSVG x={50} y={195} activo={s.sensor_minimo} label='N5' />}
        {s && <SensorSVG x={50} y={150} activo={s.sensor_maximo} label='N6' />}

        {/* MOTOR */}
        <circle cx='390' cy='360' r='28' fill={m?.encendido ? '#1e3a5f' : '#1e293b'} stroke={m?.encendido ? '#3b82f6' : '#334155'} strokeWidth='2.5' />
        {m?.encendido && (
          <circle cx='390' cy='360' r='34' fill='none' stroke='#3b82f6' strokeWidth='1' opacity='0.4'>
            <animate attributeName='r' values='28;36;28' dur='2s' repeatCount='indefinite' />
            <animate attributeName='opacity' values='0.4;0;0.4' dur='2s' repeatCount='indefinite' />
          </circle>
        )}
        <text x='390' y='356' fill={m?.encendido ? '#93c5fd' : '#64748b'} fontSize='11' textAnchor='middle'>MOTOR</text>
        <text x='390' y='370' fill={m?.encendido ? '#22c55e' : '#ef4444'} fontSize='9' textAnchor='middle'>
          {m?.encendido ? (m.forward === true ? '>> FWD' : '<< BWD') : 'OFF'}
        </text>
        <line x1='310' y1='360' x2='362' y2='360' stroke='#334155' strokeWidth='3' strokeDasharray='4,3' />
        <line x1='310' y1='270' x2='310' y2='360' stroke='#334155' strokeWidth='3' strokeDasharray='4,3' />
        <line x1='418' y1='360' x2='460' y2='360' stroke='#334155' strokeWidth='3' strokeDasharray='4,3' />
        <line x1='460' y1='360' x2='460' y2='330' stroke='#334155' strokeWidth='3' strokeDasharray='4,3' />
        <line x1='160' y1='170' x2='480' y2='170' stroke={m?.encendido ? '#1d4ed8' : '#1e293b'} strokeWidth='4'>
          {m?.encendido && <animate attributeName='stroke' values='#1d4ed8;#3b82f6;#1d4ed8' dur='1.5s' repeatCount='indefinite' />}
        </line>
        {!estado && (
          <g>
            <rect x='50' y='50' width='680' height='300' fill='#1e293b' rx='8' opacity='0.5' />
            <text x='390' y='210' fill='#475569' fontSize='16' textAnchor='middle'>Conectando con la API...</text>
          </g>
        )}
      </svg>
    </div>
  );
}