// SensorSVG — sensor activo en algae-400, inactivo en slate

type SensorProps = {
  x: number;
  y: number;
  activo: boolean;
  label: string;
};

export default function SensorSVG({ x, y, activo, label }: SensorProps) {
  // activo → algae-400 (#4ade80)
  // inactivo → slate-600 (#475569)
  const color = activo ? '#4ade80' : '#475569';

  return (
    <g>
      <circle cx={x} cy={y} r='5' fill={color} opacity={activo ? '1' : '0.6'} />
      {activo && (
        <circle cx={x} cy={y} r='5' fill='none' stroke='#4ade80' strokeWidth='1' opacity='0.5'>
          <animate attributeName='r' values='5;9;5' dur='1.5s' repeatCount='indefinite' />
          <animate attributeName='opacity' values='0.5;0;0.5' dur='1.5s' repeatCount='indefinite' />
        </circle>
      )}
      <text x={x-6} y={y-8} fill='#94a3b8' fontSize='9' fontFamily='monospace'>{label}</text>
    </g>
  );
}