import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  private readonly sanitizer = inject(DomSanitizer);
  readonly authService = inject(AuthService);

  appConfig = inject(APP_CONFIG);
  appUser = inject(APP_USER);

  @Input() menu!: MenuItem[];

  // ⭐️ Novo: Signal Computado para o logo
  logoUrl = computed<SafeUrl | undefined>(() => {
    const user = this.appUser();
    // Verifique se o usuário e o logo existem para evitar erros
    if (user && user.empresa && user.empresa.logo && user.empresa.logo.conteudoBase64) {
      const { mimeType, conteudoBase64 } = user.empresa.logo;
      const base64WithPrefix = `data:${mimeType};base64,${conteudoBase64}`;
      return this.sanitizer.bypassSecurityTrustUrl(base64WithPrefix);
    }
    return undefined; // Retorna undefined se o logo não existir
  });

  onMenuClick(item: MenuItem): void {
    // Special handling for dynamic routes like 'empresa/manter/:id'    
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
