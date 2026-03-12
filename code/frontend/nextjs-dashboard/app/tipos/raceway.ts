export type MetricFileName =
  | 'detailed_df_t.json'
  | 'detailed_df_t1_ext.json'
  | 'detailed_df_t1.json';

export type Deposito = {
  nivel: number;
  sensor_minimo: boolean;
  sensor_maximo: boolean;
  valvula_vaciado: boolean;
  valvula_llenado: boolean;
};

export type Estado = {

  motor: {
    encendido: boolean;
    forward: boolean;
  };

  dep_raceway: Deposito   // Depósito conectado al canal oval

  dep_cultivo: Deposito   // Depósito de cultivo (trapezoidal)

  dep_cosecha: Deposito   // Depósito de cosecha

};

//Funciones de control de motor, valvulas y sensores
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

//esquema raceway
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

export type DepositoTiempos = {
  valvula_llenado: number; // 30–120 segundos
  valvula_vaciado: number; // 30–120 segundos
};
 
export type TimeSettings = {
  dep_raceway: DepositoTiempos;
  dep_cultivo:  DepositoTiempos;
  dep_cosecha:  DepositoTiempos;
};