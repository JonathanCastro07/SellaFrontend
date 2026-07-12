// models/numero.model.ts
export interface Numero {
  numero: string;
  estado: 'DISPONIBLE' | 'PENDIENTE' | 'PAGADO';
}

export interface ApartarNumeroRequest {
  nombre: string;
  celular: string;
  email: String;
}