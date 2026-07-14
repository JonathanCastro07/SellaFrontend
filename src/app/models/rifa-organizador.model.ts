export interface Comprador {
  nombre: string;
  celular: string;
  urlComprobante: string | null;
}

export interface NumeroOrganizador {
  numero: string;
  estado: 'DISPONIBLE' | 'PENDIENTE' | 'PAGADO';
  comprador: Comprador | null;
}

export interface RifaOrganizador {
  id: number;
  nombre: string;
  digitos: number;
  precio: number;
  loteriaRef: string | null;
  fechaSorteo: string | null;
  estado: 'ACTIVA' | 'CERRADA' | 'SORTEADA';
  numeroGanador: String | null;
  numeros: NumeroOrganizador[];
}