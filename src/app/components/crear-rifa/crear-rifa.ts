// components/crear-rifa/crear-rifa.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RifaService } from '../../services/rifa';
import { Rifa } from '../../models/rifa.model';

@Component({
  selector: 'app-crear-rifa',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './crear-rifa.html',
  styleUrl: './crear-rifa.css'
})
export class CrearRifa {
  private fb = inject(FormBuilder);
  private rifaService = inject(RifaService);
  private router = inject(Router);

  cargando = signal(false);
  errorMensaje = signal<string | null>(null);
  rifaCreada = signal<Rifa | null>(null);
  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    digitos: [2, [Validators.required, Validators.min(2), Validators.max(3)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    loteriaRef: [''],
    fechaSorteo: [''],
    cuentaPago: ['', Validators.required]
    
  });


copiado = signal(false);

onSubmit(): void {
    if (this.form.invalid) return;
    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.rifaService.crear(this.form.getRawValue()).subscribe({
      next: (rifa) => {
        this.cargando.set(false);
        this.rifaCreada.set(rifa);   // ← ya no navega directo
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err.error?.message ?? 'Error al crear la rifa');
      }
    });
  }

  linkPublico(): string {
    const rifa = this.rifaCreada();
    return rifa ? `${window.location.origin}/rifas/${rifa.id}` : '';
  }

  copiarLink(): void {
    navigator.clipboard.writeText(this.linkPublico()).then(() => {
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 2000);
    });
  }

  irAlPanel(): void {
    const rifa = this.rifaCreada();
    if (rifa) {
      this.router.navigate(['/organizador/rifas', rifa.id]);
    }
  }
}