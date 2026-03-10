// ValvulaSVG — válvula abierta en algae, cerrada en rojo

type ValvulaProps = {
  x: number;
  y: number;
  abierta: boolean;
  label: string;
  onClick: () => void;
  bloqueada?: boolean;
};

export default function ValvulaSVG({ x, y, abierta, label, onClick, bloqueada = false }: ValvulaProps) {
  // abierta  → algae-500 / algae-600
  // cerrada  → rojo
  // bloqueada → slate gris
  const color  = bloqueada ? '#64748b' : abierta ? '#22c55e' : '#ef4444';
  const stroke = bloqueada ? '#475569' : abierta ? '#16a34a' : '#dc2626';

  return (
    <g
      onClick={bloqueada ? undefined : onClick}
      style={{ cursor: bloqueada ? 'not-allowed' : 'pointer', userSelect: 'none' }}
      opacity={bloqueada ? 0.5 : 1}
    >
      <polygon points={`${x},${y-10} ${x+14},${y+10} ${x-14},${y+10}`} fill={color} stroke={stroke} strokeWidth='1.5' />
      <polygon points={`${x},${y+10} ${x+14},${y-10} ${x-14},${y-10}`} fill={color} stroke={stroke} strokeWidth='1.5' />
      {bloqueada && <text x={x-5} y={y+4} fill='#94a3b8' fontSize='10'>X</text>}
      <text x={x+18} y={y+4} fill='#94a3b8' fontSize='10' fontFamily='monospace'>{label}</text>
    </g>
  );
}