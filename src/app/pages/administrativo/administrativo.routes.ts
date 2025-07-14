import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
// import Cliente from 'src/app/shared/models/cliente';
// import { ClienteService } from 'src/app/shared/services/cliente.service';
import { NotFoundComponent } from '../not-found';
import { ManterComp } from './manter/comp';
import { CHAVE_CONTRATO_CIDADE_PADRAO, Parametro } from 'src/app/shared/models/parametro';
import { LoadingSpinnerService } from 'src/app/core/services';
import { AdministrativoService } from 'src/app/shared/services/admin.service';

// const localResolverCidadePadrao: ResolveFn<Parametro> = route => {
//   return inject(LoadingSpinnerService).showUntilCompleted(inject(AdministrativoService).findByChave(CHAVE_CONTRATO_CIDADE_PADRAO)!)
//   ;
// };

const routes: Routes = [
  {
    path: '',
    component: ManterComp,
    // resolve: { cidadePadrao: localResolverCidadePadrao },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativoRoutes { }
