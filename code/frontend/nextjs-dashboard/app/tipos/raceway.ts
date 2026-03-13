// ─── Depósitos ────────────────────────────────────────────────────────────────

export type Dep_raceway = {
  nivel: number;
  sensor_minimo: boolean;
  sensor_maximo: boolean;
  valvula_llenado: boolean;            // V1
};

export type Dep_cultivo = {
  nivel: number;
  sensor_minimo: boolean;
  sensor_maximo: boolean;
  valvula_llenado: boolean;            // V2
  valvula_gas: boolean;                // V3 — gases O₂+CO₂
  valvula_llenado_raceway: boolean;    // V4 — vuelca contenido al raceway
  valvula_vaciado: boolean;            // V5 — vaciado exterior
};

export type Dep_cosecha = {
  nivel: number;
  sensor_maximo: boolean;
  valvula_llenado: boolean;            // V6
};

export type Estado = {
  motor: {
    encendido: boolean;
  };
  dep_raceway: Dep_raceway;
  dep_cultivo:  Dep_cultivo;
  dep_cosecha:  Dep_cosecha;
};

// ─── Time Settings ────────────────────────────────────────────────────────────

export type DepositoTiempos = {
  valvula_llenado: number;
  valvula_vaciado: number;
};

export type TimeSettings = {
  dep_raceway: DepositoTiempos;
  dep_cultivo:  DepositoTiempos;
  dep_cosecha:  DepositoTiempos;
};

// ─── Tarjetas de control ──────────────────────────────────────────────────────

export type FuncionMotor = {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  accion: string;
  color: string;
  hoverColor: string;
  btnColor: string;
  onClick: () => Promise<void>;
};

export type FuncionOverview = {
  id: number;
  titulo: string;
  utilidad: string;
  aplicaciones: string[];
  icono: string;
  gradiente: string;
  acento: string;
  tag: string;
};

export type StatItem = {
  valor: string;
  label: string;
};

export type NivelItem = {
  label: string;
  nivel: number;
  color: string;
};

export type MetricFileName =
  | 'detailed_df_t.json'
  | 'detailed_df_t1_ext.json'
  | 'detailed_df_t1.json';