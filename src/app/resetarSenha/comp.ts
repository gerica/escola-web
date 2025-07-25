import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoadingSpinnerService, NotificationService } from '../core/services';


@Component({
  selector: 'app-resetar-senha',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class CompResetSenha implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly spinner = inject(LoadingSpinnerService);

  error = signal("");
  form!: UntypedFormGroup;

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    const savedUserEmail = localStorage.getItem('savedUserEmail');

    this.form = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { email } = this.form.value;

    // Supondo que você tenha um método changePassword em seu authService
    this.spinner.showUntilCompleted(
      this.authService.resetPassword(email)
    ).subscribe({
      next: (result) => {
        this.notification.showSuccess(result);
        this.router.navigate(['/']); // Redireciona para a página de login
      },
      error: (err) => {
        // É uma boa prática usar um método específico para erros
        this.notification.showError(err.message || 'Ocorreu um erro ao resetar a senha.');
        this.error.set(err.message || 'Ocorreu um erro ao resetar a senha.');
      }
    });
  }
}