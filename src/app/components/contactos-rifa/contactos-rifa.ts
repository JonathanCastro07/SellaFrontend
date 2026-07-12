import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RifaService } from '../../services/rifa';
import { RifaOrganizador } from '../../models/rifa-organizador.model';

@Component({
  selector: 'app-contactos-rifa',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './contactos-rifa.html',
  styleUrl: './contactos-rifa.css'
})
export class ContactosRifa implements OnInit {
  private route = inject(ActivatedRoute);
  private rifaService = inject(RifaService);

  rifaId = Number(this.route.snapshot.paramMap.get('id'));
  rifa = signal<RifaOrganizador | null>(null);
  cargando = signal(true);
  errorMensaje = signal<string | null>(null);

  pagados = computed(() =>
    this.rifa()?.numeros.filter(n => n.estado === 'PAGADO') ?? []
  );

  ngOnInit(): void {
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
}