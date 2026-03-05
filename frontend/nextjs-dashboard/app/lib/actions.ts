//Funcinoes de confirmacion de la API en python
// const BASE_URL = 'http://localhost:3333'
const BASE_URL = 'http://localhost:8000';

//Fases del motor y válvulas
export async function fase(fase: number) {
  const response = await fetch(`${BASE_URL}/${fase}`, { method: 'POST' });
  if (!response.ok) throw new Error('Error al activar la fase 1');
}