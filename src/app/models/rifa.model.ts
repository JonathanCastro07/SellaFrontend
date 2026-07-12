// models/rifa.model.ts
import { Numero } from './numero.model'

export interface Rifa {
  id: number;
  nombre: string;
  digitos: number;
  precio: number;
  loteriaRef: string | null;
  fechaSorteo: string | null;
  cuentaPago: String;
  estado: 'ACTIVA' | 'CERRADA' | 'SORTEADA';
  numeroGanador: String | null;
  numeros: Numero[];
}

export interface CrearRifaRequest {
  nombre: string;
  digitos: number;
  precio: number;
  loteriaRef?: string;
  fechaSorteo?: string;
  cuentaPago: string;
}