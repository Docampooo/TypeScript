//Bateria de pruebas
const BASE_URL = 'http://localhost:3333'
// const BASE_URL = 'http://193.146.35.221:8000';

//Fases del motor y válvulas
export async function fase1(deviceName: string, duration: number) {
  const response = await fetch(`${BASE_URL}/devices/${deviceName}/fase1?duration=${duration}`, { method: 'POST' });
  if (!response.ok) throw new Error('Error al activar la fase 1');
}

export async function fase2(deviceName: string) {
  const response = await fetch(`${BASE_URL}/devices/${deviceName}/fase2`, { method: 'POST' });
  if (!response.ok) throw new Error('Error al activar la fase 2');
}

export async function fase3(deviceName: string) {
  const response = await fetch(`${BASE_URL}/devices/${deviceName}/fase3`, { method: 'POST' });
  if (!response.ok) throw new Error('Error al activar la fase 3');
}

export async function fase4(deviceName: string) {
  const response = await fetch(`${BASE_URL}/devices/${deviceName}/fase4`, { method: 'POST' });
  if (!response.ok) throw new Error('Error al activar la fase 4');
}

export async function fase5(deviceName: string) {
  const response = await fetch(`${BASE_URL}/devices/${deviceName}/fase5`, { method: 'POST' });
  if (!response.ok) throw new Error('Error al activar la fase 5');
}