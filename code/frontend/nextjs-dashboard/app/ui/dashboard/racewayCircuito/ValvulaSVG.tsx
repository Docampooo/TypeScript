// ValvulaSVG — válvula abierta en algae, cerrada en rojo

type ValvulaProps = {
  x: number;
  y: number;
  abierta: boolean;
  label: string;
  onClick: () => void;
  bloqueada?: boolean;
  labelPos?: 'right' | 'below' | 'above';  // posición del label, por defecto 'right'
};

export default function ValvulaSVG({ x, y, abierta, label, onClick, bloqueada = false, labelPos = 'right' }: ValvulaProps) {
  const color  = bloqueada ? '#64748b' : abierta ? '#22c55e' : '#ef4444';
  const stroke = bloqueada ? '#475569' : abierta ? '#16a34a' : '#dc2626';

  //Posicion de la label en funcion de la valvula
  const labelX = labelPos === 'right' ? x + 18 : x;
  const labelY = labelPos === 'below' ? y + 26 : labelPos === 'above' ? y - 16 : y + 4;
  const labelAnchor = labelPos === 'right' ? 'start' : 'middle';

  return (
    <g
      onClick={bloqueada ? undefined : onClick}
      style={{ cursor: bloqueada ? 'not-allowed' : 'pointer', userSelect: 'none' }}
      opacity={bloqueada ? 0.5 : 1}
    >
      <polygon points={`${x},${y-10} ${x+14},${y+10} ${x-14},${y+10}`} fill={color} stroke={stroke} strokeWidth='1.5' />
      <polygon points={`${x},${y+10} ${x+14},${y-10} ${x-14},${y-10}`} fill={color} stroke={stroke} strokeWidth='1.5' />
      {bloqueada && <text x={x-5} y={y+4} fill='#94a3b8' fontSize='10'>X</text>}
      <text x={labelX} y={labelY} fill='#94a3b8' fontSize='10' fontFamily='monospace' textAnchor={labelAnchor}>{label}</text>
    </g>
  );
}