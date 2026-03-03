// Clase para almacenar las fuentes que se van a utilizar en el proyecto

import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({subsets: ['latin']})

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});