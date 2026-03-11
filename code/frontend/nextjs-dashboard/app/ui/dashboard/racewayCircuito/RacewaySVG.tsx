// Esquema del raceway — layout fiel al esquema físico
// Raceway (canal oval) arriba con motor
// Dep. Raceway (derecha) → conectado al raceway por arriba
// V1 = entrada agua al Dep. Raceway
// V2 = vaciado exterior Dep. Raceway
// V3 = Dep. Raceway → Dep. Cultivo (horizontal, V3 en el medio)
// V4 = Dep. Cultivo → Raceway (sube por arriba)
// V5 = salida exterior desde Dep. Cultivo
// V6 = Dep. Cultivo → Dep. Cosecha

import { Estado } from '@/app/tipos/raceway';
import ValvulaSVG from '@/app/ui/dashboard/racewayCircuito/ValvulaSVG';
import SensorSVG from '@/app/ui/dashboard/racewayCircuito/SensorSVG';
import AguaSVG from '@/app/ui/dashboard/racewayCircuito/AguaSVG';

type RacewaySVGProps = {
  estado: Estado | null;
  onValvula: (valvula: string, estadoActual: boolean) => void;
};

export default function RacewaySVG({ estado, onValvula }: RacewaySVGProps) {

  const sinDatos = !estado;

  const r = estado?.dep_raceway ?? { nivel: 0, sensor_minimo: false, sensor_maximo: false, valvula_vaciado: false, valvula_llenado: false };
  const d = estado?.dep_cultivo ?? { nivel: 0, sensor_minimo: false, sensor_maximo: false, valvula_vaciado: false, valvula_llenado: false };
  const s = estado?.dep_cosecha ?? { nivel: 0, sensor_minimo: false, sensor_maximo: false, valvula_vaciado: false, valvula_llenado: false };
  const m = estado?.motor       ?? { encendido: false, forward: false };

  const C = {
    fondo:         '#e0f2fe',
    tuberia:       '#0369a1',
    borde:         '#075985',
    bordeGrosor:   2.5,
    label:         '#0c4a6e',
    labelSub:      '#475569',
    motorFondoOn:  '#dcfce7',
    motorFondoOff: '#f1f5f9',
    motorBordeOn:  '#16a34a',
    motorBordeOff: '#94a3b8',
    motorTextoOn:  '#15803d',
    motorTextoOff: '#64748b',
    flujoOn:       '#0284c7',
    flujoOff:      '#bae6fd',
  };

  return (
    <div className='w-full rounded-2xl border border-gray-200 bg-sky-100 p-3 shadow-sm'>
      <svg viewBox='0 0 860 580' className='w-full' style={{ fontFamily: 'monospace' }}>
        <rect width='860' height='580' fill={C.fondo} rx='12' />

        {/* ── RACEWAY ── */}
        <ellipse cx='400' cy='90' rx='180' ry='55' fill='none' stroke={C.borde} strokeWidth='18' />
        <ellipse cx='400' cy='90' rx='158' ry='37' fill={C.fondo} stroke='none' />
        {[0,1,2,3].map(i => (
          <path key={i} d={`M ${260 + i*60} 83 q 15,-10 30,0 q 15,10 30,0`}
            fill='none' stroke='#7dd3fc' strokeWidth='1.5' opacity='0.7' />
        ))}
        <text x='400' y='95' fill={C.label} fontSize='13' textAnchor='middle' fontWeight='700'>RACEWAY</text>

        {/* ── MOTOR ── */}
        <circle cx='635' cy='90' r='28'
          fill={m.encendido ? C.motorFondoOn : C.motorFondoOff}
          stroke={m.encendido ? C.motorBordeOn : C.motorBordeOff}
          strokeWidth='2.5' />
        {m.encendido && (
          <circle cx='635' cy='90' r='34' fill='none' stroke={C.motorBordeOn} strokeWidth='1' opacity='0.4'>
            <animate attributeName='r' values='28;38;28' dur='2s' repeatCount='indefinite' />
            <animate attributeName='opacity' values='0.4;0;0.4' dur='2s' repeatCount='indefinite' />
          </circle>
        )}
        <text x='635' y='87' fill={m.encendido ? C.motorTextoOn : C.motorTextoOff} fontSize='9' textAnchor='middle' fontWeight='700'>MOTOR</text>
        <text x='635' y='99' fill={m.encendido ? '#16a34a' : '#ef4444'} fontSize='8' textAnchor='middle'>
          {m.encendido ? (m.forward ? 'FWD ▶' : '◀ BWD') : 'OFF'}
        </text>
        <line x1='580' y1='90' x2='607' y2='90' stroke={C.tuberia} strokeWidth='4' />

        {/* ── DEP. RACEWAY ── */}
        <rect x='650' y='230' width='100' height='130' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4' />
        <AguaSVG x={651} y={231} width={98} height={128} nivel={r.nivel} encendido={false} />
        <text x='700' y='222' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. RACEWAY</text>

        {/* N1, N2 — lado izquierdo */}
        <line x1='640' y1='320' x2='650' y2='320' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='640' y1='275' x2='650' y2='275' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={628} y={320} activo={r.sensor_minimo} label='N1' />
        <SensorSVG x={628} y={275} activo={r.sensor_maximo} label='N2' />

        {/* Dep. Raceway → Raceway */}
        <line x1='700' y1='230' x2='700' y2='165' stroke={C.tuberia} strokeWidth='5' />
        <line x1='580' y1='165' x2='700' y2='165' stroke={C.tuberia} strokeWidth='5' />
        <polygon points='585,160 600,165 585,170' fill={r.valvula_llenado ? C.flujoOn : '#94a3b8'} />

        {/* V1 — entrada agua */}
        <line x1='700' y1='360' x2='700' y2='415' stroke={C.tuberia} strokeWidth='5' />
        <ValvulaSVG x={700} y={385} abierta={r.valvula_llenado} bloqueada={r.sensor_maximo || sinDatos} label='V1'
          onClick={() => !sinDatos && onValvula('v1', r.valvula_llenado)} />
        <text x='700' y='432' fill={C.labelSub} fontSize='9' textAnchor='middle'>AGUA</text>
        <rect x='690' y='432' width='20' height='10' rx='2' fill='none' stroke={C.labelSub} strokeWidth='1.5' />
        <line x1='710' y1='437' x2='718' y2='437' stroke={C.labelSub} strokeWidth='2' />
        <line x1='718' y1='434' x2='718' y2='442' stroke={C.labelSub} strokeWidth='2' />

        {/* V2 — vaciado exterior */}
        <line x1='750' y1='285' x2='800' y2='285' stroke={C.tuberia} strokeWidth='4' />
        <line x1='800' y1='285' x2='800' y2='450' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={800} y={375} abierta={r.valvula_vaciado} bloqueada={r.sensor_minimo || sinDatos} label='V2'
          onClick={() => !sinDatos && onValvula('v2', r.valvula_vaciado)} />
        <path d='M 782,460 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />
        <path d='M 782,468 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />

        {/* V3 — Dep. Raceway → Dep. Cultivo (horizontal) */}
        <line x1='420' y1='295' x2='650' y2='295' stroke={C.tuberia} strokeWidth='4' />
        <line x1='180' y1='265' x2='420' y2='265' stroke={C.tuberia} strokeWidth='4' />
        <line x1='420' y1='265' x2='420' y2='295' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={520} y={295} abierta={d.valvula_vaciado} bloqueada={sinDatos} label='V3'
          onClick={() => !sinDatos && onValvula('v3', d.valvula_vaciado)} />

        {/* ── DEP. CULTIVO ── */}
        <polygon points='80,210 180,210 155,350 105,350' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} />
        {d.nivel > 0 && (
          <g>
            <defs>
              <clipPath id='clip-cultivo'>
                <polygon points='80,210 180,210 155,350 105,350' />
              </clipPath>
            </defs>
            <rect x='80' y={350 - 140*d.nivel/100} width='100' height={140*d.nivel/100}
              fill='#34d399' opacity='0.35' clipPath='url(#clip-cultivo)' />
          </g>
        )}
        <text x='130' y='202' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. CULTIVO</text>

        {/* N3, N4 — lado izquierdo */}
        <line x1='80' y1='315' x2='68' y2='315' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='80' y1='265' x2='68' y2='265' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={44} y={315} activo={d.sensor_minimo} label='N3' />
        <SensorSVG x={44} y={265} activo={d.sensor_maximo} label='N4' />

        {/* V4 — Dep. Cultivo → Raceway (por arriba) */}
        <line x1='130' y1='210' x2='130' y2='155' stroke={C.tuberia} strokeWidth='4' />
        <line x1='130' y1='155' x2='220' y2='155' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={155} y={155} abierta={d.valvula_llenado} bloqueada={sinDatos} label='V4'
          onClick={() => !sinDatos && onValvula('v4', d.valvula_llenado)} />
        <line x1='220' y1='155' x2='220' y2='135' stroke={C.tuberia} strokeWidth='4' />
        <line x1='220' y1='135' x2='222' y2='135' stroke={C.tuberia} strokeWidth='4' />
        <rect x='225' y='143' width='52' height='16' rx='3' fill='#fef3c7' stroke='#fbbf24' strokeWidth='1' />
        <text x='251' y='155' fill='#92400e' fontSize='8' textAnchor='middle'>O₂ + CO₂</text>

        {/* V5 — salida exterior */}
        <line x1='115' y1='350' x2='97' y2='400' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={97} y={373} abierta={d.sensor_minimo} bloqueada={sinDatos} label='V5'
          onClick={() => !sinDatos && onValvula('v5', d.sensor_minimo)} />
        <path d='M 72,420 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />
        <path d='M 72,428 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />

        {/* ── DEP. COSECHA ── */}
        <rect x='310' y='410' width='120' height='110' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4' />
        <AguaSVG x={311} y={411} width={118} height={108} nivel={s.nivel} encendido={false} />
        <text x='370' y='402' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. COSECHA</text>

        {/* N5, N6 — lado derecho */}
        <line x1='430' y1='480' x2='440' y2='480' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='430' y1='445' x2='440' y2='445' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={442} y={480} activo={s.sensor_minimo} label='N5' />
        <SensorSVG x={442} y={445} activo={s.sensor_maximo} label='N6' />

        {/* V6 — Dep. Cultivo → Dep. Cosecha */}
        <line x1='148' y1='350' x2='148' y2='450' stroke={C.tuberia} strokeWidth='4' />
        <line x1='148' y1='450' x2='310' y2='450' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={215} y={450} abierta={s.valvula_llenado} bloqueada={s.sensor_maximo || sinDatos} label='V6'
          onClick={() => !sinDatos && onValvula('v6', s.valvula_llenado)} />

        {/* ── OVERLAY SIN CONEXIÓN ── */}
        {sinDatos && (
          <g>
            <rect x='0' y='0' width='860' height='580' fill='#e0f2fe' rx='12' opacity='0.45' />
            <text x='430' y='285' fill={C.label} fontSize='14' textAnchor='middle' fontWeight='600'>Sin conexion con la API</text>
            <text x='430' y='305' fill='#64748b' fontSize='11' textAnchor='middle'>Valvulas deshabilitadas</text>
          </g>
        )}

      </svg>
    </div>
  );
}