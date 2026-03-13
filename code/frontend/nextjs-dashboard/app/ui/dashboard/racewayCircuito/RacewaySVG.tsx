// Esquema del raceway — layout definitivo
// V1 = llenado Dep. Raceway (agua entrada)
// V2 = llenado Dep. Cultivo
// V3 = gases O₂+CO₂ → Dep. Cultivo
// V4 = Dep. Cultivo → Raceway (valvula_llenado_raceway)
// V5 = vaciado exterior Dep. Cultivo
// V6 = llenado Dep. Cosecha
// Dep. Raceway y Dep. Cosecha se vacían MANUALMENTE

import { Estado } from '@/app/tipos/raceway';
import ValvulaSVG from '@/app/ui/dashboard/racewayCircuito/ValvulaSVG';
import SensorSVG from '@/app/ui/dashboard/racewayCircuito/SensorSVG';
import AguaSVG from '@/app/ui/dashboard/racewayCircuito/AguaSVG';

type RacewaySVGProps = {
  estado: Estado | null;
  onValvula: (valvula: string, estadoActual: boolean) => void;
};

function FlowArrow({ x, y, angle, color }: { x: number; y: number; angle: number; color: string }) {
  const size = 8;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <polygon points={`${size},0 ${-size*0.6},${-size*0.6} ${-size*0.6},${size*0.6}`}
        fill={color} opacity='0.85' />
    </g>
  );
}

function VaciadoManual({ x, y }: { x: number; y: number }) {
  return (
    <g opacity='0.7'>
      <line x1={x} y1={y} x2={x} y2={y+22} stroke='#94a3b8' strokeWidth='2' strokeDasharray='3,2'/>
      <polygon points={`${x},${y+28} ${x-5},${y+20} ${x+5},${y+20}`} fill='#94a3b8'/>
      <circle cx={x} cy={y-8} r='7' fill='#f1f5f9' stroke='#94a3b8' strokeWidth='1.5'/>
      <text x={x} y={y-5} fill='#64748b' fontSize='8' textAnchor='middle'>🔧</text>
      <text x={x} y={y+42} fill='#94a3b8' fontSize='7' textAnchor='middle' fontStyle='italic'>manual</text>
    </g>
  );
}

