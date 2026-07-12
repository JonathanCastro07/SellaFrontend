// components/login/login.ts
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  modoRegistro = signal(false);
  cargando = signal(false);
  errorMensaje = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleModo(): void {
    this.modoRegistro.update(v => !v);
    this.errorMensaje.set(null);
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/organizador/mis-rifas']);  
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err.error?.message ?? 'Error al iniciar sesión');
      }
    });
    
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;
    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        this.modoRegistro.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMensaje.set(err.error?.message ?? 'Error al registrar');
      }
    });
  }

  
}