// Esquema del raceway — fondo sky-100, paleta clara
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

  // Valores por defecto cuando no hay conexión — todo cerrado/apagado
  const r = estado?.raceway ?? {
    nivel: 0, sensor_minimo: false, sensor_maximo: false,
    valvula_vaciado: false, valvula_llenado: false,
  };
  const d = estado?.deposito ?? {
    nivel: 0, sensor_minimo: false, sensor_maximo: false,
    valvula_vaciado: false, valvula_llenado: false,
  };
  const s = estado?.salida ?? {
    nivel: 0, sensor_minimo: false, sensor_maximo: false,
    valvula_vaciado: false, valvula_llenado: false,
  };
  const m = estado?.motor ?? { encendido: false, forward: false };

  const bloqueos = {
    v1: r.sensor_minimo,
    v2: r.sensor_maximo,
    v3: d.sensor_minimo,
    v4: d.sensor_maximo,
    v5: s.sensor_minimo,
    v6: s.sensor_maximo,
  };

  const C = {
    fondo:        '#e0f2fe',  // sky-100
    tuberia:      '#0369a1',  // sky-700
    tuberiaActiva:'#0284c7',  // sky-600
    borde:        '#075985',  // sky-800
    bordeGrosor:  3,
    label:        '#0c4a6e',  // sky-900
    labelTenue:   '#7dd3fc',  // sky-300
    motorFondoOn: '#dcfce7',
    motorFondoOff:'#f1f5f9',
    motorBordeOn: '#16a34a',
    motorBordeOff:'#94a3b8',
    motorTextoOn: '#15803d',
    motorTextoOff:'#64748b',
    motorEstOn:   '#16a34a',
    motorEstOff:  '#ef4444',
    flujoOn:      '#0284c7',
    flujoOff:     '#bae6fd',
    flujoAnim1:   '#0284c7',
    flujoAnim2:   '#38bdf8',
  };

  return (
    <div className='w-full rounded-2xl border border-gray-200 bg-sky-100 p-3 shadow-sm'>
      <svg viewBox='0 0 780 420' className='w-full' style={{ fontFamily: 'monospace' }}>
        <rect width='780' height='420' fill={C.fondo} rx='12' />

        {/* ── TANQUE RACEWAY ── */}
        <rect x='480' y='80' width='120' height='160' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4' />
        <AguaSVG x={481} y={81} width={118} height={158} nivel={r.nivel} encendido={m.encendido} />
        <text x='540' y='72' fill={C.label} fontSize='11' textAnchor='middle' fontWeight='600'>RACEWAY</text>
        <line x1='540' y1='30' x2='540' y2='80' stroke={C.tuberia} strokeWidth='6' />
        <line x1='480' y1='30' x2='700' y2='30' stroke={C.tuberia} strokeWidth='6' />
        <line x1='700' y1='30' x2='700' y2='80' stroke={C.tuberia} strokeWidth='6' />

        <ValvulaSVG x={700} y={110} abierta={r.valvula_llenado} bloqueada={bloqueos.v2 || sinDatos} label='V2' onClick={() => !sinDatos && onValvula('v2', r.valvula_llenado)} />
        <line x1='540' y1='240' x2='540' y2='300' stroke={C.tuberia} strokeWidth='6' />
        <ValvulaSVG x={540} y={310} abierta={r.valvula_vaciado} bloqueada={bloqueos.v1 || sinDatos} label='V1' onClick={() => !sinDatos && onValvula('v1', r.valvula_vaciado)} />
        <line x1='475' y1='170' x2='480' y2='170' stroke={C.labelTenue} strokeWidth='1.5' strokeDasharray='3,2' />
        <line x1='475' y1='120' x2='480' y2='120' stroke={C.labelTenue} strokeWidth='1.5' strokeDasharray='3,2' />
        <SensorSVG x={468} y={170} activo={r.sensor_minimo} label='N1' />
        <SensorSVG x={468} y={120} activo={r.sensor_maximo} label='N2' />

        {/* ── DEPOSITO CO2/O2 ── */}
        <polygon points='270,100 350,100 330,210 290,210' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} />
        {d.nivel > 0 && (
          <g>
            <defs><clipPath id='clip-deposito'><polygon points='270,100 350,100 330,210 290,210' /></clipPath></defs>
            <rect x='270' y={210-(110*d.nivel/100)} width='80' height={110*d.nivel/100} fill='#a78bfa' opacity='0.4' clipPath='url(#clip-deposito)' />
          </g>
        )}
        <text x='310' y='92' fill={C.label} fontSize='10' textAnchor='middle' fontWeight='600'>DEPOSITO CO2/O2</text>
        <line x1='310' y1='50' x2='310' y2='100' stroke={C.tuberia} strokeWidth='5' />
        <ValvulaSVG x={310} y={65} abierta={d.valvula_llenado} bloqueada={bloqueos.v4 || sinDatos} label='V4' onClick={() => !sinDatos && onValvula('v4', d.valvula_llenado)} />
        <line x1='310' y1='210' x2='310' y2='270' stroke={C.tuberia} strokeWidth='5' />
        <ValvulaSVG x={310} y={255} abierta={d.valvula_vaciado} bloqueada={bloqueos.v3 || sinDatos} label='V3' onClick={() => !sinDatos && onValvula('v3', d.valvula_vaciado)} />
        <SensorSVG x={355} y={185} activo={d.sensor_minimo} label='N3' />
        <SensorSVG x={355} y={135} activo={d.sensor_maximo} label='N4' />

        {/* ── ZONA SALIDA ── */}
        <rect x='60' y='120' width='100' height='100' fill='white' stroke={C.borde} strokeWidth={C.bordeGrosor} rx='4' />
        <AguaSVG x={61} y={121} width={98} height={98} nivel={s.nivel} />
        <text x='110' y='112' fill={C.label} fontSize='10' textAnchor='middle' fontWeight='600'>SALIDA</text>
        <line x1='110' y1='220' x2='110' y2='290' stroke={C.tuberia} strokeWidth='5' />
        <ValvulaSVG x={110} y={278} abierta={s.valvula_vaciado} bloqueada={bloqueos.v5 || sinDatos} label='V5' onClick={() => !sinDatos && onValvula('v5', s.valvula_vaciado)} />
        <line x1='110' y1='120' x2='110' y2='60' stroke={C.tuberia} strokeWidth='5' />
        <ValvulaSVG x={110} y={72} abierta={s.valvula_llenado} bloqueada={bloqueos.v6 || sinDatos} label='V6' onClick={() => !sinDatos && onValvula('v6', s.valvula_llenado)} />
        <SensorSVG x={50} y={195} activo={s.sensor_minimo} label='N5' />
        <SensorSVG x={50} y={150} activo={s.sensor_maximo} label='N6' />

        {/* ── MOTOR ── */}
        <circle cx='390' cy='360' r='28'
          fill={m.encendido ? C.motorFondoOn : C.motorFondoOff}
          stroke={m.encendido ? C.motorBordeOn : C.motorBordeOff}
          strokeWidth='2.5'
        />
        {m.encendido && (
          <circle cx='390' cy='360' r='34' fill='none' stroke={C.motorBordeOn} strokeWidth='1' opacity='0.5'>
            <animate attributeName='r' values='28;36;28' dur='2s' repeatCount='indefinite' />
            <animate attributeName='opacity' values='0.5;0;0.5' dur='2s' repeatCount='indefinite' />
          </circle>
        )}
        <text x='390' y='356' fill={m.encendido ? C.motorTextoOn : C.motorTextoOff} fontSize='11' textAnchor='middle' fontWeight='600'>MOTOR</text>
        <text x='390' y='370' fill={m.encendido ? C.motorEstOn : C.motorEstOff} fontSize='9' textAnchor='middle'>
          {m.encendido ? (m.forward === true ? '>> FWD' : '<< BWD') : 'OFF'}
        </text>

        {/* Conexiones motor */}
        <line x1='310' y1='360' x2='362' y2='360' stroke={C.tuberia} strokeWidth='3' strokeDasharray='4,3' />
        <line x1='310' y1='270' x2='310' y2='360' stroke={C.tuberia} strokeWidth='3' strokeDasharray='4,3' />
        <line x1='418' y1='360' x2='460' y2='360' stroke={C.tuberia} strokeWidth='3' strokeDasharray='4,3' />
        <line x1='460' y1='360' x2='460' y2='330' stroke={C.tuberia} strokeWidth='3' strokeDasharray='4,3' />

        {/* Línea de flujo principal */}
        <line x1='160' y1='170' x2='480' y2='170'
          stroke={m.encendido ? C.flujoOn : C.flujoOff}
          strokeWidth='4'
        >
          {m.encendido && (
            <animate attributeName='stroke'
              values={`${C.flujoAnim1};${C.flujoAnim2};${C.flujoAnim1}`}
              dur='1.5s' repeatCount='indefinite'
            />
          )}
        </line>

        {/* Overlay sin conexión — semitransparente para que el esquema siga visible */}
        {sinDatos && (
          <g>
            <rect x='0' y='0' width='780' height='420' fill='#e0f2fe' rx='12' opacity='0.45' />
            <text x='390' y='205' fill={C.label} fontSize='14' textAnchor='middle' fontWeight='600'>Sin conexion con la API</text>
            <text x='390' y='223' fill='#64748b' fontSize='11' textAnchor='middle'>Valvulas deshabilitadas</text>
          </g>
        )}
      </svg>
    </div>
  );
}