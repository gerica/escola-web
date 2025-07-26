import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Menu, MenuItem } from '../core/models';
import { AuthService, NotificationService } from '../core/services';
import { InnercardComponent, ToolbarComponent } from '../shared/components';
import { MatButtonModule } from '@angular/material/button';

@Component({
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    ToolbarComponent,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    InnercardComponent
  ]

})
export class PagesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);
  authService = inject(AuthService);

  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  opened = signal(false);
  over = signal<MatDrawerMode>('side');

  ngOnInit(): void {
    this._carregarMenu();
  }

  endImpersonation(): void {
    this.authService.endImpersonation();
    this.notification.showSuccess('Sessão de suporte finalizado com sucesso!');
    this._carregarMenu();
    this.router.navigate(['/']); // Redireciona para a página principal (editor)
  }

  private _carregarMenu() {
    this.authService.carregarMenu();

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.sidenav.close();
    });

    this.opened.set(false);
    this.over.set('side');
  }
}
