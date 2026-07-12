import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { RifaService } from '../../services/rifa';
import { AuthService } from '../../services/auth';
import { Rifa } from '../../models/rifa.model';

@Component({
  selector: 'app-mis-rifas',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './mis-rifas.html',
  styleUrl: './mis-rifas.css'
})
export class MisRifas implements OnInit {
  private rifaService = inject(RifaService);
  private authService = inject(AuthService);
  private router = inject(Router);

  rifas = signal<Rifa[]>([]);
  cargando = signal(true);
  errorMensaje = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarRifas();
  }

  cargarRifas(): void {
    this.cargando.set(true);
    this.rifaService.misRifas().subscribe({
      next: (rifas) => {
        this.rifas.set(rifas);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err.error?.message ?? 'No se pudieron cargar tus rifas');
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
