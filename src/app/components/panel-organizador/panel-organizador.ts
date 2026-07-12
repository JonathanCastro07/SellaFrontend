import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { RifaService } from '../../services/rifa';
import { Rifa } from '../../models/rifa.model';
import { RifaOrganizador } from '../../models/rifa-organizador.model';

@Component({
  selector: 'app-panel-organizador',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './panel-organizador.html',
  styleUrl: './panel-organizador.css'
})

export class PanelOrganizador implements OnInit {
  private route = inject(ActivatedRoute);
  private rifaService = inject(RifaService);
 
  rifaId = Number(this.route.snapshot.paramMap.get('id'));
  rifa = signal<RifaOrganizador | null>(null);
  cargando = signal(true);
  errorMensaje = signal<string | null>(null);
  procesando = signal<string | null>(null);
  marcandoSorteada = signal(false);
  copiado = signal(false);
 
  pendientes = computed(() =>
    this.rifa()?.numeros.filter(n => n.estado === 'PENDIENTE') ?? []
  );
 
  pagados = computed(() =>
    this.rifa()?.numeros.filter(n => n.estado === 'PAGADO') ?? []
  );
 
  ngOnInit(): void {
    this.cargarTablero();
  }
 
  cargarTablero(): void {
    this.cargando.set(true);
    this.rifaService.verComoOrganizador(this.rifaId).subscribe({
      next: (rifa) => {
        this.rifa.set(rifa);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err.error?.message ?? 'No se pudo cargar la rifa');
      }
    });
  }
 
  confirmar(numero: string): void {
    this.procesando.set(numero);
    this.rifaService.confirmarPago(this.rifaId, numero).subscribe({
      next: () => {
        this.procesando.set(null);
        this.cargarTablero();
      },
      error: (err) => {
        this.procesando.set(null);
        this.errorMensaje.set(err.error?.message ?? 'Error al confirmar el pago');
      }
    });
  }
 
  rechazar(numero: string): void {
    this.procesando.set(numero);
    this.rifaService.rechazarPago(this.rifaId, numero).subscribe({
      next: () => {
        this.procesando.set(null);
        this.cargarTablero();
      },
      error: (err) => {
        this.procesando.set(null);
        this.errorMensaje.set(err.error?.message ?? 'Error al rechazar el pago');
      }
    });
  }

  marcarSorteada(): void {
    const numero = prompt('¿Cuál fue el número ganador?');
    if (!numero) return;

    this.marcandoSorteada.set(true);
    this.rifaService.marcarSorteada(this.rifaId, numero.trim()).subscribe({
      next: () => {
        this.marcandoSorteada.set(false);
        this.cargarTablero();
      },
      error: (err) => {
        this.marcandoSorteada.set(false);
        this.errorMensaje.set(err.error?.message ?? 'Error al marcar la rifa como sorteada');
      }
    });
  }

  linkPublico(): string {
    return `${window.location.origin}/rifas/${this.rifaId}`;
  }

  copiarLink(): void {
    navigator.clipboard.writeText(this.linkPublico()).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    });
  }
}