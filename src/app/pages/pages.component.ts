import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawerMode, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Menu, MenuItem } from '../core/models';
import { AuthService } from '../core/services';
import { ToolbarComponent } from '../shared/components';

@Component({
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    ToolbarComponent,    
    MatSidenavModule,
    MatListModule
  ]

})
export class PagesComponent implements OnInit {
  private readonly router = inject(Router);
  private userService = inject(AuthService);

  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;

  opened = signal(false);
  over = signal<MatDrawerMode>('side');

  menu: MenuItem[] = [];

  ngOnInit(): void {
    const user = this.userService.loggedUser();
    this.menu = Menu.montarMenuPorPerfis(user?.roles);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.sidenav.close();
    });

    this.opened.set(false);
    this.over.set('side');

  }
}
