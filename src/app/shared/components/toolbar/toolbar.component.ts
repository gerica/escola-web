import { Component, Input, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { APP_CONFIG, MenuItem } from 'src/app/core/models';
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

  @Input() menu!: MenuItem[];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
