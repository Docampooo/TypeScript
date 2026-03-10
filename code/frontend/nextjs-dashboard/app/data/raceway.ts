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
    titulo: 'Motor parado, Valvula abierta',
    utilidad: 'Permite el flujo pasivo del agua sin accion mecanica del motor, util para drenajes controlados o equilibrado de presiones.',
    aplicaciones: ['Drenaje parcial del canal', 'Equilibrado de niveles', 'Limpieza sin agitacion'],
    icono: '■',
    gradiente: 'from-blue-50 to-sky-50',
    acento: 'border-blue-600',
    tag: 'bg-blue-100 text-blue-600',
  },
  {
    id: 3,
    titulo: 'Motor encendido, Valvula abierta',
    utilidad: 'Estado optimo de operacion: flujo maximo con motor activo y valvulas abiertas. Maxima oxigenacion y circulacion del agua.',
    aplicaciones: ['Operacion normal de cultivo', 'Maxima oxigenacion de algas', 'Ciclos de alta produccion'],
    icono: '◈',
    gradiente: 'from-sky-50 to-blue-50',
    acento: 'border-sky-500',
    tag: 'bg-sky-100 text-sky-700',
  },
  {
    id: 4,
    titulo: 'Cerrar todo',
    utilidad: 'Cierre completo del sistema hidraulico. Aisla el circuito para prevenir perdidas y proteger los componentes mecanicos.',
    aplicaciones: ['Parada de emergencia', 'Mantenimiento programado', 'Inspeccion del sistema'],
    icono: '◉',
    gradiente: 'from-sky-50 to-blue-50',
    acento: 'border-amber-400',
    tag: 'bg-amber-50 text-amber-700',
  },
  {
    id: 5,
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
    color: 'from-blue-800 to-blue-700',       // más oscuro
    hoverColor: '',
    btnColor: 'bg-blue-600 hover:bg-blue-500',
    onClick: () => fase('1'),
  },
  {
    id: 2,
    nombre: 'Motor parado, Valvula abierta',
    descripcion: 'Abre las valvulas con el motor parado.',
    icono: '■',
    accion: 'Detener',
    color: 'from-blue-700 to-blue-600',
    hoverColor: '',
    btnColor: 'bg-red-500 hover:bg-red-400',
    onClick: () => fase('2'),
  },
  {
    id: 3,
    nombre: 'Motor encendido, Valvula abierta',
    descripcion: 'Abre valvulas y activa el motor.',
    icono: '◈',
    accion: 'Abrir',
    color: 'from-blue-600 to-sky-600',        // medio
    hoverColor: '',
    btnColor: 'bg-sky-500 hover:bg-sky-400',
    onClick: () => fase('3'),
  },
  {
    id: 4,
    nombre: 'Cerrar todo',
    descripcion: 'Cierra todas las valvulas del circuito.',
    icono: '◉',
    accion: 'Cerrar',
    color: 'from-sky-600 to-sky-500',
    hoverColor: '',
    btnColor: 'bg-amber-500 hover:bg-amber-400',
    onClick: () => fase('4'),
  },
  {
    id: 5,
    nombre: 'Motor sentido contrario',
    descripcion: 'El motor gira en sentido contrario.',
    icono: '◎',
    accion: 'Invertir',
    color: 'from-sky-500 to-sky-400',         // más claro
    hoverColor: '',
    btnColor: 'bg-sky-400 hover:bg-sky-300',
    onClick: () => fase('5'),
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