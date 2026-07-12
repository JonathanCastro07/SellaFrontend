// components/tablero-rifa/tablero-rifa.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RifaService } from '../../services/rifa';
import { Rifa } from '../../models/rifa.model';
import { Numero } from '../../models/numero.model';

@Component({
  selector: 'app-tablero-rifa',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './tablero-rifa.html',
  styleUrl: './tablero-rifa.css'
})
export class TableroRifa implements OnInit {
  private route = inject(ActivatedRoute);
  private rifaService = inject(RifaService);
  private fb = inject(FormBuilder);

  rifaId = Number(this.route.snapshot.paramMap.get('id'));
  rifa = signal<Rifa | null>(null);
  cargando = signal(true);
  errorMensaje = signal<string | null>(null);

  numeroSeleccionado = signal<string | null>(null);
  apartando = signal(false);

  numeroParaComprobante = signal<string | null>(null);
  archivoSeleccionado = signal<File | null>(null);
  subiendoComprobante = signal(false);
  comprobanteMensaje = signal<string | null>(null);

form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    celular: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    this.cargarTablero();
  }

  cargarTablero(): void {
    this.cargando.set(true);
    this.rifaService.verTablero(this.rifaId).subscribe({
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

  seleccionar(numero: Numero): void {
    if (numero.estado !== 'DISPONIBLE') return;
    this.numeroSeleccionado.set(numero.numero);
    this.errorMensaje.set(null);
    this.form.reset();
  }

  cerrarModal(): void {
    this.numeroSeleccionado.set(null);
  }

  onApartar(): void {
    if (this.form.invalid || !this.numeroSeleccionado()) return;
    this.apartando.set(true);
    const numero = this.numeroSeleccionado()!;

    this.rifaService.apartarNumero(this.rifaId, numero, this.form.getRawValue()).subscribe({
      next: () => {
        this.apartando.set(false);
        this.numeroSeleccionado.set(null);
        this.numeroParaComprobante.set(numero);
        this.cargarTablero();
      },
      error: (err) => {
        this.apartando.set(false);
        this.errorMensaje.set(err.error?.message ?? 'Error al apartar el número');
      }
    });
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.archivoSeleccionado.set(input.files?.[0] ?? null);
  }

  subirComprobante(): void {
    const numero = this.numeroParaComprobante();
    const archivo = this.archivoSeleccionado();
    if (!numero || !archivo) return;

    this.subiendoComprobante.set(true);
    this.rifaService.subirComprobante(this.rifaId, numero, archivo).subscribe({
      next: () => {
        this.subiendoComprobante.set(false);
        this.comprobanteMensaje.set('¡Comprobante subido! El organizador confirmará tu pago pronto.');
        this.numeroParaComprobante.set(null);
        this.archivoSeleccionado.set(null);
      },
      error: (err) => {
        this.subiendoComprobante.set(false);
        this.comprobanteMensaje.set(err.error?.message ?? 'Error al subir el comprobante');
      }
    });
  }

omitirComprobante(): void {
  const confirmado = confirm(
    '¿Seguro que quieres continuar sin subir el comprobante?\n\n' +
    'Si no confirmas tu pago dentro de las próximas 24 horas, ' +
    'el número quedará disponible de nuevo para otra persona.'
  );

  if (confirmado) {
    this.numeroParaComprobante.set(null);
  }
}
}
