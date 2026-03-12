'use client';

import { useEffect, useState } from 'react';
import { lusitana } from '@/app/ui/fonts';
import { TimeSettings } from '@/app/tipos/raceway';
import { fetchTimeSettings, saveTimeSettings } from '@/app/lib/actions';

const VALVULAS = [
  { key: 'dep_raceway', valvula: 'valvula_llenado', label: 'V1' },
  { key: 'dep_raceway', valvula: 'valvula_vaciado',  label: 'V2' },
  { key: 'dep_cultivo',  valvula: 'valvula_vaciado',  label: 'V3' },
  { key: 'dep_cultivo',  valvula: 'valvula_llenado',  label: 'V4' },
  { key: 'dep_cultivo',  valvula: 'valvula_vaciado',  label: 'V5' },
  { key: 'dep_cosecha',  valvula: 'valvula_llenado',  label: 'V6' },
] as const;

const DEFAULT_SETTINGS: TimeSettings = {
  dep_raceway: { valvula_llenado: 60, valvula_vaciado: 60 },
  dep_cultivo:  { valvula_llenado: 60, valvula_vaciado: 60 },
  dep_cosecha:  { valvula_llenado: 60, valvula_vaciado: 60 },
};

export default function TimeSettingsPanel() {

  const [settings, setSettings] = useState<TimeSettings>(DEFAULT_SETTINGS);
  const [cargando, setCargando]   = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito]         = useState(false);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    fetchTimeSettings()
      .then(data => setSettings(data))
      .catch(() => setError('No se pudieron cargar los tiempos'))
      .finally(() => setCargando(false));
  }, []);

  const handleChange = (
    deposito: keyof TimeSettings,
    valvula: 'valvula_llenado' | 'valvula_vaciado',
    valor: number
  ) => {
    const clamped = Math.min(120, Math.max(0, valor));  // mínimo 0, máximo 120
    setSettings(prev => ({
      ...prev,
      [deposito]: { ...prev[deposito], [valvula]: clamped },
    }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError(null);
    setExito(false);
    try {
      await saveTimeSettings(settings);
      setExito(true);
      setTimeout(() => setExito(false), 2500);
    } catch (e: any) {
      setError(e.message ?? 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm'>

      {/* Cabecera */}
      <div className='mb-4 border-b border-gray-200 pb-3'>
        <p className={`${lusitana.className} text-sm font-bold text-blue-700`}>
          Tiempos de Válvulas
        </p>
        <p className='mt-0.5 text-xs uppercase tracking-widest text-gray-400'>
          Intervalo entre 0 s y 120 s
        </p>
      </div>

      {/* Skeleton */}
      {cargando && (
        <div className='space-y-2'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-9 animate-pulse rounded-xl bg-gray-200' />
          ))}
        </div>
      )}

      {/* Lista de válvulas */}
      {!cargando && (
        <div className='space-y-2'>
          {VALVULAS.map(({ key, valvula, label }) => (
            <div key={label} className='flex items-center gap-3'>

              <span className='w-7 shrink-0 text-center text-xs font-bold text-blue-700 font-mono'>
                {label}
              </span>

              <span className='min-w-0 flex-1 truncate text-xs text-gray-500'>
                {valvula === 'valvula_llenado' ? 'Llenado' : 'Vaciado'}
              </span>

              <div className='flex items-center gap-1'>
                <input
                  type='number'
                  min={0}
                  max={120}
                  step={5}
                  value={settings[key][valvula]}
                  onChange={e => handleChange(key, valvula, Number(e.target.value))}
                  className='w-16 rounded-lg border border-gray-200 bg-white px-2 py-1 text-center text-xs font-semibold text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-300'
                />
                <span className='text-xs text-gray-400'>s</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className='mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-500'>
          {error}
        </p>
      )}

      {/* Botón guardar */}
      <div className='mt-5 flex justify-center'>
        <button
          onClick={handleGuardar}
          disabled={guardando || cargando}
          className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all duration-200 ${
            exito
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {guardando ? 'Guardando...' : exito ? '✓ Guardado' : 'Actualizar'}
        </button>
      </div>

    </div>
  );
}