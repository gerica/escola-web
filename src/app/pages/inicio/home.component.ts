import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { UserRole } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services';
import { CardComponent } from 'src/app/shared/components';
import { FinanceiroResumoGraficoComponent } from '../painel/financeiro/componente/resumo.grafico';
import { FinanceiroResumoTabelaComponent } from '../painel/financeiro/componente/resumo.tabela';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../pages.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    CardComponent,
    FinanceiroResumoGraficoComponent,
    FinanceiroResumoTabelaComponent
  ]
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  // private readonly router = inject(Router);
  // private readonly authService = inject(AuthService);
  // private readonly notification = inject(NotificationService);
  // private readonly spinner = inject(LoadingSpinnerService);
  // private readonly contratoService = inject(ContratoService);


  isUsuarioTemPapel(): boolean {
    // Exemplo em um componente ou serviço
    const rolesPermitidas = [UserRole.ADMIN_EMPRESA, UserRole.FINANCEIRO];

    return this.authService.isUsuarioTemPapel(rolesPermitidas) || false;
  }

}