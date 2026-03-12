// Funciones de comunicacion con la API intermedia en Python

import { Estado, TimeSettings } from '@/app/tipos/raceway';

const BASE_URL = 'http://localhost:8000';

export async function fetchEstado(): Promise<Estado> {
  const res = await fetch(`${BASE_URL}/datos`);
  if (!res.ok) throw new Error('Error al obtener el estado');
  return res.json();
}

export async function fase(estado: boolean, direccion: boolean): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/${estado}?direccion=${direccion}`,
    { method: 'POST' }
  );
  if (!response.ok) throw new Error('No se pudo ejecutar la fase');
}

//Parsea el valor que devuelven las valvulas con el click para enviar el id a la api
const VALVULA_IDS: Record<string, number> = {
  v1: 1, v2: 2, v3: 3, v4: 4, v5: 5, v6: 6,
};

export async function toggleValvula(valvula: string, abrir: boolean): Promise<void> {
  const id = VALVULA_IDS[valvula];
  if (!id) throw new Error(`Valvula desconocida: ${valvula}`);

  const res = await fetch(
    `${BASE_URL}/valvula/${id}/${abrir}`,
    { method: 'POST' }
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? 'Error al accionar valvula');
  }
}

// ─── Time Settings ────────────────────────────────────────────────────────────
 
export async function fetchTimeSettings(): Promise<TimeSettings> {
  const res = await fetch(`${BASE_URL}/time-settings`);
  if (!res.ok) throw new Error('Error al obtener los tiempos');
  return res.json();
}
 
export async function saveTimeSettings(settings: TimeSettings): Promise<void> {
    console.log('TimeSettings enviado:', JSON.stringify(settings, null, 2)); // ← añade esto
  const res = await fetch(`${BASE_URL}/time-settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? 'Error al guardar los tiempos');
  }
}