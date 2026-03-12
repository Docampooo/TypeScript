// Esquema del raceway — layout fiel al esquema físico
// Raceway rectangular tipo pista de atletismo con flujo direccional
// V1 = entrada agua al Dep. Raceway
// V2 = vaciado exterior Dep. Raceway
// V3 = Dep. Raceway → Dep. Cultivo (horizontal)
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

// Flecha direccional para el flujo del canal
function FlowArrow({ x, y, angle, color }: { x: number; y: number; angle: number; color: string }) {
  const size = 8;
  return (
    <g transform={`translate(${x},${y}) rotate(${angle})`}>
      <polygon
        points={`${size},0 ${-size * 0.6},${-size * 0.6} ${-size * 0.6},${size * 0.6}`}
        fill={color}
        opacity='0.85'
      />
    </g>
  );
}

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
    canalAgua:     '#bae6fd',  // sky-200 — color agua del canal
    canalBorde:    '#075985',  // sky-800
    canalInterior: '#e0f2fe',  // fondo interior tapado
  };

  // Canal rectangular: coordenadas del track
  // Exterior: rect 220,30 → 660,160  (440×130)
  // Interior tapado: rect 260,55 → 620,135  (360×80)
  const track = { x: 220, y: 30, w: 440, h: 130, r: 20 };
  const inner = { x: 265, y: 58, w: 350, h: 74 };

  // Flechas de flujo: forward = horario, backward = antihorario
  // Posiciones a lo largo del canal exterior
  const fwd = m.forward;
  const flowColor = m.encendido ? '#0369a1' : '#94a3b8';

  // Flechas: top (→ fwd, ← bwd), bottom (← fwd, → bwd), left (↓ fwd, ↑ bwd), right (↑ fwd, ↓ bwd)
  const arrows = m.encendido ? [
    // Top — izq a der (fwd) o der a izq (bwd)
    { x: 355, y: 42,  angle: fwd ? 0   : 180 },
    { x: 480, y: 42,  angle: fwd ? 0   : 180 },
    // Bottom — der a izq (fwd) o izq a der (bwd)
    { x: 480, y: 148, angle: fwd ? 180 : 0   },
    { x: 355, y: 148, angle: fwd ? 180 : 0   },
    // Left — abajo (fwd) o arriba (bwd)
    { x: 232, y: 95,  angle: fwd ? 90  : 270 },
    // Right — arriba (fwd) o abajo (bwd)
    { x: 648, y: 95,  angle: fwd ? 270 : 90  },
  ] : [];

  return (
    <div className='w-full rounded-2xl border border-gray-200 bg-sky-100 p-3 shadow-sm'>
      <svg viewBox='0 0 860 600' className='w-full' style={{ fontFamily: 'monospace' }}>
        <rect width='860' height='600' fill={C.fondo} rx='12' />

        {/* ══════════════════════════════════════
            RACEWAY — pista rectangular
            ══════════════════════════════════════ */}

        {/* Canal exterior (el agua corre aquí) */}
        <rect
          x={track.x} y={track.y}
          width={track.w} height={track.h}
          rx={track.r}
          fill={m.encendido ? C.canalAgua : '#dbeafe'}
          stroke={C.canalBorde} strokeWidth='3'
        />

        {/* Interior tapado (isla central) */}
        <rect
          x={inner.x} y={inner.y}
          width={inner.w} height={inner.h}
          rx='8'
          fill={C.canalInterior}
          stroke={C.canalBorde} strokeWidth='1.5'
        />

        {/* Texto interior */}
        <text x='440' y='96' fill={C.label} fontSize='11' textAnchor='middle' fontWeight='700'>RACEWAY</text>
        <text x='440' y='110' fill={C.labelSub} fontSize='8' textAnchor='middle'>
          {m.encendido
            ? (fwd ? '↻ FORWARD' : '↺ BACKWARD')
            : 'MOTOR OFF'}
        </text>

        {/* Flechas de flujo animadas */}
        {arrows.map((a, i) => (
          <FlowArrow key={i} x={a.x} y={a.y} angle={a.angle} color={flowColor} />
        ))}

        {/* Animación de flujo en el canal cuando motor ON */}
        {m.encendido && (
          <>
            {/* Top rail */}
            <line x1={track.x + track.r} y1={track.y + 11} x2={track.x + track.w - track.r} y2={track.y + 11}
              stroke='#7dd3fc' strokeWidth='2' strokeDasharray='12,8' opacity='0.6'>
              <animate attributeName='stroke-dashoffset'
                values={fwd ? '0;-80' : '0;80'} dur='1.2s' repeatCount='indefinite' />
            </line>
            {/* Bottom rail */}
            <line x1={track.x + track.r} y1={track.y + track.h - 11} x2={track.x + track.w - track.r} y2={track.y + track.h - 11}
              stroke='#7dd3fc' strokeWidth='2' strokeDasharray='12,8' opacity='0.6'>
              <animate attributeName='stroke-dashoffset'
                values={fwd ? '0;80' : '0;-80'} dur='1.2s' repeatCount='indefinite' />
            </line>
          </>
        )}

        {/* ── MOTOR — pegado a la derecha del canal ── */}
        <line x1={track.x + track.w} y1='95' x2={track.x + track.w + 28} y2='95' stroke={C.tuberia} strokeWidth='4' />
        <circle cx={track.x + track.w + 56} cy='95' r='28'
          fill={m.encendido ? C.motorFondoOn : C.motorFondoOff}
          stroke={m.encendido ? C.motorBordeOn : C.motorBordeOff}
          strokeWidth='2.5' />
        {m.encendido && (
          <circle cx={track.x + track.w + 56} cy='95' r='34'
            fill='none' stroke={C.motorBordeOn} strokeWidth='1' opacity='0.4'>
            <animate attributeName='r' values='28;38;28' dur='2s' repeatCount='indefinite' />
            <animate attributeName='opacity' values='0.4;0;0.4' dur='2s' repeatCount='indefinite' />
          </circle>
        )}
        <text x={track.x + track.w + 56} y='92'
          fill={m.encendido ? C.motorTextoOn : C.motorTextoOff}
          fontSize='9' textAnchor='middle' fontWeight='700'>MOTOR</text>
        <text x={track.x + track.w + 56} y='104'
          fill={m.encendido ? '#16a34a' : '#ef4444'}
          fontSize='8' textAnchor='middle'>
          {m.encendido ? (fwd ? 'FWD ▶' : '◀ BWD') : 'OFF'}
        </text>

        {/* ══════════════════════════════════════
            DEP. RACEWAY — derecha, zona media
            ══════════════════════════════════════ */}
        <rect x='650' y='250' width='100' height='130' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4' />
        <AguaSVG x={651} y={251} width={98} height={128} nivel={r.nivel} encendido={false} />
        <text x='700' y='242' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. RACEWAY</text>

        {/* N1, N2 */}
        <line x1='640' y1='340' x2='650' y2='340' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='640' y1='295' x2='650' y2='295' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={628} y={340} activo={r.sensor_minimo} label='N1' />
        <SensorSVG x={628} y={295} activo={r.sensor_maximo} label='N2' />

        {/* Dep. Raceway → Raceway (baja del canal a la derecha, y=160, hasta x=700 y sube) */}
        <line x1='700' y1='250' x2='700' y2='185' stroke={C.tuberia} strokeWidth='5' />
        <line x1='620' y1='185' x2='700' y2='185' stroke={C.tuberia} strokeWidth='5' />
        <line x1='620' y1='160' x2='620' y2='185' stroke={C.tuberia} strokeWidth='5' />
        <polygon points='625,160 620,148 615,160' fill={r.valvula_llenado ? C.flujoOn : '#94a3b8'} />

        {/* V1 — entrada agua */}
        <line x1='700' y1='380' x2='700' y2='430' stroke={C.tuberia} strokeWidth='5' />
        <ValvulaSVG x={700} y={405} abierta={r.valvula_llenado} bloqueada={r.sensor_maximo || sinDatos} label='V1'
          onClick={() => !sinDatos && onValvula('v1', r.valvula_llenado)} />
        <text x='700' y='448' fill={C.labelSub} fontSize='9' textAnchor='middle'>AGUA</text>
        <rect x='690' y='448' width='20' height='10' rx='2' fill='none' stroke={C.labelSub} strokeWidth='1.5' />
        <line x1='710' y1='453' x2='718' y2='453' stroke={C.labelSub} strokeWidth='2' />
        <line x1='718' y1='450' x2='718' y2='458' stroke={C.labelSub} strokeWidth='2' />

        {/* V2 — vaciado exterior */}
        <line x1='750' y1='305' x2='800' y2='305' stroke={C.tuberia} strokeWidth='4' />
        <line x1='800' y1='305' x2='800' y2='470' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={800} y={390} abierta={r.valvula_vaciado} bloqueada={r.sensor_minimo || sinDatos} label='V2'
          onClick={() => !sinDatos && onValvula('v2', r.valvula_vaciado)} />
        <path d='M 782,478 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />
        <path d='M 782,486 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />

        {/* V3 — Dep. Raceway → Dep. Cultivo (horizontal) — label debajo */}
        <line x1='420' y1='315' x2='650' y2='315' stroke={C.tuberia} strokeWidth='4' />
        <line x1='180' y1='285' x2='420' y2='285' stroke={C.tuberia} strokeWidth='4' />
        <line x1='420' y1='285' x2='420' y2='315' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={520} y={315} abierta={d.valvula_vaciado} bloqueada={sinDatos} label='V3'
          labelPos='below'
          onClick={() => !sinDatos && onValvula('v3', d.valvula_vaciado)} />

        {/* ══════════════════════════════════════
            DEP. CULTIVO — izquierda
            ══════════════════════════════════════ */}
        <polygon points='80,230 180,230 155,370 105,370' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} />
        {d.nivel > 0 && (
          <g>
            <defs>
              <clipPath id='clip-cultivo'>
                <polygon points='80,230 180,230 155,370 105,370' />
              </clipPath>
            </defs>
            <rect x='80' y={370 - 140*d.nivel/100} width='100' height={140*d.nivel/100}
              fill='#34d399' opacity='0.35' clipPath='url(#clip-cultivo)' />
          </g>
        )}
        <text x='130' y='222' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. CULTIVO</text>

        {/* N3, N4 */}
        <line x1='80' y1='335' x2='68' y2='335' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='80' y1='285' x2='68' y2='285' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={44} y={335} activo={d.sensor_minimo} label='N3' />
        <SensorSVG x={44} y={285} activo={d.sensor_maximo} label='N4' />

        {/* V4 — Dep. Cultivo → Raceway (sube por arriba) — label encima */}
        <line x1='130' y1='230' x2='130' y2='175' stroke={C.tuberia} strokeWidth='4' />
        <line x1='130' y1='175' x2='220' y2='175' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={155} y={175} abierta={d.valvula_llenado} bloqueada={sinDatos} label='V4'
          labelPos='above'
          onClick={() => !sinDatos && onValvula('v4', d.valvula_llenado)} />
        <line x1='220' y1='160' x2='220' y2='175' stroke={C.tuberia} strokeWidth='4' />
        <rect x='223' y='163' width='52' height='16' rx='3' fill='#fef3c7' stroke='#fbbf24' strokeWidth='1' />
        <text x='249' y='175' fill='#92400e' fontSize='8' textAnchor='middle'>O₂ + CO₂</text>

        {/* V5 — salida exterior */}
        <line x1='115' y1='370' x2='97' y2='420' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={97} y={393} abierta={d.sensor_minimo} bloqueada={sinDatos} label='V5'
          onClick={() => !sinDatos && onValvula('v5', d.sensor_minimo)} />
        <path d='M 72,440 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />
        <path d='M 72,448 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0' fill='none' stroke='#7dd3fc' strokeWidth='1.5' />

        {/* ══════════════════════════════════════
            DEP. COSECHA — centro-bajo
            ══════════════════════════════════════ */}
        <rect x='310' y='430' width='120' height='110' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4' />
        <AguaSVG x={311} y={431} width={118} height={108} nivel={s.nivel} encendido={false} />
        <text x='370' y='422' fill={C.label} fontSize='9' textAnchor='middle' fontWeight='700'>DEP. COSECHA</text>

        {/* N5, N6 */}
        <line x1='430' y1='500' x2='440' y2='500' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='430' y1='465' x2='440' y2='465' stroke='#94a3b8' strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={442} y={500} activo={s.sensor_minimo} label='N5' />
        <SensorSVG x={442} y={465} activo={s.sensor_maximo} label='N6' />

        {/* V6 — Dep. Cultivo → Dep. Cosecha — label debajo */}
        <line x1='148' y1='370' x2='148' y2='468' stroke={C.tuberia} strokeWidth='4' />
        <line x1='148' y1='468' x2='310' y2='468' stroke={C.tuberia} strokeWidth='4' />
        <ValvulaSVG x={215} y={468} abierta={s.valvula_llenado} bloqueada={s.sensor_maximo || sinDatos} label='V6'
          labelPos='below'
          onClick={() => !sinDatos && onValvula('v6', s.valvula_llenado)} />

        {/* ── OVERLAY SIN CONEXIÓN ── */}
        {sinDatos && (
          <g>
            <rect x='0' y='0' width='860' height='600' fill='#e0f2fe' rx='12' opacity='0.45' />
            <text x='430' y='295' fill={C.label} fontSize='14' textAnchor='middle' fontWeight='600'>Sin conexion con la API</text>
            <text x='430' y='315' fill='#64748b' fontSize='11' textAnchor='middle'>Valvulas deshabilitadas</text>
          </g>
        )}

      </svg>
    </div>
  );
}