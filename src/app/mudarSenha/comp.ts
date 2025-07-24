import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoadingSpinnerService, NotificationService } from '../core/services';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const newPasswordAgain = control.get('newPasswordAgain');

  return newPassword && newPasswordAgain && newPassword.value !== newPasswordAgain.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-mudar-senha',
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
export class Comp implements OnInit {
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
      username: new UntypedFormControl(savedUserEmail, [Validators.required]),
      newPassword: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
      newPasswordAgain: new UntypedFormControl('', Validators.required),
    }, { validators: passwordMatchValidator });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { newPassword } = this.form.value;

    // Supondo que você tenha um método changePassword em seu authService
    this.spinner.showUntilCompleted(
      this.authService.changePassword(newPassword)
    ).subscribe({
      next: () => {
        this.notification.showSuccess('Senha alterada com sucesso!');
        this.router.navigate(['/']); // Redireciona para a página de login
      },
      error: (err) => {
        // É uma boa prática usar um método específico para erros
        this.notification.showError(err.message || 'Ocorreu um erro ao alterar a senha.');
        this.error.set(err.message || 'Ocorreu um erro ao alterar a senha.');
      }
    });
    // console.log("Formulário enviado!", { username, password, newPassword });
    // this.notification.showSuccess('Lógica de mudança de senha a ser implementada.');
    // this.router.navigate(['/login']);
  }
}