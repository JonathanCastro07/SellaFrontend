// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './components/login/login';
import { CrearRifa } from './components/crear-rifa/crear-rifa';
import { TableroRifa } from './components/tablero-rifa/tablero-rifa';
import { PanelOrganizador } from './components/panel-organizador/panel-organizador';
import { MisRifas } from './components/mis-rifas/mis-rifas';
import { ContactosRifa } from './components/contactos-rifa/contactos-rifa';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'rifas/:id', component: TableroRifa },
  { path: 'organizador/mis-rifas', component: MisRifas, canActivate: [authGuard] },
  { path: 'organizador/crear', component: CrearRifa, canActivate: [authGuard] },
  { path: 'organizador/rifas/:id', component: PanelOrganizador, canActivate: [authGuard] },
    { path: 'organizador/rifas/:id/contactos', component: ContactosRifa, canActivate: [authGuard] },

];
