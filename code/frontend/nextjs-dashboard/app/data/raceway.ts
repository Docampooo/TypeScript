import { fase } from '@/app/lib/actions';
import { FuncionMotor } from '@/app/tipos/raceway';

// ─── Overview ────────────────────────────────────────────────────────────────

export const stats = [
  { valor: '5', label: 'Modos de operacion' },
  { valor: '24/7', label: 'Monitoreo continuo' },
  { valor: '100%', label: 'Control remoto' },
  { valor: 'IoT', label: 'Conectividad en tiempo real' },
];

export const funciones = [
  {
    id: 1,
    titulo: 'Iniciar Motor',
    utilidad: 'Pone en marcha el sistema de bombeo principal, iniciando la circulacion activa del agua a traves del canal del raceway.',
    aplicaciones: ['Inicio de jornada de cultivo', 'Reinicio tras mantenimiento', 'Activacion del ciclo de oxigenacion'],
    icono: '▶',
    gradiente: 'from-blue-50 to-sky-50',
    acento: 'border-blue-700',
    tag: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    titulo: 'Cerrar todo',
    utilidad: 'Cierre completo del sistema hidraulico. Aisla el circuito para prevenir perdidas y proteger los componentes mecanicos.',
    aplicaciones: ['Parada de emergencia', 'Mantenimiento programado', 'Inspeccion del sistema'],
    icono: '◉',
    gradiente: 'from-sky-50 to-blue-50',
    acento: 'border-amber-400',
    tag: 'bg-amber-50 text-amber-700',
  },
  {
    id: 3,
    titulo: 'Direccion Opuesta',
    utilidad: 'Invierte el sentido del flujo en el canal. Util para limpiezas profundas y uniformidad del cultivo a lo largo del raceway.',
    aplicaciones: ['Limpieza profunda del canal', 'Distribucion uniforme de nutrientes', 'Prevencion de sedimentos'],
    icono: '◎',
    gradiente: 'from-sky-50 to-cyan-50',
    acento: 'border-sky-400',
    tag: 'bg-sky-100 text-sky-600',
  },
];

// ─── FuncionesMotor ───────────────────────────────────────────────────────────
// Degradado azul: carta 1 más oscura → carta 5 más clara
// Diferencia sutil — mismo tono, distinto nivel de profundidad

export const motorFunctions: FuncionMotor[] = [
  {
    id: 1,
    nombre: 'Iniciar Motor',
    descripcion: 'Activa el sistema de bombeo principal del raceway.',
    icono: '▶',
    accion: 'Iniciar',
    color: 'from-blue-800 to-blue-700',
    hoverColor: '',
    btnColor: 'bg-blue-600 hover:bg-blue-500',
    onClick: () => fase(true, true),
  },
  {
    id: 2,
    nombre: 'Cerrar todo',
    descripcion: 'Cierra todas las valvulas del circuito.',
    icono: '◉',
    accion: 'Cerrar',
    color: 'from-sky-600 to-sky-500',
    hoverColor: '',
    btnColor: 'bg-amber-500 hover:bg-amber-400',
    onClick: () => fase(false, true),
  },
  {
    id: 3,
    nombre: 'Motor sentido contrario',
    descripcion: 'El motor gira en sentido contrario.',
    icono: '◎',
    accion: 'Invertir',
    color: 'from-sky-500 to-sky-400',
    hoverColor: '',
    btnColor: 'bg-sky-400 hover:bg-sky-300',
    onClick: () => fase(true, false),
  },
];

// ─── Raceway Schema ───────────────────────────────────────────────────────────

export const nivelesConfig = [
  { label: 'Salida',          color: 'bg-sky-500' },
  { label: 'Deposito CO2/O2', color: 'bg-purple-400' },
  { label: 'Raceway',         color: 'bg-algae-500' },
];

export const leyendaValvulas = [
  { color: 'bg-algae-500',  texto: 'Valvula abierta' },
  { color: 'bg-red-400',    texto: 'Valvula cerrada' },
  { color: 'bg-gray-300',   texto: 'Valvula bloqueada' },
  { color: 'bg-algae-400',  texto: 'Sensor activo' },
];