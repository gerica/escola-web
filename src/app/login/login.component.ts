import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // <-- Importe este!
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoadingSpinnerService, NotificationService } from '../core/services';
import { AppConfigService } from '../core/services/app.config.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    // MatProgressBarModule,
  ],
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly appConfigService = inject(AppConfigService);

  error = signal("");
  form!: UntypedFormGroup;

  ngOnInit() {

    this.createForm();
  }

  private createForm() {
    const savedUserEmail = localStorage.getItem('savedUserEmail');

    this.form = new UntypedFormGroup({
      username: new UntypedFormControl(savedUserEmail, [Validators.required]),
      password: new UntypedFormControl('6vkWITTQcIKO2y1PEP6mPM', Validators.required),
      rememberMe: new UntypedFormControl(savedUserEmail !== null)
    });
  }

  submit(): void {
    const username = this.form.get('username')?.value;
    const password = this.form.get('password')?.value;
    const rememberMe = this.form.get('rememberMe')?.value;

    this.spinner.showUntilCompleted(this.authService.login(username, password)).subscribe({
      next: () => {
        if (rememberMe) {
          localStorage.setItem('savedUserEmail', username);
        } else {
          localStorage.removeItem('savedUserEmail');
        }
        this.notification.showSuccess('Login realizado com sucesso!');
        this.router.navigate(['/']); // Redireciona para a página principal (editor)
      },
      error: (err) => {
        this.notification.showSuccess(err.message);
        // this.error.set(err.message);
      }
    });
  }
  resetPassword() {
    this.router.navigate(['/auth/password-reset-request']);
  }
}