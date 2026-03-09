//Funcinoes de confirmacion de la API en python

const BASE_URL = 'http://localhost:8000';
import {Estado } from "../tipos/raceway";
// const BASE_URL = 'http://localhost:3333'

export async function fetchEstado(): Promise<Estado> {

  const res = await fetch(`${BASE_URL}/datos`);
  if (!res.ok) throw new Error('Error al obtener el estado');

  return res.json();
}

export async function fase(fase: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/fase${fase}`, { method: 'POST' });
  if (!response.ok) throw new Error(`Error al activar la fase ${fase}`);
}

export async function toggleValvula(valvula: string, abrir: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/${valvula}/${abrir ? 'open' : 'close'}`, { method: 'POST' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail ?? 'Error al accionar valvula');
  }
}