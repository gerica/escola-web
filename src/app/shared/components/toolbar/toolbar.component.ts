import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { APP_CONFIG, APP_USER, MenuItem } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [RouterModule, MatMenuModule, MatIconModule]
})
export class ToolbarComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  appConfig = inject(APP_CONFIG);

  appUser = inject(APP_USER);

  @Input() menu!: MenuItem[];

  onMenuClick(item: MenuItem): void {
    // Special handling for dynamic routes like 'empresa/manter/:id'
    console.log(item.router);
    if (item.router.includes(':id')) {
      const empresaId = this.appUser()?.empresa?.id;
      if (empresaId) {
        const finalRoute = item.router.replace(':id', String(empresaId));
        this.router.navigate([finalRoute]);
      } else {
        console.error('User does not have an associated company to navigate to the company page.');
      }
    } else {
      this.router.navigate([item.router]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
