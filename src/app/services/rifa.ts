// services/rifa.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rifa, CrearRifaRequest } from '../models/rifa.model';
import { ApartarNumeroRequest } from '../models/numero.model';
import { RifaOrganizador } from '../models/rifa-organizador.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RifaService {
private readonly API_URL = `${environment.apiUrl}/rifas`;

  constructor(private http: HttpClient) {}

  crear(request: CrearRifaRequest): Observable<Rifa> {
    return this.http.post<Rifa>(this.API_URL, request);
  }

  verTablero(id: number): Observable<Rifa> {
    return this.http.get<Rifa>(`${this.API_URL}/${id}`);
  }

  apartarNumero(rifaId: number, numero: string, request: ApartarNumeroRequest): Observable<string> {
    return this.http.post(
      `${this.API_URL}/${rifaId}/numeros/${numero}/apartar`,
      request,
      { responseType: 'text' }
    );
  }

  subirComprobante(rifaId: number, numero: string, archivo: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', archivo);

    return this.http.post(
      `${this.API_URL}/${rifaId}/numeros/${numero}/comprobante`,
      formData,
      { responseType: 'text' }
    );
  }

  confirmarPago(rifaId: number, numero: string): Observable<string> {
    return this.http.post(
      `${this.API_URL}/${rifaId}/numeros/${numero}/confirmar`,
      {},
      { responseType: 'text' }
    );
  }

  rechazarPago(rifaId: number, numero: string): Observable<string> {
    return this.http.post(
      `${this.API_URL}/${rifaId}/numeros/${numero}/rechazar`,
      {},
      { responseType: 'text' }
    );
  }

  misRifas(): Observable<Rifa[]> {
  return this.http.get<Rifa[]>(`${this.API_URL}/mias`);
  }

marcarSorteada(rifaId: number, numeroGanador: string): Observable<string> {
  return this.http.post(
    `${this.API_URL}/${rifaId}/marcar-sorteada`,
    { numeroGanador },
    { responseType: 'text' }
  );
  }

  verComoOrganizador(id: number): Observable<RifaOrganizador> {
  return this.http.get<RifaOrganizador>(`${this.API_URL}/${id}/organizador`);
  }
}
