import { FuncionOverview } from '@/app/tipos/raceway';

// ─── Stats ────────────────────────────────────────────────────────────────────

export const stats = [
  { valor: '6', label: 'Valvulas controladas' },
  { valor: '5', label: 'Sensores de nivel' },
  { valor: '24/7', label: 'Monitoreo continuo' },
  { valor: 'IoT', label: 'Conectividad en tiempo real' },
];

// ─── Fase 1 — Dep. Raceway ────────────────────────────────────────────────────

export const fase1Info: FuncionOverview[] = [
  {
    id: 1,
    titulo: 'V1 — Llenado del Deposito Raceway',
    utilidad: 'Abre la entrada de agua al deposito del raceway. El sensor maximo N2 bloquea automaticamente la valvula cuando el deposito esta lleno para evitar desbordamientos.',
    aplicaciones: ['Inicio del ciclo hidraulico', 'Reposicion de agua evaporada', 'Preparacion del medio de cultivo'],
    icono: '💧',
    gradiente: 'from-blue-50 to-sky-50',
    acento: 'border-blue-700',
    tag: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    titulo: 'Vaciado Manual',
    utilidad: 'El deposito del raceway no dispone de valvula de vaciado automatica. El vaciado se realiza de forma manual directamente sobre el deposito fisico cuando sea necesario.',
    aplicaciones: ['Mantenimiento del deposito', 'Limpieza periodica', 'Cambio de agua del sistema'],
    icono: '🔧',
    gradiente: 'from-slate-50 to-gray-50',
    acento: 'border-gray-400',
    tag: 'bg-gray-100 text-gray-600',
  },
];

// ─── Fase 2 — Dep. Cultivo ────────────────────────────────────────────────────

export const fase2Info: FuncionOverview[] = [
  {
    id: 1,
    titulo: 'V2 — Llenado del Deposito de Cultivo',
    utilidad: 'Transfiere el contenido del deposito del raceway al deposito de cultivo. Inicia el proceso de preparacion del medio con microalgas.',
    aplicaciones: ['Carga del medio de cultivo', 'Inicio del ciclo de enriquecimiento', 'Transferencia de biomasa'],
    icono: '🔄',
    gradiente: 'from-blue-50 to-sky-50',
    acento: 'border-blue-600',
    tag: 'bg-blue-100 text-blue-700',
  },
  {
    id: 2,
    titulo: 'V3 — Inyeccion de Gases O₂ + CO₂',
    utilidad: 'Introduce una mezcla de oxigeno y dioxido de carbono en el deposito de cultivo. El CO₂ actua como fuente de carbono para la fotosintesis y el O₂ favorece la oxigenacion del medio.',
    aplicaciones: ['Enriquecimiento del medio de cultivo', 'Estimulacion del crecimiento de microalgas', 'Control de pH mediante CO₂'],
    icono: '💨',
    gradiente: 'from-sky-50 to-cyan-50',
    acento: 'border-sky-500',
    tag: 'bg-sky-100 text-sky-700',
  },
  {
    id: 3,
    titulo: 'V4 — Transferencia al Raceway',
    utilidad: 'Vuelca el contenido del deposito de cultivo — agua, microalgas y gases disueltos — directamente al canal del raceway para iniciar o continuar el ciclo de produccion.',
    aplicaciones: ['Inoculacion del raceway', 'Reposicion de biomasa', 'Inicio del ciclo de produccion'],
    icono: '➡',
    gradiente: 'from-cyan-50 to-teal-50',
    acento: 'border-cyan-500',
    tag: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 4,
    titulo: 'V5 — Vaciado Exterior',
    utilidad: 'Drena el contenido del deposito de cultivo hacia el exterior del sistema. Se utiliza para limpiezas, purgas o cuando el cultivo no es apto para transferir al raceway.',
    aplicaciones: ['Purga del sistema', 'Eliminacion de cultivo contaminado', 'Limpieza del deposito'],
    icono: '🚰',
    gradiente: 'from-teal-50 to-emerald-50',
    acento: 'border-teal-500',
    tag: 'bg-teal-100 text-teal-700',
  },
];

// ─── Fase 3 — Dep. Cosecha ────────────────────────────────────────────────────

export const fase3Info: FuncionOverview[] = [
  {
    id: 1,
    titulo: 'V6 — Llenado del Deposito de Cosecha',
    utilidad: 'Transfiere el contenido del deposito de cultivo al deposito de cosecha para su procesado final. El sensor maximo N5 bloquea la valvula cuando el deposito esta lleno.',
    aplicaciones: ['Recogida de biomasa de microalgas', 'Inicio del proceso de cosecha', 'Separacion del cultivo para analisis'],
    icono: '🌿',
    gradiente: 'from-emerald-50 to-green-50',
    acento: 'border-emerald-600',
    tag: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2,
    titulo: 'Vaciado Manual',
    utilidad: 'El deposito de cosecha no dispone de valvula de vaciado automatica. Una vez recogida la biomasa, el vaciado y limpieza del deposito se realiza manualmente.',
    aplicaciones: ['Extraccion de la biomasa cosechada', 'Limpieza del deposito tras cosecha', 'Preparacion para el siguiente ciclo'],
    icono: '🔧',
    gradiente: 'from-slate-50 to-gray-50',
    acento: 'border-gray-400',
    tag: 'bg-gray-100 text-gray-600',
  },
];

// ─── Leyenda ──────────────────────────────────────────────────────────────────

export const leyendaValvulas = [
  { color: 'bg-algae-500', texto: 'Valvula abierta' },
  { color: 'bg-red-400',   texto: 'Valvula cerrada' },
  { color: 'bg-gray-300',  texto: 'Valvula bloqueada' },
  { color: 'bg-algae-400', texto: 'Sensor activo' },
];