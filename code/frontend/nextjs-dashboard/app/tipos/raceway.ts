export type MetricFileName =
  | 'detailed_df_t.json'
  | 'detailed_df_t1_ext.json'
  | 'detailed_df_t1.json';

export type Deposito = {

  nivel: number;

  sensor_minimo: boolean;
  sensor_maximo: boolean;

  valvula_vaciado: boolean;
  valvula_llenado: boolean
}

export type Estado = {

  motor: {
    encendido: boolean;
    forward: boolean;
  };

  raceway: Deposito

  deposito: Deposito

  salida: Deposito

};