// AguaSVG — paleta water/algae

type AguaProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  nivel: number;
  encendido?: boolean;
};

export default function AguaSVG({ x, y, width, height, nivel, encendido }: AguaProps) {
  const aguaHeight = (height * nivel) / 100;
  const aguaY = y + height - aguaHeight;
  return (
    <g>
      <defs>
        <clipPath id={`clip-${x}-${y}`}>
          <rect x={x} y={y} width={width} height={height} />
        </clipPath>
      </defs>
      {nivel > 0 && (
        <g clipPath={`url(#clip-${x}-${y})`}>
          {/* Cuerpo del agua — water-700 con toque algae */}
          <rect x={x} y={aguaY} width={width} height={aguaHeight} fill='#0e7490' opacity='0.65' />
          {/* Ola superficial — water-300/500 */}
          <path
            d={`M${x} ${aguaY} Q${x+width*0.25} ${aguaY-4} ${x+width*0.5} ${aguaY} Q${x+width*0.75} ${aguaY+4} ${x+width} ${aguaY}`}
            fill='none' stroke='#67e8f9' strokeWidth='2' opacity={encendido ? '1' : '0.4'}
          >
            {encendido && (
              <animate attributeName='d'
                values={`M${x} ${aguaY} Q${x+width*0.25} ${aguaY-4} ${x+width*0.5} ${aguaY} Q${x+width*0.75} ${aguaY+4} ${x+width} ${aguaY};M${x} ${aguaY} Q${x+width*0.25} ${aguaY+4} ${x+width*0.5} ${aguaY} Q${x+width*0.75} ${aguaY-4} ${x+width} ${aguaY};M${x} ${aguaY} Q${x+width*0.25} ${aguaY-4} ${x+width*0.5} ${aguaY} Q${x+width*0.75} ${aguaY+4} ${x+width} ${aguaY}`}
                dur='2s' repeatCount='indefinite'
              />
            )}
          </path>
          {/* Tinte verde alga en el agua cuando motor activo */}
          {encendido && (
            <rect x={x} y={aguaY} width={width} height={aguaHeight} fill='#15803d' opacity='0.15' />
          )}
        </g>
      )}
    </g>
  );
}