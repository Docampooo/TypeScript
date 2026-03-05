'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { fase } from '@/app/lib/actions';

const DEVICE = 'motor';
const INTERVALO_MS = 1000;

//bateria de pruebas local
// const BASE_URL = 'http://localhost:3333'
const BASE_URL = 'http:localhost:8000';

type FuncionMotor = {
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

type EstadoMotor = {
  encendido: boolean;
  direccion: 'forward' | 'backward' | null;
};

type EstadoValvula = {
  abierta: boolean;
};

type Estado = {
  motor: { encendido: boolean; direccion: 'forward' | 'backward' | null };
  raceway: { nivel_agua: number; n1_minimo: boolean; n2_maximo: boolean; v1_vaciado: boolean; v2_llenado: boolean };
  deposito: { nivel: number; n3_minimo: boolean; n4_maximo: boolean; v3_entrada: boolean; v4_salida: boolean };
  salida: { nivel: number; n5_minimo: boolean; n6_maximo: boolean; v5_salida: boolean; v6_salida: boolean };
};

async function fetchEstado(deviceName: string): Promise<Estado> {
  const res = await fetch(`${BASE_URL}/devices/${deviceName}/status`);
  if (!res.ok) throw new Error('Error al obtener el estado');
  return res.json();
}

const motorFunctions: FuncionMotor[] = [
  {
    id: 1,
    nombre: 'Iniciar Motor',
    descripcion: 'Activa el sistema de bombeo principal del raceway y pone en marcha el ciclo de circulacion de agua.',
    icono: '▶',
    accion: 'Iniciar',
    color: 'from-blue-900 to-blue-700',
    hoverColor: 'hover:from-blue-800 hover:to-blue-600',
    btnColor: 'bg-emerald-500 hover:bg-emerald-400',
    onClick: () => fase(1),
  },
];

export default function Page() {

  // Estado UI de los botones
  const [cargando, setCargando] = useState<number | null>(null);
  const [exito, setExito] = useState<number | null>(null);
  const [errorId, setErrorId] = useState<number | null>(null);

  // Estado en tiempo real del sistema
  const [estado, setEstado] = useState<Estado | null>(null);
  const [errorEstado, setErrorEstado] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<string>('');

  // Polling cada segundo
  useEffect(() => {
    const actualizar = async () => {
      try {
        const datos = await fetchEstado(DEVICE);
        setEstado(datos);
        setErrorEstado(null);
        setUltimaActualizacion(new Date().toLocaleTimeString());
      } catch (e) {
        setErrorEstado('Sin conexion con la API');
      }
    };
    actualizar();
    const intervalo = setInterval(actualizar, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, []);

  const ejecutar = async (fn: FuncionMotor) => {
    setCargando(fn.id);
    setErrorId(null);
    try {
      await fn.onClick();
      setExito(fn.id);
      setTimeout(() => setExito(null), 2000);
    } catch (e) {
      setErrorId(fn.id);
      setTimeout(() => setErrorId(null), 3000);
    } finally {
      setCargando(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-950 px-6 py-12">

      {/* Encabezado */}
      <div className="mb-12 text-center">
        <p className={`${lusitana.className} text-3xl font-bold text-white md:text-4xl`}>
          Operaciones con el Motor
        </p>
        <p className="mt-2 text-blue-400 text-sm md:text-base tracking-widest uppercase">
          Panel de control del raceway
        </p>
        <div className="mx-auto mt-4 h-px w-24 bg-blue-500 opacity-60" />
      </div>

      {/* Layout principal: tarjetas + aside */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

        {/* Tarjetas de funciones */}
        <section className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
          {motorFunctions.map((fn) => {
            const estaCargando = cargando === fn.id;
            const fueExito = exito === fn.id;
            const fueError = errorId === fn.id;

            return (
              <div
                key={fn.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${fn.color} ${fn.hoverColor} p-4 shadow-lg shadow-blue-950/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/60 border ${fueError ? 'border-red-500' : fueExito ? 'border-emerald-500' : 'border-blue-800/30'}`}
              >
                <div className="pointer-events-none absolute right-4 top-4 text-6xl opacity-5 select-none">
                  {fn.icono}
                </div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl text-blue-200 ring-1 ring-white/10">
                  {fn.icono}
                </div>
                <div className="flex-1">
                  <h2 className={`${lusitana.className} mb-1 text-base font-bold text-white`}>
                    {fn.nombre}
                  </h2>
                  <p className="text-xs leading-relaxed text-blue-200/80">
                    {fn.descripcion}
                  </p>
                </div>
                {fueExito && (
                  <p className="mt-3 text-xs font-semibold text-emerald-400">✓ Ejecutado correctamente</p>
                )}
                {fueError && (
                  <p className="mt-3 text-xs font-semibold text-red-400">✕ Error al ejecutar</p>
                )}
                <button
                  onClick={() => ejecutar(fn)}
                  disabled={estaCargando || cargando !== null}
                  className={`mt-3 w-full rounded-lg ${fn.btnColor} px-3 py-2 text-xs font-semibold text-white shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {estaCargando ? 'Ejecutando...' : fn.accion}
                </button>
              </div>
            );
          })}
        </section>

        {/* Aside: estado en tiempo real */}
        <aside className="w-full lg:w-[420px] xl:w-[480px] lg:sticky lg:top-6">
          <div className="rounded-2xl border border-blue-800/30 bg-gray-900 p-6 shadow-xl shadow-blue-950/40">

            {/* Cabecera del aside */}
            <div className="mb-6 border-b border-blue-800/30 pb-4">
              <p className={`${lusitana.className} text-lg font-bold text-white`}>
                Estado del Sistema
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-blue-400/70">
                Tiempo real &middot; cada 1s
              </p>
              {ultimaActualizacion && (
                <p className="mt-1 text-xs text-blue-700">
                  Actualizado: {ultimaActualizacion}
                </p>
              )}
            </div>

            {/* Error de conexion */}
            {errorEstado && (
              <div className="mb-4 rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-center text-xs text-red-400">
                {errorEstado}
              </div>
            )}

            {/* Skeleton */}
            {!estado && !errorEstado && (
              <div className="space-y-4">
                <div className="h-28 animate-pulse rounded-2xl bg-blue-950/40" />
                <div className="h-20 animate-pulse rounded-2xl bg-blue-950/40" />
              </div>
            )}

            {/* Tarjetas de estado */}
            {estado && (
              <div className="space-y-4">

                {/* Motor */}
                <div className={`relative overflow-hidden rounded-2xl border-l-4 ${ estado.motor.encendido ? 'border-emerald-500 bg-gradient-to-r from-emerald-950/60 to-blue-950/60' : 'border-red-600 bg-gradient-to-r from-red-950/60 to-blue-950/60' } p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-2xl ${ estado.motor.encendido ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40' : 'bg-red-500/20 ring-1 ring-red-500/40' }`}>
                        &#9881;
                      </div>
                      <p className={`${lusitana.className} font-bold text-white`}>Motor</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ estado.motor.encendido ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400' }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${ estado.motor.encendido ? 'bg-emerald-400 animate-pulse' : 'bg-red-500' }`} />
                      {estado.motor.encendido ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  {estado.motor.encendido && estado.motor.direccion && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                      <span className="text-base">
                        {estado.motor.direccion === 'forward' ? '➡' : '⬅'}
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-blue-400/60">Direccion</p>
                        <p className="text-xs font-semibold text-white">
                          {estado.motor.direccion === 'forward' ? 'Avance' : 'Retroceso'}
                        </p>
                      </div>
                      <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${ estado.motor.direccion === 'forward' ? 'bg-sky-500/20 text-sky-400' : 'bg-purple-500/20 text-purple-400' }`}>
                        {estado.motor.direccion.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Valvula */}
                <div className={`relative overflow-hidden rounded-2xl border-l-4 ${ estado.raceway.v2_llenado ? 'border-sky-500 bg-gradient-to-r from-sky-950/60 to-blue-950/60' : 'border-amber-500 bg-gradient-to-r from-amber-950/60 to-blue-950/60' } p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-2xl ${ estado.raceway.v2_llenado ? 'bg-sky-500/20 ring-1 ring-sky-500/40' : 'bg-amber-500/20 ring-1 ring-amber-500/40' }`}>
                        &#9685;
                      </div>
                      <p className={`${lusitana.className} font-bold text-white`}>Valvula</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ estado.raceway.v2_llenado ? 'bg-sky-500/20 text-sky-400' : 'bg-amber-500/20 text-amber-400' }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${ estado.raceway.v2_llenado ? 'bg-sky-400 animate-pulse' : 'bg-amber-500' }`} />
                      {estado.raceway.v2_llenado ? 'ABIERTA' : 'CERRADA'}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </aside>

      </div>
    </main>
  );
}