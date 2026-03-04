'use client';

import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';

//Definicion de constantes
const BASE_URL = 'http://193.146.35.221:8000';
const DEVICE = 'Motor';
const INTERVALO_MS = 1000;

//Los types indican al compilador qué forma tendrá la respuesta JSON de la api
type EstadoMotor = {
  encendido: boolean;
  direccion: 'forward' | 'backward' | null;
};

type EstadoValvula = {
  abierta: boolean;
};

type Estado = {
  motor: EstadoMotor;
  valvula: EstadoValvula;
};

//Peticion HTTP a la API
async function fetchEstado(deviceName: string): Promise<Estado> {

    //cambiar la url a la final
  const res = await fetch(`${BASE_URL}/devices/${deviceName}/status`);

  if (!res.ok) throw new Error('Error al obtener el estado');
  return res.json();
}

//Variables reactivas --> Cuando cambian se actualiza la UI, se vuelve a pintar

//Estado --> guarda los datos del motor y válvula
//Error --> guarda el mensaje si algo falla
//UltimaActualizacion --> guarda la hora del último fetch exitoso
export default function EstadoSistema() {

  const [estado, setEstado] = useState<Estado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('');

  useEffect(() => {
    const actualizar = async () => {

      try {
        const datos = await fetchEstado(DEVICE);

        setEstado(datos);
        setError(null);
        setUltimaActualizacion(new Date().toLocaleTimeString());

      } catch (e) {
        setError('No se puede conectar con la API');
      }
    };

    //Funcion que se repite cada segundo para actualizar la UI
    actualizar();
    const intervalo = setInterval(actualizar, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center bg-gray-950 px-6 py-12">

      {/* Cabecera */}
      <div className="mb-10 text-center">
        <p className={`${lusitana.className} text-3xl font-bold text-white md:text-4xl`}>
          Estado del Sistema
        </p>
        <p className="mt-2 text-xs uppercase tracking-widest text-blue-400/70">
          Actualizacion en tiempo real &middot; cada 1 segundo
        </p>
        {ultimaActualizacion && (
          <p className="mt-1 text-xs text-blue-600">
            Ultima actualizacion: {ultimaActualizacion}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 w-full max-w-2xl rounded-xl border border-red-800 bg-red-950/50 px-6 py-4 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Skeleton mientras carga */}
      {!estado && !error && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-blue-950/40" />
          <div className="h-32 animate-pulse rounded-2xl bg-blue-950/40" />
        </div>
      )}

      {/* Tarjetas de estado */}
      {estado && (
        <div className="w-full max-w-2xl space-y-4">

          {/* Motor */}
          <div className={`relative overflow-hidden rounded-2xl border-l-4 ${ estado.motor.encendido ? 'border-emerald-500 bg-gradient-to-r from-emerald-950 via-blue-950 to-gray-900' : 'border-red-600 bg-gradient-to-r from-red-950 via-blue-950 to-gray-900' } p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${ estado.motor.encendido ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40' : 'bg-red-500/20 ring-1 ring-red-500/40' }`}>
                  &#9881;
                </div>
                <div>
                  <p className={`${lusitana.className} text-xl font-bold text-white`}>Motor</p>
                  <p className="text-sm text-blue-300/70">{DEVICE}</p>
                </div>
              </div>
              {/* Indicador encendido/apagado */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${ estado.motor.encendido ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400' }`}>
                  <span className={`h-2 w-2 rounded-full ${ estado.motor.encendido ? 'bg-emerald-400 animate-pulse' : 'bg-red-500' }`} />
                  {estado.motor.encendido ? 'ENCENDIDO' : 'APAGADO'}
                </span>
              </div>
            </div>

            {/* Direccion */}
            {estado.motor.encendido && estado.motor.direccion && (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                <span className="text-lg">
                  {estado.motor.direccion === 'forward' ? '\u27a1' : '\u2b05'}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-blue-400/60">Direccion</p>
                  <p className="text-sm font-semibold text-white capitalize">
                    {estado.motor.direccion === 'forward' ? 'Avance' : 'Retroceso'}
                  </p>
                </div>
                <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${ estado.motor.direccion === 'forward' ? 'bg-sky-500/20 text-sky-400' : 'bg-purple-500/20 text-purple-400' }`}>
                  {estado.motor.direccion.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Valvula */}
          <div className={`relative overflow-hidden rounded-2xl border-l-4 ${ estado.valvula.abierta ? 'border-sky-500 bg-gradient-to-r from-sky-950 via-blue-950 to-gray-900' : 'border-amber-500 bg-gradient-to-r from-amber-950 via-blue-950 to-gray-900' } p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${ estado.valvula.abierta ? 'bg-sky-500/20 ring-1 ring-sky-500/40' : 'bg-amber-500/20 ring-1 ring-amber-500/40' }`}>
                  &#9685;
                </div>
                <div>
                  <p className={`${lusitana.className} text-xl font-bold text-white`}>Valvula</p>
                  <p className="text-sm text-blue-300/70">Control hidraulico</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${ estado.valvula.abierta ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400' }`}>
                <span className={`h-2 w-2 rounded-full ${ estado.valvula.abierta ? 'bg-sky-400 animate-pulse' : 'bg-amber-500' }`} />
                {estado.valvula.abierta ? 'ABIERTA' : 'CERRADA'}
              </span>
            </div>
          </div>

        </div>
      )}
    </section>
  );
}