export default function RacewaySVG({ estado, onValvula }: RacewaySVGProps) {

  const sinDatos = !estado;

  const r = estado?.dep_raceway ?? { nivel: 0, sensor_minimo: false, sensor_maximo: false, valvula_llenado: false };
  const d = estado?.dep_cultivo ?? { nivel: 0, sensor_minimo: false, sensor_maximo: false, valvula_llenado: false, valvula_gas: false, valvula_llenado_raceway: false, valvula_vaciado: false };
  const s = estado?.dep_cosecha ?? { nivel: 0, sensor_maximo: false, valvula_llenado: false };
  const m = estado?.motor       ?? { encendido: false };

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
    canalAgua:     '#bae6fd',
    canalBorde:    '#075985',
    canalInterior: '#e0f2fe',
  };

  const track = { x: 200, y: 30, w: 440, h: 120, r: 20 };
  const inner = { x: 245, y: 55, w: 350, h: 70 };
  const flowColor = m.encendido ? '#0369a1' : '#94a3b8';

  // Flujo siempre en sentido horario (forward fijo)
  const arrows = m.encendido ? [
    { x: 340, y: 41,  angle: 0   },
    { x: 460, y: 41,  angle: 0   },
    { x: 460, y: 139, angle: 180 },
    { x: 340, y: 139, angle: 180 },
    { x: 212, y: 90,  angle: 90  },
    { x: 628, y: 90,  angle: 270 },
  ] : [];

  return (
    <div className='w-full rounded-2xl border border-gray-200 bg-sky-100 p-3 shadow-sm'>
      <svg viewBox='0 0 860 610' className='w-full' style={{ fontFamily: 'monospace' }}>
        <rect width='860' height='610' fill={C.fondo} rx='12'/>

        {/* ══ RACEWAY ══ */}
        <rect x={track.x} y={track.y} width={track.w} height={track.h} rx={track.r}
          fill={m.encendido ? C.canalAgua : '#dbeafe'} stroke={C.canalBorde} strokeWidth='3'/>
        <rect x={inner.x} y={inner.y} width={inner.w} height={inner.h} rx='8'
          fill={C.canalInterior} stroke={C.canalBorde} strokeWidth='1.5'/>
        <text x='420' y='90' fill={C.label} fontSize='11' textAnchor='middle' fontWeight='700'>RACEWAY</text>
        <text x='420' y='104' fill={C.labelSub} fontSize='8' textAnchor='middle'>
          {m.encendido ? '↻ EN MARCHA' : 'MOTOR OFF'}
        </text>
        {arrows.map((a, i) => <FlowArrow key={i} {...a} color={flowColor}/>)}
        {m.encendido && (
          <>
            <line x1={track.x+track.r} y1={track.y+11} x2={track.x+track.w-track.r} y2={track.y+11}
              stroke='#7dd3fc' strokeWidth='2' strokeDasharray='12,8' opacity='0.6'>
              <animate attributeName='stroke-dashoffset' values='0;-80' dur='1.2s' repeatCount='indefinite'/>
            </line>
            <line x1={track.x+track.r} y1={track.y+track.h-11} x2={track.x+track.w-track.r} y2={track.y+track.h-11}
              stroke='#7dd3fc' strokeWidth='2' strokeDasharray='12,8' opacity='0.6'>
              <animate attributeName='stroke-dashoffset' values='0;80' dur='1.2s' repeatCount='indefinite'/>
            </line>
          </>
        )}

        {/* ── MOTOR ── */}
        <line x1={track.x+track.w} y1='90' x2={track.x+track.w+28} y2='90' stroke={C.tuberia} strokeWidth='4'/>
        <circle cx={track.x+track.w+56} cy='90' r='28'
          fill={m.encendido ? C.motorFondoOn : C.motorFondoOff}
          stroke={m.encendido ? C.motorBordeOn : C.motorBordeOff} strokeWidth='2.5'/>
        {m.encendido && (
          <circle cx={track.x+track.w+56} cy='90' r='34' fill='none' stroke={C.motorBordeOn} strokeWidth='1' opacity='0.4'>
            <animate attributeName='r' values='28;38;28' dur='2s' repeatCount='indefinite'/>
            <animate attributeName='opacity' values='0.4;0;0.4' dur='2s' repeatCount='indefinite'/>
          </circle>
        )}
        <text x={track.x+track.w+56} y='87'
          fill={m.encendido ? C.motorTextoOn : C.motorTextoOff}
          fontSize='9' textAnchor='middle' fontWeight='700'>MOTOR</text>
        <text x={track.x+track.w+56} y='99'
          fill={m.encendido ? '#16a34a' : '#ef4444'}
          fontSize='8' textAnchor='middle'>{m.encendido ? 'ON ▶' : 'OFF'}</text>

        {/* ══ DEP. RACEWAY — derecha ══ */}
        <rect x='640' y='240' width='100' height='130' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4'/>
        <AguaSVG x={641} y={241} width={98} height={128} nivel={r.nivel} encendido={false}/>
        <text x='690' y='232' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. RACEWAY</text>

        {/* N1 mínimo, N2 máximo */}
        <line x1='630' y1='330' x2='640' y2='330' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2'/>
        <line x1='630' y1='285' x2='640' y2='285' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2'/>
        <SensorSVG x={618} y={330} activo={r.sensor_minimo} label='N1'/>
        <SensorSVG x={618} y={285} activo={r.sensor_maximo} label='N2'/>

        {/* Dep. Raceway → Raceway */}
        <line x1='690' y1='240' x2='690' y2='178' stroke={C.tuberia} strokeWidth='5'/>
        <line x1='600' y1='178' x2='690' y2='178' stroke={C.tuberia} strokeWidth='5'/>
        <line x1='600' y1='150' x2='600' y2='178' stroke={C.tuberia} strokeWidth='5'/>
        <polygon points='605,150 600,140 595,150' fill={r.valvula_llenado ? C.flujoOn : '#94a3b8'}/>

        {/* V1 — llenado Dep. Raceway */}
        <line x1='690' y1='370' x2='690' y2='420' stroke={C.tuberia} strokeWidth='5'/>
        <ValvulaSVG x={690} y={395} abierta={r.valvula_llenado} bloqueada={r.sensor_maximo || sinDatos} label='V1'
          onClick={() => !sinDatos && onValvula('v1', r.valvula_llenado)}/>
        <text x='690' y='436' fill={C.labelSub} fontSize='8' textAnchor='middle'>AGUA</text>
        <rect x='680' y='436' width='20' height='9' rx='2' fill='none' stroke={C.labelSub} strokeWidth='1.5'/>
        <line x1='700' y1='440' x2='708' y2='440' stroke={C.labelSub} strokeWidth='2'/>
        <line x1='708' y1='437' x2='708' y2='445' stroke={C.labelSub} strokeWidth='2'/>

        {/* Vaciado MANUAL Dep. Raceway */}
        <VaciadoManual x={755} y={295}/>

        {/* ══ DEP. CULTIVO — izquierda ══ */}
        <polygon points='60,220 160,220 135,370 85,370' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor}/>
        {d.nivel > 0 && (
          <g>
            <defs>
              <clipPath id='clip-cultivo'>
                <polygon points='60,220 160,220 135,370 85,370'/>
              </clipPath>
            </defs>
            <rect x='60' y={370-150*d.nivel/100} width='100' height={150*d.nivel/100}
              fill='#34d399' opacity='0.35' clipPath='url(#clip-cultivo)'/>
          </g>
        )}
        <text x='110' y='212' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. CULTIVO</text>

        {/* N3 mínimo, N4 máximo */}
        <line x1='60' y1='320' x2='48' y2='320' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2'/>
        <line x1='60' y1='272' x2='48' y2='272' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2'/>
        <SensorSVG x={24} y={320} activo={d.sensor_minimo} label='N3'/>
        <SensorSVG x={24} y={272} activo={d.sensor_maximo} label='N4'/>

        {/* V2 — llenado Dep. Cultivo */}
        <line x1='420' y1='305' x2='640' y2='305' stroke={C.tuberia} strokeWidth='4'/>
        <line x1='160' y1='275' x2='420' y2='275' stroke={C.tuberia} strokeWidth='4'/>
        <line x1='420' y1='275' x2='420' y2='305' stroke={C.tuberia} strokeWidth='4'/>
        <ValvulaSVG x={510} y={305} abierta={d.valvula_llenado} bloqueada={sinDatos} label='V2'
          labelPos='below'
          onClick={() => !sinDatos && onValvula('v2', d.valvula_llenado)}/>

        {/* V3 — gases O₂+CO₂ */}
        <line x1='60' y1='248' x2='20' y2='248' stroke={C.tuberia} strokeWidth='4'/>
        <line x1='20' y1='195' x2='20' y2='248' stroke={C.tuberia} strokeWidth='4'/>
        <ValvulaSVG x={20} y={220} abierta={d.valvula_gas} bloqueada={sinDatos} label='V3'
          labelPos='above'
          onClick={() => !sinDatos && onValvula('v3', d.valvula_gas)}/>
        <rect x='0' y='182' width='40' height='14' rx='3' fill='#fef3c7' stroke='#fbbf24' strokeWidth='1'/>
        <text x='20' y='192' fill='#92400e' fontSize='7' textAnchor='middle'>O₂+CO₂</text>

        {/* V4 — Dep. Cultivo → Raceway */}
        <line x1='110' y1='220' x2='110' y2='168' stroke={C.tuberia} strokeWidth='4'/>
        <line x1='110' y1='168' x2='200' y2='168' stroke={C.tuberia} strokeWidth='4'/>
        <ValvulaSVG x={140} y={168} abierta={d.valvula_llenado_raceway} bloqueada={sinDatos} label='V4'
          labelPos='above'
          onClick={() => !sinDatos && onValvula('v4', d.valvula_llenado_raceway)}/>
        <line x1='200' y1='150' x2='200' y2='168' stroke={C.tuberia} strokeWidth='4'/>

        {/* V5 — vaciado exterior Dep. Cultivo */}
        <line x1='97' y1='370' x2='80' y2='418' stroke={C.tuberia} strokeWidth='4'/>
        <ValvulaSVG x={80} y={392} abierta={d.valvula_vaciado} bloqueada={sinDatos} label='V5'
          onClick={() => !sinDatos && onValvula('v5', d.valvula_vaciado)}/>
        <path d='M 58,430 q 7,-5 14,0 q 7,5 14,0 q 7,-5 14,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5'/>
        <path d='M 58,438 q 7,-5 14,0 q 7,5 14,0 q 7,-5 14,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5'/>

        {/* ══ DEP. COSECHA — centro-bajo ══ */}
        <rect x='300' y='420' width='130' height='115' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4'/>
        <AguaSVG x={301} y={421} width={128} height={113} nivel={s.nivel} encendido={false}/>
        <text x='365' y='412' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. COSECHA</text>

        {/* N5 máximo */}
        <line x1='430' y1='460' x2='440' y2='460' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2'/>
        <SensorSVG x={442} y={460} activo={s.sensor_maximo} label='N5'/>

        {/* V6 — llenado Dep. Cosecha */}
        <line x1='128' y1='370' x2='128' y2='462' stroke={C.tuberia} strokeWidth='4'/>
        <line x1='128' y1='462' x2='300' y2='462' stroke={C.tuberia} strokeWidth='4'/>
        <ValvulaSVG x={205} y={462} abierta={s.valvula_llenado} bloqueada={s.sensor_maximo || sinDatos} label='V6'
          labelPos='below'
          onClick={() => !sinDatos && onValvula('v6', s.valvula_llenado)}/>

        {/* Vaciado MANUAL Dep. Cosecha */}
        <VaciadoManual x={462} y={468}/>

        {/* ── OVERLAY SIN CONEXIÓN ── */}
        {sinDatos && (
          <g>
            <rect x='0' y='0' width='860' height='610' fill='#e0f2fe' rx='12' opacity='0.45'/>
            <text x='430' y='295' fill={C.label} fontSize='14' textAnchor='middle' fontWeight='600'>Sin conexion con la API</text>
            <text x='430' y='315' fill='#64748b' fontSize='11' textAnchor='middle'>Valvulas deshabilitadas</text>
          </g>
        )}

      </svg>
    </div>
  );
}