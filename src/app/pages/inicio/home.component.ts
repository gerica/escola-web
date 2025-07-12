import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService, LoadingProgressService, LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { InnercardComponent } from "../../shared/components/innercard/innercard.component";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../pages.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    InnercardComponent
]
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly contratoService = inject(ContratoService);


  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getOutoContrato() {
    this.spinner.showUntilCompleted(this.contratoService.getOutroContrato()).subscribe({
      next: (result) => {
        this.notification.showSuccess(result);
      },
      error: (err) => {
        this.notification.showError(err.message);
      }
    });
  }

}